export let override = (
  id: string,
  overrides: Record<string, Record<string, string>>,
  source: string,
): string => {
  let result = source
  if (id in overrides) {
    for (let [from, to] of Object.entries(overrides[id]!)) {
      result = result.replaceAll(new RegExp(from, 'g'), to)
    }
  }
  return result
}
