import type { ReactNode } from "react";

// Deliberately limited Markdown: no HTML, images, embeds, or executable URLs.
function inline(text: string, depth = 0): ReactNode {
  if (depth > 4) return text;
  const pattern = /\[([^\]\n]+)\]\(([^\s)]+)\)|\*\*(.+?)\*\*|\*([^*\n]+)\*/g;
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index!;
    nodes.push(text.slice(last, index));
    const key = index;
    if (match[1] !== undefined) {
      let href: string | undefined;
      try {
        const url = new URL(match[2]);
        if (["https:", "http:", "mailto:"].includes(url.protocol)) href = url.href;
      } catch { /* Unsupported URLs remain readable text. */ }
      nodes.push(href
        ? <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-[#0056CC] underline underline-offset-4 hover:text-[#002B56] focus-visible:outline-2 focus-visible:outline-offset-2">{inline(match[1], depth + 1)}</a>
        : <span key={key}>{match[1]}</span>);
    } else if (match[3] !== undefined) {
      nodes.push(<strong key={key} className="font-semibold text-[#002B56]">{inline(match[3], depth + 1)}</strong>);
    } else {
      nodes.push(<em key={key}>{inline(match[4], depth + 1)}</em>);
    }
    last = index + match[0].length;
  }
  nodes.push(text.slice(last));
  return nodes;
}

export function FormattedProfileText({ text }: { text: string }) {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  const heading = (line: string) => /^#{1,3}\s+(.+)$/.exec(line);
  const item = (line: string) => /^\s*(?:([-*])|([0-9]+)\.)\s+(.+)$/.exec(line);
  let i = 0;
  while (i < lines.length) {
    if (!lines[i].trim()) { i++; continue; }
    const title = heading(lines[i]);
    if (title) {
      blocks.push(<h3 key={i} className="pt-2 text-lg font-semibold leading-7 text-[#002B56]">{inline(title[1])}</h3>);
      i++; continue;
    }
    const first = item(lines[i]);
    if (first) {
      const start = i;
      const ordered = first[2] !== undefined;
      const items: ReactNode[] = [];
      while (i < lines.length) {
        const next = item(lines[i]);
        if (!next || (next[2] !== undefined) !== ordered) break;
        items.push(<li key={i}>{inline(next[3])}</li>);
        i++;
      }
      blocks.push(ordered
        ? <ol key={start} start={Math.min(Number(first[2]), 1000000)} className="list-decimal space-y-2 pl-6 marker:font-medium marker:text-[#002B56]">{items}</ol>
        : <ul key={start} className="list-disc space-y-2 pl-6 marker:text-[#0056CC]">{items}</ul>);
      continue;
    }
    const start = i;
    const paragraph: string[] = [];
    while (i < lines.length && lines[i].trim() && !heading(lines[i]) && !item(lines[i])) paragraph.push(lines[i++]);
    blocks.push(<p key={start} className="whitespace-pre-line">{inline(paragraph.join("\n"))}</p>);
  }
  return <div className="min-w-0 space-y-4 text-base leading-7 text-[#334155] [overflow-wrap:anywhere]">{blocks}</div>;
}
