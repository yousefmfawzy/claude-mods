import type { Register } from 'claude-code'

const fmt = (n: number): string =>
  n >= 1000 ? `${parseFloat((n / 1000).toFixed(1))}k` : String(n)

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const { context } = await $.session.usage()
    if (context.tokens !== undefined && context.percent !== undefined) {
      $.ui.status(`Context ${context.percent}% · ${fmt(context.tokens)} / ${fmt(context.window)}`)
    }
    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    const { context } = await $.session.usage()
    if (context.tokens !== undefined && context.percent !== undefined) {
      $.ui.status(`Context ${context.percent}% · ${fmt(context.tokens)} / ${fmt(context.window)}`)
    }
    return next(e)
  })
}
