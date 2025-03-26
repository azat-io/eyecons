import { vi } from 'vitest'

globalThis.process.env['NODE_ENV'] = 'test'

vi.useFakeTimers()
vi.setSystemTime(new Date('2023-01-01'))
