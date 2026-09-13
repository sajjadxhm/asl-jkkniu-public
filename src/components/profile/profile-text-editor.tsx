"use client";

import { useRef } from "react";
import { FormattedProfileText } from "./formatted-profile-text";

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  inputRef: (element: HTMLTextAreaElement | null) => void;
  disabled?: boolean;
  maxLength: number;
};

export function ProfileTextEditor({ id, label, value, onChange, onBlur, inputRef, disabled, maxLength }: Props) {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  function format(kind: string) {
    const element = ref.current;
    if (!element) return;
    let start = element.selectionStart;
    let end = element.selectionEnd;
    let selected = value.slice(start, end) || "Text";
    if (["Bullet list", "Numbered list", "Heading"].includes(kind)) {
      start = start === 0 ? 0 : value.lastIndexOf("\n", start - 1) + 1;
      const next = value.indexOf("\n", end);
      end = next < 0 ? value.length : next;
      selected = value.slice(start, end) || "Text";
    }
    const replacement = kind === "Bold" ? "**" + selected + "**"
      : kind === "Italic" ? "*" + selected + "*"
      : kind === "Link" ? "[" + selected + "](https://example.com)"
      : selected.split("\n").map((line, index) => (kind === "Heading" ? "### " : kind === "Bullet list" ? "- " : (index + 1) + ". ") + line).join("\n");
    const result = value.slice(0, start) + replacement + value.slice(end);
    if (result.length > maxLength) return;
    onChange(result);
    requestAnimationFrame(() => {
      element.focus();
      const urlStart = start + replacement.indexOf("https://example.com");
      element.setSelectionRange(kind === "Link" ? urlStart : start, kind === "Link" ? urlStart + 19 : start + replacement.length);
    });
  }
  return <div className="mt-3 min-w-0 overflow-hidden rounded-lg border border-slate-300 bg-white text-slate-800">
    <div role="group" aria-label={label + " formatting"} className="flex flex-wrap gap-1 border-b border-slate-300 bg-slate-50 p-2">
      {["Bold", "Italic", "Bullet list", "Numbered list", "Link", "Heading"].map(kind =>
        <button key={kind} type="button" disabled={disabled} onClick={() => format(kind)} className="min-h-9 rounded px-3 py-1.5 text-xs font-medium hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50">{kind}</button>)}
    </div>
    <textarea id={id} aria-label={label} aria-describedby={id + "-help"} ref={element => { ref.current = element; inputRef(element); }} value={value} onChange={event => onChange(event.target.value)} onBlur={onBlur} disabled={disabled} maxLength={maxLength} rows={7} className="block w-full resize-y bg-white p-4 text-sm leading-7 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0067FF] disabled:opacity-60" />
    <p id={id + "-help"} className="border-t border-slate-200 px-4 py-3 text-xs leading-5 text-slate-600">Select text and use the buttons, or type simple Markdown. Replace the example URL after adding a link. HTML is displayed as text. {value.length.toLocaleString()} / {maxLength.toLocaleString()} characters.</p>
    <details className="border-t border-slate-200 p-4">
      <summary className="cursor-pointer text-sm font-semibold text-[#002B56]">Preview formatting</summary>
      <div className="mt-4">{value.trim() ? <FormattedProfileText text={value} /> : <p className="text-sm text-slate-600">Your formatted text will appear here.</p>}</div>
    </details>
  </div>;
}
