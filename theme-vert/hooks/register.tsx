import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Vague vert fluo sur fond vert sombre, sur toute la fenêtre (panneaux
// latéraux compris), derrière un verre vert sombre léger.
const { theme, problems } = makeColors({
  label: 'Theme vert',
  only: 'dark',
  roles: { accent: '#3ddc84', danger: '#e5484d', success: '#46d160', warning: '#f0a020', pro: '#8e6cf0' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#04200a',
        'surface-1': '#06290d',
        'surface-2': '#083110',
        'surface-3': '#0a3812',
        'text-primary': '#ffffff',
        'text-secondary': '#dcffe2',
        'text-muted': '#a8e0b2',
      },
    },
  },
})

const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="b" cx="0.5" cy="0.5" r="0.85"><stop offset="0" stop-color="#0fb81a"/><stop offset="0.45" stop-color="#067a0c"/><stop offset="1" stop-color="#012a04"/></radialGradient><filter id="f" x="-0.3" y="-0.3" width="1.6" height="1.6"><feGaussianBlur stdDeviation="70"/></filter></defs><rect width="1600" height="1000" fill="url(#b)"/><path d="M-150 280 C 250 300, 500 640, 850 660 S 1400 480, 1750 380" fill="none" stroke="#21f52f" stroke-width="230" stroke-linecap="round" filter="url(#f)"/><path d="M-150 280 C 250 300, 500 640, 850 660 S 1400 480, 1750 380" fill="none" stroke="#6bff73" stroke-width="70" stroke-linecap="round" filter="url(#f)" opacity="0.7"/></svg>`

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'vague-verte', glass: { blur: 20, tint: '#013a08', opacity: 0.3 } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'vague-verte') {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Vague verte" />
  })
}
