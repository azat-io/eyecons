export let workspace = {
  getConfiguration: (): {
    get(): void
  } => ({
    get: () => {},
  }),
}

export let window = {
  createOutputChannel: (): Record<string, unknown> => ({
    appendLine: (): void => {},
  }),
  showErrorMessage: (): void => {},
}
