import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Coucher de soleil : jaune doré en haut, orange au milieu, rouge en bas,
// coin bas-droit sombre. Le fond étant très lumineux, le verre est plus
// couvrant que pour les autres thèmes, pour que le texte blanc reste lisible.
const { theme, problems } = makeColors({
  label: 'Theme orange',
  only: 'dark',
  roles: { accent: '#ff9a3c', danger: '#ff4d4d', success: '#46c46a', warning: '#ffc43d', pro: '#b07cf0' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#261005',
        'surface-1': '#2f1407',
        'surface-2': '#381809',
        'surface-3': '#3f1b0a',
        'text-primary': '#ffffff',
        'text-secondary': '#ffe6d1',
        'text-muted': '#f0c8a8',
      },
    },
  },
})

const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g" x1="0.3" y1="0" x2="0.6" y2="1"><stop offset="0" stop-color="#ffd030"/><stop offset="0.3" stop-color="#ffb000"/><stop offset="0.55" stop-color="#ff7a00"/><stop offset="0.8" stop-color="#e8401a"/><stop offset="1" stop-color="#b01010"/></linearGradient><radialGradient id="c" cx="1" cy="0.95" r="0.65"><stop offset="0" stop-color="#4a0505" stop-opacity="0.9"/><stop offset="1" stop-color="#4a0505" stop-opacity="0"/></radialGradient></defs><rect width="1600" height="1000" fill="url(#g)"/><rect width="1600" height="1000" fill="url(#c)"/></svg>`

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'coucher-de-soleil', glass: { blur: 20, tint: '#3a1200', opacity: 0.5 } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'coucher-de-soleil') {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Coucher de soleil orange" />
  })
}
