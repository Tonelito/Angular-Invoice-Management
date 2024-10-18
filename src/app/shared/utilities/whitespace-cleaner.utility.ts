export function whitespaceCleaner(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}
