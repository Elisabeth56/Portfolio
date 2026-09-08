import { appColor, type AppId } from "@/components/icons/AppIcons";

/**
 * Each tile shows a specimen of the product rather than an abstract graph.
 * A node-and-edge glyph looks like every other AI landing page; a scrap of the
 * actual output tells you what the thing does before you click it.
 *
 * `lg` is the two-row tile and gets the fuller version.
 */

export function ProjectWidget({
  slug,
  size = "sm",
}: {
  slug: string;
  size?: "sm" | "lg";
}) {
  const c = appColor[slug as AppId];
  switch (slug) {
    case "prismos":
      return <Prism c={c} lg={size === "lg"} />;
    case "atlas-ai":
      return <Atlas c={c} lg={size === "lg"} />;
    case "finsight":
      return <FinSight c={c} lg={size === "lg"} />;
    case "farmtwin":
      return <FarmTwin c={c} lg={size === "lg"} />;
    case "flowmind":
      return <FlowMind c={c} lg={size === "lg"} />;
    default:
      return null;
  }
}

/* ---------------- shared bits ---------------- */

function Row({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-[10px] border border-line-soft bg-raised/70 px-2.5 py-1.5 ${className}`}
    >
      {children}
    </div>
  );
}

function Chip({
  children,
  color,
  solid,
}: {
  children: React.ReactNode;
  color?: string;
  solid?: boolean;
}) {
  return (
    <span
      className="t-mono shrink-0 rounded-full px-1.5 py-0.5 text-[0.625rem] leading-none"
      style={
        solid
          ? { background: color, color: "#0e0e10" }
          : {
              color,
              background: `${color}1f`,
              boxShadow: `inset 0 0 0 1px ${color}40`,
            }
      }
    >
      {children}
    </span>
  );
}

function Dot({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      className="size-1.5 shrink-0 rounded-full"
      style={{ background: color }}
    />
  );
}

const FLAG = "#e06b5d";
const OK = "#52bd9d";

/* ---------------- PrismOS — the agents disagreeing ---------------- */

function Prism({ c, lg }: { c: string; lg: boolean }) {
  return (
    <div className="flex h-full flex-col gap-1.5">
      {lg && (
        <>
          <div className="t-label text-fg-faint">step 1 · context</div>
          <Row>
            <Dot color={c} />
            <span className="t-mono text-[0.625rem] text-fg">
              Context Analyst
            </span>
            <span className="ml-auto t-mono text-[0.625rem] text-fg-muted">
              repo read · 4.2s · no tokens
            </span>
          </Row>
        </>
      )}

      <div className="t-label text-fg-faint">step 3 · parallel debate</div>

      <Row>
        <Dot color={c} />
        <span className="t-mono text-[0.625rem] text-fg">Architect</span>
        <span className="ml-auto truncate text-[0.6875rem] text-fg-muted">
          split the read path
        </span>
      </Row>

      <Row>
        <Dot color={c} />
        <span className="t-mono text-[0.625rem] text-fg">Engineer</span>
        <span className="ml-auto truncate text-[0.6875rem] text-fg-muted">
          keep it one service
        </span>
      </Row>

      <Row className="!border-flag/35">
        <Dot color={FLAG} />
        <span className="t-mono text-[0.625rem] text-fg">QA</span>
        <span className="ml-auto">
          <Chip color={FLAG}>SECURITY FLAG</Chip>
        </span>
      </Row>

      {lg && (
        <>
          <div className="my-0.5 flex items-center gap-2">
            <span className="h-px flex-1 bg-line-soft" />
            <span className="t-label text-fg-faint">release manager rules</span>
            <span className="h-px flex-1 bg-line-soft" />
          </div>

          <Row>
            <span className="t-mono text-[0.625rem] text-fg-muted">
              conflict log
            </span>
            <span className="ml-auto t-mono text-[0.625rem] text-fg">
              3 contested · 3 resolved
            </span>
          </Row>
        </>
      )}

      <div className="mt-auto flex items-center gap-2 pt-1">
        <Chip color={OK} solid>
          SHIPPABLE
        </Chip>
        <span className="t-mono text-[0.625rem] text-fg-faint">
          1 revision used
        </span>
      </div>
    </div>
  );
}

/* ---------------- Atlas — grounded match, then a gate ---------------- */

function Atlas({ c, lg }: { c: string; lg: boolean }) {
  return (
    <div className="flex h-full flex-col gap-1.5">
      <div className="t-label text-fg-faint">matched in datahub</div>

      <Row>
        <Dot color={c} />
        <span className="t-mono truncate text-[0.625rem] text-fg">
          stripe.charges
        </span>
        <span className="ml-auto t-nums t-mono text-[0.625rem]" style={{ color: c }}>
          92%
        </span>
      </Row>

      <Row>
        <Dot color={c} />
        <span className="t-mono truncate text-[0.625rem] text-fg">
          postgres.customers
        </span>
        <span className="ml-auto flex items-center gap-1.5">
          <Chip color={FLAG}>PII</Chip>
          <span className="t-nums t-mono text-[0.625rem]" style={{ color: c }}>
            88%
          </span>
        </span>
      </Row>

      {lg && (
        <Row>
          <Dot color={c} />
          <span className="t-mono truncate text-[0.625rem] text-fg">
            events.sessions
          </span>
          <span className="ml-auto t-nums t-mono text-[0.625rem]" style={{ color: c }}>
            71%
          </span>
        </Row>
      )}

      <div className="mt-auto flex items-center gap-2 pt-1">
        <span
          className="t-mono rounded-full px-2 py-1 text-[0.625rem] leading-none"
          style={{ background: c, color: "#0e0e10" }}
        >
          Approve context →
        </span>
        <span className="t-mono text-[0.625rem] text-fg-faint">
          paused, waiting
        </span>
      </div>
    </div>
  );
}

/* ---------------- FinSight — a document becoming rows ---------------- */

function FinSight({ c, lg }: { c: string; lg: boolean }) {
  const rows = [
    ["POS/SHOPRITE LEKKI", "₦12,400", "Groceries"],
    ["UBER *TRIP 4471", "₦3,150", "Transport"],
    ["TRF/MTN DATA", "₦5,000", "Utilities"],
  ];
  return (
    <div className="flex h-full flex-col gap-1.5">
      <div className="t-label flex items-center gap-1.5 text-fg-faint">
        statement.pdf
        <span aria-hidden style={{ color: c }}>
          →
        </span>
        categorised
      </div>

      {rows.slice(0, lg ? 3 : 2).map(([d, amt, cat]) => (
        <Row key={d}>
          <span className="t-mono truncate text-[0.625rem] text-fg-muted">
            {d}
          </span>
          <span className="ml-auto flex shrink-0 items-center gap-1.5">
            <span className="t-nums t-mono text-[0.625rem] text-fg">{amt}</span>
            <Chip color={c}>{cat}</Chip>
          </span>
        </Row>
      ))}

      <div className="mt-auto flex items-center gap-2 pt-1">
        <Chip color={FLAG}>anomaly · 2.4σ</Chip>
        <span className="t-mono text-[0.625rem] text-fg-faint">
          vs. your March baseline
        </span>
      </div>
    </div>
  );
}

/* ---------------- FarmTwin — offline, and cited ---------------- */

function FarmTwin({ c, lg }: { c: string; lg: boolean }) {
  return (
    <div className="flex h-full flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <span
          className="t-mono flex items-center gap-1.5 rounded-full px-2 py-1 text-[0.625rem] leading-none"
          style={{ color: c, background: `${c}1f`, boxShadow: `inset 0 0 0 1px ${c}40` }}
        >
          <span aria-hidden>⊗</span> offline
        </span>
        <span className="t-mono text-[0.625rem] text-fg-faint">
          Qwen2.5-3B · on device
        </span>
      </div>

      <Row className="items-start">
        <span className="text-[0.6875rem] leading-snug text-fg">
          “How much urea at 6 weeks?”
        </span>
      </Row>

      <Row className="items-start">
        <span className="text-[0.6875rem] leading-snug text-fg-muted">
          Split-apply 2 bags/ha at 6 WAP{lg ? ", banded 5 cm from the plant" : ""}.
        </span>
      </Row>

      <div className="mt-auto flex items-center gap-2 pt-1">
        <Chip color={c}>IITA · chunk 12</Chip>
        <span className="t-mono text-[0.625rem] text-fg-faint">cited</span>
      </div>
    </div>
  );
}

/* ---------------- FlowMind — capture becoming structure ---------------- */

function FlowMind({ c, lg }: { c: string; lg: boolean }) {
  return (
    <div className="flex h-full flex-col gap-1.5">
      <div className="t-label text-fg-faint">inbox · unstructured</div>

      <Row className="items-start">
        <span className="text-[0.6875rem] leading-snug text-fg">
          “chase the Paystack webhook thing before Friday”
        </span>
      </Row>

      <div className="flex items-center gap-1.5 pl-1">
        <span aria-hidden className="t-mono text-[0.625rem]" style={{ color: c }}>
          ↳
        </span>
        <span className="t-label text-fg-faint">auto-organised</span>
      </div>

      <Row>
        <Chip color={c}>FinSight</Chip>
        <Chip color={FLAG}>P1</Chip>
        {lg && <Chip color={c}>due Fri</Chip>}
        <span className="ml-auto t-nums t-mono text-[0.625rem] text-fg-muted">
          0.94
        </span>
      </Row>

      <div className="mt-auto flex items-center gap-2 pt-1">
        <span className="t-mono text-[0.625rem] text-fg-faint">
          written to a typed column, not a chat log
        </span>
      </div>
    </div>
  );
}
