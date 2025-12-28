# Configuration EmailJS pour les Notifications de Trading

## Vue d'ensemble

Le dashboard envoie automatiquement des emails à `paulweydert@hotmail.fr` lorsqu'un signal de trading fort apparaît.

## État actuel

- ✅ Système d'email intégré et fonctionnel
- ⚠️ EmailJS pas encore configuré (nécessite compte gratuit)
- ✅ Affichage des signaux sur le site opérationnel
- ✅ Historique des signaux sauvegardé dans localStorage

## Configuration EmailJS (Gratuit - 5 minutes)

### 1. Créer un compte EmailJS

1. Aller sur [https://www.emailjs.com/](https://www.emailjs.com/)
2. Créer un compte gratuit (200 emails/mois gratuits)
3. Vérifier votre email

### 2. Configurer le service Email

1. Dans le dashboard EmailJS, aller dans **Email Services**
2. Cliquer sur **Add New Service**
3. Choisir **Gmail** (ou votre service préféré)
4. Connecter votre compte Gmail
5. Copier le **Service ID** (ex: `service_bitcoin_signals`)

### 3. Créer le template d'email

1. Aller dans **Email Templates**
2. Cliquer sur **Create New Template**
3. Utiliser ce template:

**Template ID:** `template_signal_alert`

**Sujet:**
```
🚨 Signal Bitcoin: {{signal_type}} - {{signal_strength}}
```

**Corps de l'email:**
```html
Bonjour,

Un nouveau signal de trading Bitcoin a été détecté :

🎯 Signal: {{signal_type}}
💪 Force: {{signal_strength}}
📈 Action: {{signal_action}}
💡 Raison: {{signal_reason}}
🎲 Précision: {{signal_precision}}
📍 Niveau d'entrée: {{entry_level}}

💰 Prix BTC actuel: {{btc_price}}
🕐 Date: {{timestamp}}

{{details}}

---
Dashboard Bitcoin - https://quesdo.github.io/dashboard-btc/
```

4. Sauvegarder le template

### 4. Obtenir votre clé publique

1. Aller dans **Account** > **General**
2. Copier votre **Public Key** (ex: `abcd1234efgh5678`)

### 5. Configurer le dashboard

Éditer le fichier `src/services/emailNotifications.js`:

```javascript
const EMAILJS_CONFIG = {
  serviceId: 'VOTRE_SERVICE_ID',        // De l'étape 2
  templateId: 'template_signal_alert',   // De l'étape 3
  publicKey: 'VOTRE_PUBLIC_KEY',        // De l'étape 4
  toEmail: 'paulweydert@hotmail.fr'
};
```

### 6. Tester

1. Sauvegarder les modifications
2. Rebuilder le projet: `npm run build`
3. Déployer sur GitHub Pages
4. Attendre qu'un signal fort apparaisse (ou forcer un test en modifiant temporairement les seuils)

## Logique d'envoi des emails

- ✅ Emails envoyés uniquement pour les signaux **STRONG** et **VERY_STRONG**
- ✅ Pas de doublons: un signal identique ne génère pas plusieurs emails
- ✅ Délai minimum: 4 heures entre deux emails du même type
- ✅ Email envoyé si:
  - Le type de signal change (ex: BUY → SELL)
  - La force augmente (ex: MEDIUM → STRONG)

## Variables d'environnement pour GitHub Pages

Ajouter dans les **GitHub Secrets** (optionnel pour plus de sécurité):

1. Aller dans Settings > Secrets and variables > Actions
2. Ajouter `VITE_EMAILJS_PUBLIC_KEY` avec votre clé publique

Puis modifier `vite.config.js`:
```javascript
// Dans vite.config.js
define: {
  'import.meta.env.VITE_EMAILJS_PUBLIC_KEY': JSON.stringify(process.env.VITE_EMAILJS_PUBLIC_KEY)
}
```

## Historique des signaux

- Sauvegarde automatique dans `localStorage`
- Conservation des 90 derniers jours
- Statistiques disponibles via les DevTools:

```javascript
// Dans la console du navigateur
import { getSignalStats } from './utils/signalHistory'
console.log(getSignalStats(30)) // Stats des 30 derniers jours
```

## Dépannage

**Problème:** Aucun email reçu
- Vérifier la configuration dans `emailNotifications.js`
- Vérifier les logs de la console (F12)
- Vérifier le dossier spam
- Vérifier les quotas EmailJS (200/mois gratuit)

**Problème:** "Email would be sent (not configured)"
- C'est normal si EmailJS n'est pas encore configuré
- Les signaux sont quand même affichés sur le site
- Les signaux sont quand même sauvegardés dans l'historique

## Support

- Documentation EmailJS: https://www.emailjs.com/docs/
- Dashboard EmailJS: https://dashboard.emailjs.com/
