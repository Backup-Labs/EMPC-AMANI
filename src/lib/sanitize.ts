import sanitizeHtmlLib from "sanitize-html";

const ALLOWED_TAGS = [
  "p", "br", "strong", "b", "em", "i", "u", "s", "h1", "h2", "h3", "h4",
  "ul", "ol", "li", "blockquote", "a", "hr", "span", "div",
];

export function sanitizeHtml(dirty: string): string {
  return sanitizeHtmlLib(dirty, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "target", "rel"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });
}

export function stripHtml(html: string): string {
  return sanitizeHtmlLib(html, { allowedTags: [], allowedAttributes: {} });
}
