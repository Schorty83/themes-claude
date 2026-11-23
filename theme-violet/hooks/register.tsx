import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Dégradé horizontal : magenta à gauche, violet au milieu, bleu nuit presque
// noir à droite, sur toute la fenêtre, derrière un verre violet sombre.
const { theme, problems } = makeColors({
  label: 'Theme violet',
  only: 'dark',
  roles: { accent: '#c77dff', danger: '#ff4d6d', success: '#46c46a', warning: '#f0a020', pro: '#ff7ae0' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#160828',
        'surface-1': '#1c0b33',
        'surface-2': '#220e3c',
        'surface-3': '#271044',
        'text-primary': '#ffffff',
        'text-secondary': '#efe0ff',
        'text-muted': '#c9b2e6',
      },
    },
  },
})

// Chaque zone de la fenêtre dessine sa propre copie du fond. Les règles
// @media lisent la largeur de la zone : étroite à gauche (barre latérale),
// un peu plus large à droite (panneau de droite), large au centre. Chacune
// reçoit sa portion du dégradé, pour qu'il continue d'un bord à l'autre.
const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="none"><style>.l,.r{display:none}@media (max-width: 300px){.c{display:none}.l{display:inline}}@media (min-width: 301px) and (max-width: 480px){.c{display:none}.r{display:inline}}</style><defs><linearGradient id="gc" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#a600ff"/><stop offset="0.143" stop-color="#8a00ff"/><stop offset="0.5" stop-color="#5a0095"/><stop offset="0.857" stop-color="#2c0058"/><stop offset="1" stop-color="#220745"/></linearGradient><linearGradient id="gl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d000ff"/><stop offset="1" stop-color="#a600ff"/></linearGradient><linearGradient id="gr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#220745"/><stop offset="1" stop-color="#121228"/></linearGradient></defs><rect class="c" width="1600" height="1000" fill="url(#gc)"/><rect class="l" width="1600" height="1000" fill="url(#gl)"/><rect class="r" width="1600" height="1000" fill="url(#gr)"/></svg>`

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'degrade-violet', glass: { blur: 0, tint: '#5a0095', opacity: 0.08 } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'degrade-violet') {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Dégradé violet" />
  })
}
