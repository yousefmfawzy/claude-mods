export type Meter = { percent: number; tokens: number; window: number }

declare module 'claude-code' {
  interface PluginState {
    'context-meter': { meter: Meter | null }
  }
}
