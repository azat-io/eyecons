export let override = (
  id: string,
  overrides: Record<string, Record<string, string>>,
  source: string,
): string => {
  if (id in overrides) {
    for (let [from, to] of Object.entries(overrides[id])) {
      source = source.replaceAll(new RegExp(from, 'g'), to)
    }
  }
  return source
}
