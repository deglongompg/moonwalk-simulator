# Moonwalk Fitness Simulator — Contexte pour Claude Code

## OBJECTIF
Polir le design du simulateur Moonwalk Fitness (fichier `moonwalk_simulator.html`) pour en faire un outil public embeddable sur un site web, avec un design premium digne d'une app crypto/GameFi pro.

## LE PROJET
Simulateur de gains $MF (token Moonwalk Fitness sur Solana) avec 3 onglets :
1. **🆓 Commencer** — Pour les nouveaux joueurs (F2P), explique le mécanisme et simule les gains
2. **💰 Avancé** — Pour les joueurs existants, simule l'impact d'acheter et locker des tokens
3. **📈 Projections** — Migration des joueurs entre ligues avec 3 scénarios

## LIEN AFFILIATION
`https://go.moonwalk.fit/?r=61eeb64b` — doit être sur les boutons CTA (header, milieu F2P, footer)

## MÉCANISME DU JEU
- Les joueurs rejoignent des **défis de pas** (3K à 12K pas/jour, 5-30 jours)
- Mise obligatoire minimum : 200 MF (~$2.60) ou 1 USDC
- **98-99% des joueurs réussissent** leur défi
- Les gagnants récupèrent leur mise + ~1% bonus (défis faciles 3K-7K) ou ~2% (défis difficiles 10K+)
- Le vrai gain c'est l'**XP** : dès niveau 10 Bronze → accès aux **MF Games** hebdomadaires gratuits
- Les MF Games distribuent **236 538 MF par ligue par semaine** (59 135 MF par tier, 4 tiers, répartition 25/25/25/25%)
- On peut avoir jusqu'à **20 défis par jour** (les grinders en ont 40-100 simultanés)
- Système **waterfall** : un joueur Or joue aussi en Argent et Bronze

## DONNÉES CALIBRÉES (Mars 2026)
### Marcheurs totaux par ligue (réels) :
- Bronze: 3 520
- Argent: 2 470
- Or: 1 200
- Platine: ~550 (estimé)
- Diamant: ~280 (estimé)
- Tungstène: ~20 (estimé)

### Gains réels Damien (vérifiés) :
- Bronze T4: 165 MF/sem (3 520 marcheurs)
- Argent T3: 147 MF/sem (2 440 marcheurs)
- Argent T4: 268 MF/sem (2 470 marcheurs)
- Or T3: 264 MF/sem (1 200 marcheurs)

### Discord Week 17 (2-6 Fév 2026) — gains communautaires :
| Ligue | T1 | T2 | T3 | T4 |
|---|---|---|---|---|
| Bronze | — | — | 87 | 163 |
| Argent | — | — | 147 | 277 |
| Or | — | 151 | 287 | 513 |
| Platine | 144 | 328 | 581 | 978 |
| Diamant | 303 | 659 | 1132 | 2060 |
| Tungstène | — | 1950 | — | 6350 |

### Gagnants par tier (calibrés = 59135 / gain observé) :
- Bronze: [740, 520, 402, 358]
- Argent: [600, 420, 402, 221]
- Or: [500, 392, 224, 115]
- Platine: [411, 180, 102, 60]
- Diamant: [195, 90, 52, 29]
- Tungstène: [100, 30, 18, 9]

### Lock thresholds (tokens pondérés nécessaires) :
- Bronze: [0, 2500, 5000, 10000]
- Argent: [0, 10000, 16000, 31500]
- Or: [0, 10000, 31500, 71500]
- Platine: [0, 31500, 71500, 145000]
- Diamant: [0, 71500, 145000, 275000]
- Tungstène: [0, 145000, 275000, 600000]

### XP Multipliers par ligue/tier :
- Bronze: [1.0, 1.5, 2.0, 3.0]
- Argent: [0.8, 1.0, 2.0, 3.0]
- Or: [0.4, 0.8, 1.6, 2.4]
- Platine: [0.3, 0.6, 1.2, 1.8]
- Diamant: [0.2, 0.4, 0.8, 1.2]
- Tungstène: [0.1, 0.2, 0.4, 0.6]

### Lock multipliers :
- 30 jours: ×1.08
- 90 jours: ×1.25
- 180 jours: ×1.5
- 365 jours: ×2.0

### Historique joueurs (pour graphe migration) :
- Oct W1: B=3790, A=567, O=316, P=186, D=109
- Nov W1: B=5280, A=1030, O=407, P=201, D=111
- Déc W1: B=5430, A=1290, O=487, P=219, D=116, T=3
- Mars W3: B=3520, A=2470, O=1200, P=550, D=280, T=20

## SITUATION DU JOUEUR (Damien - valeurs par défaut du simulateur)
- 16 348 MF lockés sur 365 jours (pondéré ~31 762)
- Niveau 22/60 en ligue Or
- Tier 4 Bronze, Tier 4 Argent, Tier 3 Or
- ~700 MF/semaine de gains totaux
- Prix actuel MF: ~$0.013

## DIRECTION DESIGN
- **Dark mode OLED** (#050A12 fond)
- **Glassmorphism** (backdrop-filter blur, bordures semi-transparentes)
- **Typo** : Outfit (display) + JetBrains Mono (données/chiffres)
- **Couleurs** : Teal #2DD4BF (principal), Amber #F59E0B (investissement), Green #34D399 (gains), Purple #A78BFA (accent)
- **Animations** : fadeUp staggeré, shimmer sur CTA, glow pulsant, float sur logo, hover lift sur cards
- **Noise overlay** SVG subtil pour texture
- **Gradient mesh** ambient (teal en haut, indigo en bas)
- **Custom slider** avec thumb glow
- **Responsive** mobile-first

## POINTS À AMÉLIORER DANS CLAUDE CODE
1. Le design est fonctionnel mais "à peine plus beau" que la v7 selon Damien — il faut un vrai saut qualitatif
2. Ajouter des graphiques (le HTML actuel n'a pas de charts car pas de lib externe — utiliser Chart.js ou un SVG custom)
3. Améliorer les micro-interactions et transitions
4. Tester le responsive mobile
5. Préparer l'embed pour Wix (iframe-friendly, pas de scroll issues)
6. Éventuellement utiliser le skill ui-ux-pro-max (https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) pour le design system

## FICHIERS
- `moonwalk_simulator.html` — Version HTML actuelle à polir
- `moonwalk_simulator_v7_backup.jsx` — Backup React v7 fonctionnel
- `moonwalk_simulator.jsx` — Version React v8 (design amélioré mais limité par les inline styles)
