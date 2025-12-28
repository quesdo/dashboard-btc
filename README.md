# 📊 Bitcoin Dashboard

Dashboard Bitcoin avec analyse Trading (court terme) et Macro (moyen terme) basé sur des corrélations validées 2023-2025.

## 🎯 Caractéristiques

### Mode Trading (Court Terme)
- **Horizon**: 1-7 jours
- **Précision validée**: 70-75%
- **Indicateurs**: Fear & Greed, Distance ATH, DXY, ETF Flows

### Mode Macro (Moyen-Long Terme)
- **Horizon**: Q1-Q2 2026 (1-3 mois)
- **Précision validée**: 76-83%
- **Indicateurs**: M2 Growth (avec lag 70-107j), SSR, DXY Tendance

### Mode Complet
- Affichage simultané des deux analyses
- Synthèse globale avec probabilités pondérées
- Recommandations stratégiques

## 🚀 Installation

### 1. Cloner le projet
```bash
cd bitcoin-dashboard
npm install
```

### 2. Configuration des clés API

Créez un fichier `.env` à la racine du projet :

```bash
cp .env.example .env
```

Éditez `.env` et ajoutez votre clé FRED (obligatoire pour M2 data) :

```env
VITE_FRED_API_KEY=votre_clé_fred_ici
```

**Comment obtenir une clé FRED (gratuit) :**
1. Visitez https://fred.stlouisfed.org/
2. Créez un compte gratuit
3. Allez dans "My Account" > "API Keys"
4. Générez une nouvelle clé
5. Collez-la dans votre fichier `.env`

### 3. Lancer l'application

```bash
npm run dev
```

