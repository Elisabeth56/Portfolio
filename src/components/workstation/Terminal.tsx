"use client";

import { useEffect, useRef, useState } from "react";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

type Line = { kind: "in" | "out" | "err"; text: string };

const BANNER: Line[] = [
  { kind: "out", text: "elisynth shell · type `help`" },
];

export function Terminal({
  onOpen,
  onDocument,
}: {
  onOpen: (id: string) => void;
  onDocument: () => void;
}) {
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIndex, setHIndex] = useState(-1);
  const scroller = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [lines]);

  const push = (...ls: Line[]) => setLines((prev) => [...prev, ...ls]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    push({ kind: "in", text: cmd });
    setHistory((h) => [cmd, ...h].slice(0, 40));
    setHIndex(-1);

    const [head, ...rest] = cmd.split(/\s+/);
    const arg = rest.join(" ").toLowerCase();

    switch (head.toLowerCase()) {
      case "help":
        push(
          { kind: "out", text: "whoami        who is running this" },
          { kind: "out", text: "ls            list the systems" },
          { kind: "out", text: "open <name>   open a system" },
          { kind: "out", text: "cat <file>    method | about | contact" },
          { kind: "out", text: "read          switch to the document" },
          { kind: "out", text: "clear         clear the shell" },
        );
        break;

      case "whoami":
        push(
          { kind: "out", text: `${site.name.toLowerCase()} · ${site.role}` },
          { kind: "out", text: site.thesis.toLowerCase() },
        );
        break;

      case "ls":
      case "ll":
        projects.forEach((p) =>
          push({
            kind: "out",
            text: `${p.index}  ${p.slug.padEnd(10)} ${p.kind.toLowerCase()}`,
          }),
        );
        break;

      case "open": {
        if (!arg) {
          push({ kind: "err", text: "open: name required. try `ls`" });
          break;
        }
        const hit = projects.find(
          (p) =>
            p.slug === arg ||
            p.slug.replace("-", "") === arg.replace(/[\s-]/g, "") ||
            p.name.toLowerCase() === arg,
        );
        const panels: Record<string, string> = {
          about: "about",
          me: "about",
          method: "method",
          contact: "contact",
          work: "systems",
          systems: "systems",
          trajectory: "trajectory",
          experience: "trajectory",
          stack: "capabilities",
          capabilities: "capabilities",
        };
        if (hit) {
          onOpen(`project:${hit.slug}`);
          push({ kind: "out", text: `opening ${hit.name}` });
        } else if (panels[arg]) {
          onOpen(panels[arg]);
          push({ kind: "out", text: `opening ${panels[arg]}` });
        } else {
          push({ kind: "err", text: `open: no such system '${arg}'` });
        }
        break;
      }

      case "cat": {
        const map: Record<string, string> = {
          method: "method",
          "method.md": "method",
          about: "about",
          "about.md": "about",
          contact: "contact",
        };
        const target = map[arg];
        if (target) {
          onOpen(target);
          push({ kind: "out", text: `${arg} →` });
        } else {
          push({ kind: "err", text: `cat: ${arg || "?"}: no such file` });
        }
        break;
      }

      case "read":
      case "document":
        push({ kind: "out", text: "switching to document…" });
        window.setTimeout(onDocument, 260);
        break;

      case "clear":
        setLines(BANNER);
        return;

      case "sudo":
        push({ kind: "err", text: "nice try" });
        break;

      default:
        push({
          kind: "err",
          text: `${head}: command not found. try \`help\``,
        });
    }
  };

  return (
    <div
      className="flex h-full flex-col"
      onClick={() => input.current?.focus()}
    >
      <div
        ref={scroller}
        className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-3 py-2.5"
      >
        {lines.map((l, i) => (
          <p
            key={i}
            className={
              l.kind === "in"
                ? "t-mono text-[0.6875rem] leading-relaxed text-fg"
                : l.kind === "err"
                  ? "t-mono text-[0.6875rem] leading-relaxed text-flag"
                  : "t-mono text-[0.6875rem] leading-relaxed text-fg-muted"
            }
          >
            {l.kind === "in" && <span className="text-accent">❯ </span>}
            {l.text}
          </p>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(value);
          setValue("");
        }}
        className="flex shrink-0 items-center gap-1.5 border-t border-line-soft px-3 py-2"
      >
        <label htmlFor="elisynth-shell" className="sr-only">
          Shell command
        </label>
        <span aria-hidden className="t-mono text-[0.6875rem] text-accent">
          ❯
        </span>
        <input
          id="elisynth-shell"
          ref={input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              const next = Math.min(hIndex + 1, history.length - 1);
              if (next >= 0) {
                setHIndex(next);
                setValue(history[next]);
              }
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              const next = hIndex - 1;
              setHIndex(next);
              setValue(next >= 0 ? history[next] : "");
            }
          }}
          spellCheck={false}
          autoComplete="off"
          placeholder="help"
          className="t-mono min-w-0 flex-1 bg-transparent text-[0.6875rem] text-fg outline-none placeholder:text-fg-faint"
        />
      </form>
    </div>
  );
}
