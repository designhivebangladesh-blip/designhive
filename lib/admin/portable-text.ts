/**
 * The admin's "richtext" field is deliberately simple: a plain textarea,
 * one paragraph per blank-line-separated chunk. It reads and writes real
 * Portable Text blocks (so content stays fully compatible with Sanity
 * Studio and the frontend's Portable Text renderer), it just doesn't
 * expose marks/formatting or embedded assets. Editors who need bold,
 * links, or inline images use Studio for that document instead.
 *
 * Uses the global Web Crypto `randomUUID()` (available in both the
 * browser and the Node server runtime) rather than `import ... from
 * "crypto"`, so this module has no Node-only imports and stays safe to
 * bundle into Client Components — `portableTextToPlainText` is read
 * directly by record-form.tsx.
 */

interface PortableTextSpan {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
}

interface PortableTextBlock {
  _type: "block";
  _key: string;
  style: "normal";
  markDefs: never[];
  children: PortableTextSpan[];
}

export function plainTextToPortableText(text: string): PortableTextBlock[] {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return [];

  return paragraphs.map((paragraph) => ({
    _type: "block",
    _key: crypto.randomUUID().slice(0, 12),
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: crypto.randomUUID().slice(0, 12),
        text: paragraph,
        marks: [],
      },
    ],
  }));
}

export function portableTextToPlainText(blocks: unknown): string {
  if (!Array.isArray(blocks)) return "";

  return blocks
    .filter((block): block is { _type: string; children?: { text?: string }[] } => {
      return typeof block === "object" && block !== null && (block as { _type?: string })._type === "block";
    })
    .map((block) => (block.children ?? []).map((child) => child.text ?? "").join(""))
    .join("\n\n");
}
