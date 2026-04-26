import { useEffect, useCallback } from "react";
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
  width: 220px;
  text-align: left;
  line-height: 1.5;
  z-index: 9999;
  pointer-events: none;
  white-space: normal;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.12s ease;
}
.gt-wrap:hover .gt-bubble,
.gt-wrap:focus-within .gt-bubble {
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

// ─── GlossaryTerm ─────────────────────────────────────────────────────────────
function GlossaryTerm({ term, definition, glossaryPath }) {
  const anchor = getTermAnchor(term);
  const to = glossaryPath ? `${glossaryPath}#${anchor}` : null;

  const tooltip = definition ? (
    <span className="gt-bubble">
      <span className="gt-term-label">{term}</span>
      {definition}
    </span>
  ) : null;

  if (!to) {
    return (
      <span className="gt-wrap">
        <span className="gt-word">{term}</span>
        {tooltip}
      </span>
    );
  }

  return (
    <span className="gt-wrap">
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
// Converts a plain string into an array of React nodes, injecting
// tooltip-enabled terms for every glossary match.
function parseWithGlossary(text, glossary, glossaryPath) {
  const terms = Object.keys(glossary).sort((a, b) => b.length - a.length);
  if (!terms.length) return [text];

  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");

  const nodes = [];
  let last = 0;
  let match;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));

    const raw = match[0];
    const canonical = terms.find((t) => t.toLowerCase() === raw.toLowerCase());
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

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

// ─── GlossaryText ─────────────────────────────────────────────────────────────
/**
 * Renders `text` as a <span>, scanning for glossary terms and
 * making each matched term underlined with hover/focus tooltip behavior.
 *
 * Props:
 *   text       {string}  — the text content to scan
 *   glossary   {object}  — { "term": "definition", ... }
 *   as         {string}  — HTML tag to render (default "span")
 *   className  {string}  — forwarded to the root element
 */
export function GlossaryText({ text, glossary, as: Tag = "span", className, ...rest }) {
  useEffect(injectStyles, []);
  const nodes = parseWithGlossary(String(text || ""), glossary, rest.glossaryPath);
  const { glossaryPath, ...tagProps } = rest;
  return (
    <Tag className={className} {...tagProps}>
      {nodes}
    </Tag>
  );
}

// ─── useGlossary hook ──────────────────────────────────────────────────────────
/**
 * Lower-level hook. Returns a `scan(text)` function that converts a
 * string into React nodes. Use this when you need the parsed output
 * directly (e.g. inside a custom component).
 *
 * Usage:
 *   const scan = useGlossary(glossary);
 *   return <p>{scan("The mitochondria is the powerhouse of the cell.")}</p>;
 */
export function useGlossary(glossary) {
  useEffect(injectStyles, []);
  return useCallback(
    (text) => parseWithGlossary(text, glossary),
    [glossary]
  );
}

// ─── GlossaryProvider / useGlossaryContext ────────────────────────────────────
// Optional: wrap a subtree so any child can call useGlossaryContext()
// without prop-drilling the glossary object.
import { createContext, useContext } from "react";

const GlossaryContext = createContext({});

export function GlossaryProvider({ glossary, children }) {
  useEffect(injectStyles, []);
  return (
    <GlossaryContext.Provider value={glossary}>
      {children}
    </GlossaryContext.Provider>
  );
}

/**
 * Inside a <GlossaryProvider>, call this hook to get a scan() function
 * bound to the provider's glossary.
 */
export function useGlossaryContext() {
  const glossary = useContext(GlossaryContext);
  return useCallback((text) => parseWithGlossary(text, glossary), [glossary]);
}

// ─── Default export: GlossaryText ─────────────────────────────────────────────
export default GlossaryText;