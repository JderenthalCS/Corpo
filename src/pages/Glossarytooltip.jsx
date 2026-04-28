import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

// ─── Styles (injected once) ───────────────────────────────────────────────────
const CSS = `
.gt-wrap {
  display: inline-block;
  position: relative;
}

.gt-word {
  border-bottom: 2px dotted var(--color-accent, #4A7C59);
  padding-bottom: 1px;
  cursor: help;
  text-decoration: none;
}

.gt-word:focus {
  outline: 2px solid var(--color-border-secondary, rgba(0,0,0,0.35));
  outline-offset: 2px;
}

.gt-bubble {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-background-primary, #fff);
  border: 0.5px solid var(--color-border-secondary, rgba(0,0,0,0.25));
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 400;
  font-style: normal;
  color: var(--color-text-primary, #111);
  width: min(220px, 90vw);
  text-align: left;
  line-height: 1.5;
  z-index: 9999;
  pointer-events: auto;
  white-space: normal;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.12s ease, visibility 0.12s ease;
}

.gt-wrap:hover .gt-bubble,
.gt-wrap:focus-within .gt-bubble,
.gt-wrap.gt-open .gt-bubble {
  opacity: 1;
  visibility: visible;
}

.gt-bubble::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: var(--color-border-secondary, rgba(0,0,0,0.25));
}

.gt-term-label {
  display: block;
  font-weight: 500;
  font-size: 11px;
  color: var(--color-text-secondary, #666);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 3px;
}

@media (max-width: 640px) {
  .gt-bubble {
    left: 0;
    transform: none;
    width: min(260px, 85vw);
  }

  .gt-bubble::after {
    left: 16px;
    transform: none;
  }
}
`;

function injectStyles() {
  if (document.getElementById("gt-styles")) return;

  const el = document.createElement("style");
  el.id = "gt-styles";
  el.textContent = CSS;
  document.head.appendChild(el);
}

function getTermAnchor(term) {
  return String(term)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isCoarsePointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches;
}

// ─── GlossaryTerm ─────────────────────────────────────────────────────────────
function GlossaryTerm({ term, definition, glossaryPath }) {
  const [open, setOpen] = useState(false);

  const anchor = getTermAnchor(term);
  const to = glossaryPath ? `${glossaryPath}#${anchor}` : null;

  function handleClick(event) {
    if (!isCoarsePointer()) return;

    event.preventDefault();
    event.stopPropagation();
    setOpen((prev) => !prev);
  }

  function handleBlur() {
    setOpen(false);
  }

  const tooltip = definition ? (
    <span className="gt-bubble" role="tooltip">
      <span className="gt-term-label">{term}</span>
      {definition}
    </span>
  ) : null;

  if (!to) {
    return (
      <span
        className={`gt-wrap ${open ? "gt-open" : ""}`}
        onClick={handleClick}
        onBlur={handleBlur}
      >
        <button type="button" className="gt-word">
          {term}
        </button>
        {tooltip}
      </span>
    );
  }

  return (
    <span
      className={`gt-wrap ${open ? "gt-open" : ""}`}
      onClick={handleClick}
      onBlur={handleBlur}
    >
      <Link
        to={to}
        className="gt-word"
        aria-label={`Definition of ${term}`}
        title="View all glossary definitions"
      >
        {term}
      </Link>
      {tooltip}
    </span>
  );
}

// ─── parseWithGlossary ────────────────────────────────────────────────────────
function parseWithGlossary(text, glossary, glossaryPath) {
  const terms = Object.keys(glossary || {}).sort((a, b) => b.length - a.length);

  if (!terms.length) return [text];

  const escaped = terms.map((term) =>
    term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );

  const pattern = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");

  const nodes = [];
  let last = 0;
  let match;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(text.slice(last, match.index));
    }

    const raw = match[0];
    const canonical = terms.find(
      (term) => term.toLowerCase() === raw.toLowerCase()
    );

    const def = glossary[canonical];

    nodes.push(
      <GlossaryTerm
        key={key++}
        term={raw}
        definition={def}
        glossaryPath={glossaryPath}
      />
    );

    last = match.index + raw.length;
  }

  if (last < text.length) {
    nodes.push(text.slice(last));
  }

  return nodes;
}

// ─── GlossaryText ─────────────────────────────────────────────────────────────
export function GlossaryText({
  text,
  glossary,
  as: Tag = "span",
  className,
  ...rest
}) {
  useEffect(injectStyles, []);

  const { glossaryPath, ...tagProps } = rest;
  const nodes = parseWithGlossary(String(text || ""), glossary, glossaryPath);

  return (
    <Tag className={className} {...tagProps}>
      {nodes}
    </Tag>
  );
}

// ─── useGlossary hook ─────────────────────────────────────────────────────────
export function useGlossary(glossary, glossaryPath) {
  useEffect(injectStyles, []);

  return useCallback(
    (text) => parseWithGlossary(String(text || ""), glossary, glossaryPath),
    [glossary, glossaryPath]
  );
}

// ─── GlossaryProvider / useGlossaryContext ────────────────────────────────────
const GlossaryContext = createContext({ glossary: {}, glossaryPath: "" });

export function GlossaryProvider({ glossary, glossaryPath = "", children }) {
  useEffect(injectStyles, []);

  return (
    <GlossaryContext.Provider value={{ glossary, glossaryPath }}>
      {children}
    </GlossaryContext.Provider>
  );
}

export function useGlossaryContext() {
  const { glossary, glossaryPath } = useContext(GlossaryContext);

  return useCallback(
    (text) => parseWithGlossary(String(text || ""), glossary, glossaryPath),
    [glossary, glossaryPath]
  );
}

export default GlossaryText;