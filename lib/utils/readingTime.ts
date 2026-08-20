/**
 * Estimates reading time based on body block content.
 * Assumes average reading speed of 200 words per minute.
 */
export function calcReadingTime(body: unknown[]): number {
  if (!body || body.length === 0) return 1;
  let wordCount = 0;
  for (const block of body) {
    const b = block as Record<string, unknown>;
    if (b._type === "block" && Array.isArray(b.children)) {
      for (const child of b.children as { text?: string }[]) {
        if (child.text) {
          wordCount += child.text.split(/\s+/).filter(Boolean).length;
        }
      }
    }
  }
  return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * Returns a formatted reading time label like "4 min read"
 */
export function readingTimeLabel(body: unknown[]): string {
  const mins = calcReadingTime(body);
  return `${mins} min read`;
}
