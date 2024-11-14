export let workspace = {
  getConfiguration: (): {
    get: () => void
  } => ({
    get: () => {},
  }),
}
