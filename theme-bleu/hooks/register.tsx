import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Bleu roi électrique en fond, sur toute la fenêtre (panneaux latéraux
// compris), derrière un verre bleu marine léger.
const { theme, problems } = makeColors({
  label: 'Theme bleu',
  only: 'dark',
  roles: { accent: '#4f7dff', danger: '#e5484d', success: '#30a46c', warning: '#f0a020', pro: '#8e6cf0' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0a1442',
        'surface-1': '#0e1a4f',
        'surface-2': '#121f5a',
        'surface-3': '#152462',
        'text-primary': '#ffffff',
        'text-secondary': '#dfe6ff',
        'text-muted': '#b4c2ef',
      },
    },
  },
})

const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stop-color="#1a44e6"/><stop offset="0.5" stop-color="#1236d6"/><stop offset="1" stop-color="#0a28c4"/></linearGradient></defs><rect width="1600" height="1000" fill="url(#g)"/></svg>`

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'bleu-electrique', glass: { blur: 20, tint: '#0a1a7a', opacity: 0.3 } },
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    let set
    try {
      set = await $.theme.set(LOOK)
    } catch (error) {
      $.ui.log(String(error))
      set = await $.theme.set({ colors: theme })
    }

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'bleu-electrique') {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Bleu électrique" />
  })
}
