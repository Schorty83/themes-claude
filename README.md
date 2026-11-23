# Thèmes pour Claude Code

Cinq thèmes pour l'app desktop Claude (onglet Code) :

| Thème | Aspect |
| --- | --- |
| `theme-bleu` | Fond bleu roi électrique |
| `theme-rouge` | Lueur rouge vif |
| `theme-vert` | Vague vert fluo sur fond vert sombre |
| `theme-orange` | Coucher de soleil jaune-orange-rouge |
| `theme-violet` | Dégradé magenta vers violet nuit |

Un seul thème à la fois : installe celui que tu veux, et désinstalle le précédent pour en changer.

## Installation

Depuis un terminal (PowerShell), Claude Code installé :

```
claude plugin install theme-violet --marketplace schorty83/themes-claude
```

Dans un terminal Claude Code :

```
/plugin install theme-violet --marketplace schorty83/themes-claude
```

Dans l'app desktop : clique sur **+** à côté de la zone de saisie, puis **Plugins**, **Add marketplace** avec `schorty83/themes-claude`, puis **Add plugin**.

Remplace `theme-violet` par le thème de ton choix. Ouvre ensuite une nouvelle discussion dans l'onglet Code.

## Changer de thème

```
claude plugin uninstall theme-violet
claude plugin install theme-bleu --marketplace schorty83/themes-claude
```