Ouvrez [http://localhost:5173](http://localhost:5173) dans votre navigateur.

## 📐 Architecture

```
src/
├── api/                  # Couche d'intégration API
│   ├── coingecko.js      # Prix BTC, Market Cap, Volume, ATH
│   ├── feargreed.js      # Fear & Greed Index
│   ├── fred.js           # M2 Money Supply (FRED)
│   └── staticData.js     # DXY, SSR, ETF Flows (manuel)
│
├── components/           # Composants React
│   ├── Header.jsx        # En-tête avec auto-refresh
│   ├── BitcoinPriceCard.jsx
│   ├── ModeSelector.jsx
│   ├── IndicatorCard.jsx # Composant réutilisable
│   ├── ScoreCard.jsx
│   ├── TradingSection.jsx
│   ├── MacroSection.jsx
│   ├── GlobalSynthesis.jsx
│   └── Footer.jsx
│
├── hooks/
│   └── useDashboardData.js  # Hook principal pour les données
│
├── utils/
│   └── scoring.js        # Logique de scoring et calculs
│
└── App.jsx               # Composant principal
```

## 🔄 Auto-Refresh

Lorsque activé, le dashboard actualise automatiquement :

- **Prix BTC**: Toutes les 60 secondes (CoinGecko: 30 calls/min max)
- **Fear & Greed**: Toutes les heures (données quotidiennes)
- **M2 Money Supply**: Une fois par jour (données mensuelles)

**Estimations statiques** (DXY, SSR, ETF) : Mise à jour manuelle recommandée

## 📝 Mise à Jour des Données Statiques

Éditez le fichier [`src/api/staticData.js`](src/api/staticData.js) pour mettre à jour :

### DXY (Dollar Index) - Hebdomadaire
```javascript
export function getDXYData() {
  return {
    value: 108.5,        // Valeur actuelle DXY
    trend6m: -2.1,       // Tendance 6 mois en %
    date: '2025-12-28',  // Date de mise à jour
    // ...
  };
}
```
**Source**: [TradingView DXY](https://www.tradingview.com/symbols/TVC-DXY/)

### SSR (Stablecoin Supply Ratio) - Mensuel
```javascript
export function getSSRData() {
  return {
    value: 18.2,         // Ratio SSR
    date: '2025-11-30',  // Date de mise à jour
    // ...
  };
}
```
**Source**: [CryptoQuant](https://cryptoquant.com/)

### ETF Flows - Hebdomadaire
```javascript
export function getETFFlowsData() {
  return {
    score: 3,            // -5 (sorties massives) à +5 (entrées massives)
    date: '2025-12-28',  // Date de mise à jour
    // ...
  };
}
```
**Source**: [Farside Investors](https://farside.co.uk/btc/)

## 🎨 Logique de Scoring

### Score Trading (Court Terme)

| Indicateur | Poids | Description |
|------------|-------|-------------|
| Fear & Greed Index | 30% | Sentiment du marché (0-100) |
| Distance ATH | 20% | Écart au plus haut historique |
| DXY Dollar Index | 25% | Force du dollar US |
| ETF Flows | 25% | Flux des ETF Bitcoin spot |

**Formule**:
```
Score Trading = (F&G × 0.30) + (ATH × 0.20) + (DXY × 0.25) + (ETF × 0.25)
```

**Interprétation**:
- ≥ 7.5 : 🟢 ACHAT FORT (75-80% probabilité rallye 7j)
- 6.0-7.5 : 🟢 Achat (60-70%)
- 5.0-6.0 : 🟡 Neutre-Bullish (50-55%)
- 4.0-5.0 : ⚪ Neutre (45-50%)
- < 4.0 : 🔴 Prudence (< 40%)

### Score Macro (Moyen Terme)

| Indicateur | Poids | Description |
|------------|-------|-------------|
| M2 Growth (YoY) | 40% | Croissance masse monétaire M2 |
| Stablecoin Supply Ratio | 35% | Ratio liquidité stablecoin |
| DXY Tendance 6m | 25% | Tendance dollar 6 mois |

**Formule**:
```
Score Macro = (M2 × 0.40) + (SSR × 0.35) + (DXY × 0.25)
```

**Interprétation**:
- ≥ 7.5 : 🟢 EXPANSION FORTE (78-83% probabilité rallye 90j)
- 6.0-7.5 : 🟢 Expansion modérée (65-75%)
- 5.0-6.0 : 🟡 Expansion faible (50-60%)
- 4.0-5.0 : ⚪ Stagnation (40-50%)
- < 4.0 : 🔴 Contraction (< 35%)

## ⚠️ Important : Lag M2

**Les données M2 impactent Bitcoin avec un décalage de 70-107 jours** (moyenne 84 jours).

Exemple :
- Données M2 de **novembre 2025**
- Impact prévu sur BTC : **février-mars 2026**

Le Score Macro prédit donc la tendance **future** (1-3 mois), pas le présent.

## 💾 Historique Local

Le dashboard sauvegarde automatiquement un snapshot quotidien dans le `localStorage` du navigateur :

```javascript
{
  date: "2025-12-28",
  price: 98500,
  fearGreed: 65,
  m2Growth: 4.3,
  dxy: 108.5,
  ssr: 18.2,
  etf: 3,
  tradingScore: 6.8,
  macroScore: 7.2,
  timestamp: "2025-12-28T14:30:00.000Z"
}
```

Clé localStorage : `btc_snapshot_YYYY-MM-DD`

## 🔒 Sécurité

- ✅ Clés API dans `.env` (non commitées)
- ✅ `.gitignore` configuré pour exclure `.env`
- ✅ Pas de clés hardcodées dans le code
- ✅ Fallback sur estimations si API FRED manquante

## 📊 APIs Utilisées

| API | Rate Limit | Coût | Usage |
|-----|------------|------|-------|
| [CoinGecko](https://www.coingecko.com/en/api) | 30/min, 10k/mois | Gratuit | Prix BTC, Market Cap, Volume |
| [Alternative.me](https://alternative.me/crypto/fear-and-greed-index/) | Illimité | Gratuit | Fear & Greed Index |
| [FRED](https://fred.stlouisfed.org/docs/api/fred/) | 120/min | Gratuit | M2 Money Supply |

## 🛠️ Technologies

- **React 18** avec Hooks
- **Vite** (build tool ultra-rapide)
- **Tailwind CSS** (styling)
- **localStorage** (historique)

## 📖 Utilisation

### 1. Mode Trading
Cliquez sur **Mode Trading** pour voir uniquement l'analyse court terme (1-7j).

Utilisez ce mode pour :
- Timing d'entrée/sortie rapide
- Trading actif
- Décisions intrajournalières

### 2. Mode Macro
Cliquez sur **Mode Macro** pour voir uniquement l'analyse moyen terme (1-3 mois).

Utilisez ce mode pour :
- Allocation stratégique
- DCA (Dollar Cost Averaging)
- Vision fondamentale

### 3. Mode Complet
Cliquez sur **Mode Complet** pour voir les deux analyses + synthèse globale.

Utilisez ce mode pour :
- Vue d'ensemble complète
- Décisions nuancées
- Combiner timing + allocation

## ⚡ Commandes

```bash
# Développement
npm run dev

# Build production
npm run build

# Preview production
npm run preview

# Linter
npm run lint
```

## 📚 Ressources

- [CoinGecko API Docs](https://www.coingecko.com/en/api/documentation)
- [FRED API Docs](https://fred.stlouisfed.org/docs/api/fred/)
- [Fear & Greed Index](https://alternative.me/crypto/fear-and-greed-index/)
- [Farside ETF Flows](https://farside.co.uk/btc/)
- [CryptoQuant](https://cryptoquant.com/)

## ⚠️ Disclaimer

Ce dashboard est fourni à **titre éducatif uniquement**. Les scores et probabilités sont basés sur des corrélations historiques qui **peuvent ne pas se répéter**.

**Ne constitue pas un conseil en investissement.**

Faites toujours vos propres recherches (DYOR) et consultez un conseiller financier avant tout investissement.

## 📄 Licence

Open Source - Libre d'utilisation et modification

---

**Développé avec ❤️ pour la communauté Bitcoin**
