import { atom, read, update } from 'claude-code'
import type { EngineInterfaceBuilt, Register } from 'claude-code'

import type { Meter } from '../types'

const meter = atom({ plugin: 'context-meter', key: 'meter' } as const, null)

const fmt = (n: number): string =>
  n >= 1000 ? `${parseFloat((n / 1000).toFixed(1))}k` : String(n)

const label = (m: Meter): string =>
  `Context ${m.percent}% · ${fmt(m.tokens)} / ${fmt(m.window)}`

async function refresh($: EngineInterfaceBuilt): Promise<void> {
  const { context } = await $.session.usage()
  if (context.tokens === undefined || context.percent === undefined) return
  const m: Meter = { percent: context.percent, tokens: context.tokens, window: context.window }
  await update($, meter, () => m)
  $.ui.status(label(m))
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await refresh($)
    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    await refresh($)
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const m = await read($, meter)
    if (m === null) return next(e)

    const { Box, Text } = $.ui.resolve(e)

    return (
      <Box>
        <Text dimColor>{label(m)}</Text>
      </Box>
    )
  })
}
