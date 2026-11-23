import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Lueur rouge vif en fond, sur toute la fenêtre (panneaux latéraux compris),
// derrière un verre rouge sombre léger.
const { theme, problems } = makeColors({
  label: 'Theme rouge',
  only: 'dark',
  roles: { accent: '#ff7a45', danger: '#ff4d5e', success: '#30a46c', warning: '#f0a020', pro: '#b07cf0' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#240505',
        'surface-1': '#2d0808',
        'surface-2': '#360b0b',
        'surface-3': '#3d0d0d',
        'text-primary': '#ffffff',
        'text-secondary': '#ffe1e1',
        'text-muted': '#e8b4b4',
      },
    },
  },
})

const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="g" cx="0.35" cy="0.4" r="0.8"><stop offset="0" stop-color="#ff0a0a"/><stop offset="0.3" stop-color="#e00000"/><stop offset="0.65" stop-color="#7a0000"/><stop offset="1" stop-color="#2a0000"/></radialGradient></defs><rect width="1600" height="1000" fill="url(#g)"/></svg>`

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'lueur-rouge', glass: { blur: 20, tint: '#3a0000', opacity: 0.3 } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'lueur-rouge') {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Lueur rouge" />
  })
}
