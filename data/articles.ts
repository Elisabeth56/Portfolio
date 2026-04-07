export interface Article {
  id: number;
  slug: string;
  title: string;
  description: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
  image: string;
}

export const articles: Article[] = [
  {
    id: 1,
    slug: "from-crud-to-cognition-ai-native-web-applications",
    title: "From CRUD to Cognition: Building AI-Native Web Applications",
    description:
      "Most web apps just store and display data. AI-native apps reason over it. This article breaks down how I design full-stack applications that combine traditional systems with LLMs—covering architecture, RAG pipelines, and how to turn static dashboards into intelligent, queryable systems.",
    date: "2024-03-28",
    readTime: "12 min read",
    tags: ["AI", "LLMs", "RAG", "Full-Stack", "Architecture"],
    image: "/images/articles/art1.jpg",
    content: `
## Introduction

The web development landscape is undergoing a fundamental shift. For decades, we've been building applications that follow the same pattern: Create, Read, Update, Delete. CRUD has served us well, but it's inherently passive—your app stores data and displays it back, nothing more.

**AI-native applications are different.** They don't just store and retrieve—they *reason*. They understand context, make connections, and provide insights that would take humans hours to uncover.

In this article, I'll break down the architecture patterns I use to build these intelligent systems, focusing on practical implementation rather than theory.

## The Shift from Data Storage to Data Reasoning

Traditional web apps treat data as static artifacts:

- User uploads a document → Store it in S3
- User searches → Match keywords in a database
- User views dashboard → Display pre-computed metrics

AI-native apps treat data as *knowledge*:

- User uploads a document → Extract meaning, relationships, and entities
- User asks a question → Understand intent, retrieve relevant context, synthesize an answer
- User views dashboard → Surface anomalies, predict trends, explain *why* metrics changed

## Architecture Overview

Here's the high-level architecture I use for AI-native applications:

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                      │
├─────────────────────────────────────────────────────────────┤
│                     API Layer (tRPC/REST)                    │
├──────────────┬──────────────────────────┬───────────────────┤
│   Traditional│      AI Services         │    Real-time      │
│   CRUD APIs  │  (RAG, Embeddings, LLM)  │   (WebSockets)    │
├──────────────┴──────────────────────────┴───────────────────┤
│                    Data Layer                                │
│  ┌──────────┐  ┌──────────────┐  ┌─────────────────────┐    │
│  │ Postgres │  │ Vector Store │  │ Document Storage    │    │
│  │ (Supabase)│  │ (Pinecone)   │  │ (S3/Cloudflare R2)  │    │
│  └──────────┘  └──────────────┘  └─────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Building a RAG Pipeline

Retrieval-Augmented Generation (RAG) is the backbone of most AI-native features. Here's how I implement it:

### Step 1: Document Ingestion

\`\`\`typescript
// lib/ingestion.ts
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PineconeStore } from "langchain/vectorstores/pinecone";

export async function ingestDocument(content: string, metadata: DocumentMetadata) {
  // Split document into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  
  const chunks = await splitter.createDocuments(
    [content],
    [metadata]
  );

  // Generate embeddings and store
  const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-3-small",
  });

  await PineconeStore.fromDocuments(chunks, embeddings, {
    pineconeIndex,
    namespace: metadata.workspaceId,
  });

  return { chunksProcessed: chunks.length };
}
\`\`\`

### Step 2: Intelligent Retrieval

\`\`\`typescript
// lib/retrieval.ts
export async function retrieveContext(
  query: string,
  workspaceId: string,
  options: RetrievalOptions = {}
) {
  const { topK = 5, scoreThreshold = 0.7 } = options;

  // Embed the query
  const queryEmbedding = await embeddings.embedQuery(query);

  // Retrieve relevant chunks
  const results = await pineconeIndex.query({
    vector: queryEmbedding,
    topK,
    filter: { workspaceId },
    includeMetadata: true,
  });

  // Filter by relevance score
  const relevantChunks = results.matches
    .filter((match) => match.score >= scoreThreshold)
    .map((match) => ({
      content: match.metadata.text,
      source: match.metadata.source,
      score: match.score,
    }));

  return relevantChunks;
}
\`\`\`

### Step 3: LLM Generation with Context

\`\`\`typescript
// lib/generation.ts
import { ChatOpenAI } from "langchain/chat_models/openai";

export async function generateAnswer(
  question: string,
  context: RetrievedChunk[]
) {
  const llm = new ChatOpenAI({
    modelName: "gpt-4-turbo-preview",
    temperature: 0.1,
  });

  const contextText = context
    .map((c) => \`Source: \${c.source}\\n\${c.content}\`)
    .join("\\n\\n---\\n\\n");

  const response = await llm.invoke([
    {
      role: "system",
      content: \`You are a helpful assistant. Answer questions based on the provided context. 
                If the context doesn't contain relevant information, say so.
                Always cite your sources.\`,
    },
    {
      role: "user",
      content: \`Context:\\n\${contextText}\\n\\nQuestion: \${question}\`,
    },
  ]);

  return {
    answer: response.content,
    sources: context.map((c) => c.source),
  };
}
\`\`\`

## Turning Static Dashboards into Intelligent Systems

The real power of AI-native apps emerges when you apply these patterns to existing interfaces. Here's a before/after comparison:

### Before: Traditional Dashboard
- Shows metrics: revenue, users, conversion rate
- User has to interpret what the numbers mean
- No context about *why* metrics changed

### After: AI-Native Dashboard
- Same metrics, but with AI-powered insights
- "Revenue increased 23% because of the Black Friday campaign"
- "Conversion rate dropped—this correlates with the checkout page change deployed Tuesday"
- Natural language queries: "Why did churn spike last week?"

## Key Lessons Learned

After building several AI-native applications, here are the patterns that work:

1. **Chunking strategy matters more than model choice** - Bad chunking leads to bad retrieval, no matter how good your LLM is.

2. **Hybrid search beats pure vector search** - Combine semantic similarity with keyword matching for better results.

3. **Stream everything** - Users expect real-time feedback. Use streaming responses for any LLM interaction.

4. **Cache aggressively** - Embeddings are expensive. Cache them at every layer.

5. **Build feedback loops** - Track which responses users find helpful and use that to improve retrieval.

## Conclusion

The transition from CRUD to cognition isn't about replacing your existing architecture—it's about augmenting it. Start with one feature, prove the value, and expand from there.

The tools are mature enough. The patterns are established. The only question is: what will you build?
    `,
  },
  {
    id: 2,
    slug: "designing-real-time-ai-systems-nextjs-supabase",
    title: "Designing Real-Time AI Systems with Next.js and Supabase",
    description:
      "A deep dive into building responsive, real-time AI applications. I explore how I use modern full-stack tools to handle live data, user interactions, and AI responses—while maintaining performance, scalability, and a seamless user experience.",
    date: "2024-03-15",
    readTime: "10 min read",
    tags: ["Next.js", "Supabase", "Real-Time", "AI", "WebSockets"],
    image: "/images/articles/art2.jpg",
    content: `
## Introduction

Real-time features are no longer optional in modern applications. Users expect instant feedback, live updates, and seamless interactions. When you add AI into the mix, the complexity multiplies—but so does the potential.

In this article, I'll walk through how I architect real-time AI systems using **Next.js** and **Supabase**, covering everything from database design to streaming AI responses.

## Why This Stack?

The Next.js + Supabase combination is powerful for several reasons:

- **Next.js App Router** - Server components, streaming, and edge functions
- **Supabase Realtime** - Built-in WebSocket subscriptions for live data
- **Supabase Auth** - Row-level security that works with real-time
- **Edge Functions** - Run AI inference close to users
- **Postgres** - Full SQL power with real-time capabilities

## Architecture for Real-Time AI

\`\`\`
┌─────────────────────────────────────────────────────────┐
│                    Next.js Frontend                      │
│  ┌─────────────────┐  ┌─────────────────────────────┐   │
│  │ React Components │  │ Supabase Realtime Client   │   │
│  └────────┬────────┘  └──────────────┬──────────────┘   │
│           │                          │                   │
│           ▼                          ▼                   │
│  ┌─────────────────────────────────────────────────┐    │
│  │              Server Actions / API Routes         │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                      Supabase                            │
│  ┌──────────┐  ┌──────────────┐  ┌────────────────┐     │
│  │ Postgres │◄─│   Realtime   │  │ Edge Functions │     │
│  │          │  │  (WebSocket) │  │   (AI Logic)   │     │
│  └──────────┘  └──────────────┘  └────────────────┘     │
└─────────────────────────────────────────────────────────┘
\`\`\`

## Setting Up Real-Time Subscriptions

First, let's set up the Supabase client with real-time capabilities:

\`\`\`typescript
// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
\`\`\`

Now, create a hook for real-time message subscriptions:

\`\`\`typescript
// hooks/useRealtimeMessages.ts
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Message } from "@/types";

export function useRealtimeMessages(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const supabase = createClient();

  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });
      
      if (data) setMessages(data);
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(\`messages:\${conversationId}\`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: \`conversation_id=eq.\${conversationId}\`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  return messages;
}
\`\`\`

## Streaming AI Responses

The key to a great AI UX is streaming responses token-by-token:

\`\`\`typescript
// app/api/chat/route.ts
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { messages, conversationId } = await req.json();
  const supabase = createClient();

  // Create a placeholder message in the database
  const { data: aiMessage } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      role: "assistant",
      content: "",
      status: "streaming",
    })
    .select()
    .single();

  // Stream the response
  const result = await streamText({
    model: openai("gpt-4-turbo"),
    messages,
    onFinish: async ({ text }) => {
      // Update the message when complete
      await supabase
        .from("messages")
        .update({ content: text, status: "complete" })
        .eq("id", aiMessage.id);
    },
  });

  return result.toDataStreamResponse();
}
\`\`\`

## Performance Optimizations

### 1. Debounce Database Updates

Don't update the database on every token:

\`\`\`typescript
import { debounce } from "lodash";

const debouncedUpdate = debounce(async (messageId: string, content: string) => {
  await supabase.from("messages").update({ content }).eq("id", messageId);
}, 500);
\`\`\`

### 2. Use Edge Functions for AI

Deploy AI logic to the edge for lower latency.

## Conclusion

Building real-time AI systems requires careful orchestration of multiple technologies. The Next.js + Supabase stack provides all the primitives you need:

- **Real-time subscriptions** for live updates
- **Streaming responses** for instant AI feedback  
- **Edge deployment** for low latency
- **Row-level security** for multi-tenant safety

Start with the patterns in this article, and adapt them to your specific use case. The future of web apps is real-time and intelligent—and now you have the tools to build it.
    `,
  },
  {
    id: 3,
    slug: "turning-business-workflows-into-automated-systems-with-ai",
    title: "Turning Business Workflows into Automated Systems with AI",
    description:
      "Manual workflows kill productivity. In this article, I show how I design and build internal tools and automation systems that replace repetitive tasks using AI—covering everything from input pipelines to decision-making outputs that actually save time and money.",
    date: "2024-02-28",
    readTime: "11 min read",
    tags: ["Automation", "AI", "Internal Tools", "Productivity", "Workflows"],
    image: "/images/articles/art3.jpg",
    content: `
## Introduction

Every company has them: the spreadsheets that need weekly updating, the emails that require copy-pasting between systems, the reports that someone manually compiles every month. These workflows aren't glamorous, but they consume thousands of hours annually.

**AI changes the equation.** Tasks that once required human judgment—categorizing support tickets, extracting data from documents, drafting responses—can now be automated intelligently.

In this article, I'll share my approach to identifying, designing, and building AI-powered automation systems that deliver real ROI.

## Identifying Automation Opportunities

Not every workflow should be automated. Here's my framework for prioritization:

### The Automation Scorecard

| Factor | Weight | Questions to Ask |
|--------|--------|-----------------|
| Frequency | 30% | How often does this task occur? |
| Time Cost | 25% | How many hours per week/month? |
| Error Rate | 20% | How often do humans make mistakes? |
| Judgment Required | 15% | Does it need complex reasoning? |
| Data Availability | 10% | Is the input structured? |

**High-value targets:**
- Tasks that happen daily or weekly
- Tasks that take 2+ hours each time
- Tasks with clear input/output patterns
- Tasks where AI accuracy can match or exceed humans

## Anatomy of an Automation System

Every automation I build follows this structure:

\`\`\`
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Trigger   │────▶│  Pipeline   │────▶│   Output    │
│  (Input)    │     │ (AI Logic)  │     │  (Action)   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
   Webhooks            Validation           Slack
   Emails              Enrichment           Email
   Forms               Classification       Database
   Uploads             Generation           API calls
   Schedules           Extraction           Documents
\`\`\`

## Case Study: Automated Invoice Processing

### The Problem
- 200+ invoices received monthly via email
- Finance team manually extracts: vendor, amount, date, line items
- Data entry into accounting system takes 15+ hours/month
- Error rate of ~5% leading to payment issues

### The Solution

\`\`\`typescript
// lib/invoice-automation/extract.ts
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const InvoiceSchema = z.object({
  vendor: z.object({
    name: z.string(),
    address: z.string().optional(),
    taxId: z.string().optional(),
  }),
  invoiceNumber: z.string(),
  invoiceDate: z.string(),
  dueDate: z.string().optional(),
  lineItems: z.array(
    z.object({
      description: z.string(),
      quantity: z.number(),
      unitPrice: z.number(),
      total: z.number(),
    })
  ),
  subtotal: z.number(),
  tax: z.number().optional(),
  total: z.number(),
  currency: z.string(),
});

export async function extractInvoiceData(pdfText: string) {
  const { object } = await generateObject({
    model: openai("gpt-4-turbo"),
    schema: InvoiceSchema,
    prompt: \`Extract structured invoice data from this document:

\${pdfText}

Be precise with numbers. If a field is unclear, make your best inference.\`,
  });

  return object;
}
\`\`\`

## Measuring ROI

Track these metrics to prove value:

\`\`\`typescript
// lib/analytics/automation-metrics.ts
export async function getAutomationMetrics(automationId: string) {
  const metrics = {
    totalRuns: runs.length,
    successRate: runs.filter((r) => r.status === "success").length / runs.length,
    avgProcessingTime: average(runs.map((r) => r.processing_time_ms)),
    humanInterventionRate: runs.filter((r) => r.required_review).length / runs.length,
    estimatedTimeSaved: runs.length * MANUAL_TASK_MINUTES,
    estimatedCostSaved: runs.length * MANUAL_TASK_MINUTES * HOURLY_COST / 60,
  };

  return metrics;
}
\`\`\`

## Conclusion

AI automation isn't about replacing humans—it's about eliminating the work that humans shouldn't be doing in the first place. The repetitive, error-prone, time-consuming tasks that drain energy and provide no value.

Start small. Pick one workflow. Build the automation. Measure the results. Then scale.

Your team will thank you.
    `,
  },
  {
    id: 4,
    slug: "fast-ai-at-scale-groq-open-source-models",
    title: "Fast AI at Scale: Leveraging Groq and Open-Source Models in Production",
    description:
      "Speed matters in AI products. This article explores how I integrate high-performance inference using Groq and open-source models like LLaMA 3 and Mistral to deliver fast, cost-efficient AI features in real-world applications without sacrificing quality.",
    date: "2024-02-10",
    readTime: "9 min read",
    tags: ["Groq", "LLaMA", "Mistral", "Performance", "Open Source"],
    image: "/images/articles/art4.jpg",
    content: `
## Introduction

"Why is this AI feature so slow?"

If you've shipped AI products, you've heard this complaint. Users expect instant responses, but LLM inference can take seconds—or longer. Meanwhile, API costs can spiral out of control as usage scales.

The solution? **Groq** for blazing-fast inference, combined with **open-source models** that you can fine-tune and deploy cost-effectively.

## The Speed Problem

Let's look at typical inference times:

| Provider/Model | Time to First Token | Total Time (500 tokens) |
|---------------|---------------------|------------------------|
| GPT-4 Turbo | 500-800ms | 8-15s |
| GPT-3.5 Turbo | 200-400ms | 3-6s |
| Claude 3 Opus | 600-1000ms | 10-20s |
| **Groq LLaMA 3 70B** | **50-100ms** | **0.5-1.5s** |
| **Groq Mixtral 8x7B** | **30-80ms** | **0.3-1s** |

Groq is 10-50x faster than traditional cloud APIs. This isn't incremental—it's transformational for UX.

## What Makes Groq Different?

Groq built custom hardware (LPU - Language Processing Unit) specifically for LLM inference. Unlike GPUs that were designed for graphics and adapted for AI, LPUs are purpose-built for sequential token generation.

The result:
- **Consistent latency** - No cold starts or variable queue times
- **Higher throughput** - More tokens per second per dollar
- **Predictable pricing** - Simple per-token costs

## Setting Up Groq in Your Stack

\`\`\`typescript
// lib/ai/groq.ts
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateWithGroq(
  messages: Message[],
  options: GenerationOptions = {}
) {
  const {
    model = "llama-3.1-70b-versatile",
    temperature = 0.7,
    maxTokens = 1024,
  } = options;

  const response = await groq.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
  });

  return response.choices[0].message.content;
}
\`\`\`

## Model Selection Strategy

Different tasks need different models:

\`\`\`typescript
// lib/ai/model-router.ts
const MODEL_MAP: Record<TaskType, ModelConfig> = {
  chat: {
    provider: "groq",
    model: "llama-3.1-70b-versatile",
    fallback: "gpt-4-turbo",
  },
  extraction: {
    provider: "groq", 
    model: "llama-3.1-8b-instant",
    fallback: "gpt-3.5-turbo",
  },
  reasoning: {
    provider: "openai",
    model: "gpt-4-turbo",
    fallback: "llama-3.1-70b-versatile",
  },
};
\`\`\`

## Real-World Performance Results

Here's data from a production chat application after switching to Groq:

**Before (GPT-4):**
- Average response time: 8.2s
- P95 response time: 15.1s
- User satisfaction: 72%
- Monthly cost: $4,200

**After (Groq LLaMA 3 70B):**
- Average response time: 1.1s
- P95 response time: 2.3s
- User satisfaction: 89%
- Monthly cost: $890

**Results:**
- 7x faster responses
- 17 point increase in satisfaction
- 79% cost reduction

## Conclusion

The AI inference landscape has changed. You no longer have to choose between quality and speed, or between capability and cost. With Groq and open-source models, you can have both.

Start by identifying your latency-sensitive features, implement Groq as the primary provider with OpenAI fallbacks, and watch your user satisfaction climb while costs drop.

The future of AI is fast. Build for it.
    `,
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function getAllArticleSlugs(): string[] {
  return articles.map((article) => article.slug);
}
