const HTML_UNSAFE_JSON_CHARACTERS = /[<>&\u2028\u2029]/g;
const JSON_CHARACTER_ESCAPES: Record<string, string> = {
  "<": "\\u003c",
  ">": "\\u003e",
  "&": "\\u0026",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029",
};

export function serializeJsonForHtml(value: unknown) {
  return (JSON.stringify(value) ?? "null").replace(
    HTML_UNSAFE_JSON_CHARACTERS,
    (character) => JSON_CHARACTER_ESCAPES[character],
  );
}
