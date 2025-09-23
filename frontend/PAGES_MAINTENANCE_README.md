# Pages de Maintenance ÉMÉRÉS

## Vue d'ensemble

Ce système fournit 3 pages de maintenance professionnelles pour la plateforme ÉMÉRÉS, permettant de gérer les périodes de maintenance, les modules en développement et l'indisponibilité temporaire de l'authentification.

## Pages disponibles

### 1. MaintenancePage (`/maintenance`)
- **Usage** : Maintenance générale de la plateforme
- **Design** : Icône horloge orange, estimation de temps
- **Message** : "Maintenance en cours - Retour prévu dans 2 heures"

### 2. AuthMaintenancePage (`/auth-maintenance`)
- **Usage** : Maintenance du système d'authentification
- **Design** : Icône cadenas jaune, détails des travaux backend
- **Message** : "Authentification temporairement indisponible"

### 3. UnderDevelopmentPage (`/under-development`)
- **Usage** : Modules ou fonctionnalités en cours de développement
- **Design** : Icône fusée bleue, liste des fonctionnalités à venir
- **Message** : "Module en développement - Bientôt disponible !"

## Fonctionnalités communes

✅ **Branding ÉMÉRÉS cohérent**
✅ **Newsletter signup** pour notifications
✅ **Liens de contact et support**
✅ **Bouton retour à l'accueil**
✅ **Design responsive** (desktop/tablet/mobile)
✅ **Animations et transitions fluides**

## Configuration des variables d'environnement

Dans `/app/frontend/.env` :

```env
# Variables de contrôle des pages de maintenance
REACT_APP_MAINTENANCE_MODE=false          # Maintenance générale
REACT_APP_AUTH_MAINTENANCE=false          # Maintenance authentification
REACT_APP_MODULES_UNDER_DEV=false         # Modules en développement
```

## Utilisation du système de redirection

### 1. Redirection automatique

Le système vérifie automatiquement les variables d'environnement dans `App.js` :

```javascript
// Maintenance générale - redirige TOUTE l'application
if (MAINTENANCE_MODE) {
  return <MaintenancePage />;
}

// Maintenance auth - redirige uniquement login/register
if (AUTH_MAINTENANCE && ['/login', '/register', '/company/register'].includes(location.pathname)) {
  return <AuthMaintenancePage />;
}
```

### 2. Redirection manuelle

Utiliser les fonctions utilitaires :

```javascript
import { redirectToMaintenance, isModuleUnderDevelopment } from '../utils/maintenanceUtils';

// Redirection vers maintenance générale
redirectToMaintenance('general');

// Redirection vers maintenance auth
redirectToMaintenance('auth');

// Redirection vers page développement
redirectToMaintenance('development');

// Vérifier si module en développement
if (isModuleUnderDevelopment('calendar')) {
  redirectToMaintenance('development');
}
```

## Scénarios d'utilisation

### Scénario 1 : Maintenance planifiée complète
```env
REACT_APP_MAINTENANCE_MODE=true
```
➡️ **Résultat** : Tous les utilisateurs voient la page maintenance

### Scénario 2 : Problème backend authentification
```env
REACT_APP_AUTH_MAINTENANCE=true
```
➡️ **Résultat** : Pages login/register remplacées par la page auth maintenance

### Scénario 3 : Nouveau module en développement
```env
REACT_APP_MODULES_UNDER_DEV=true
```
➡️ **Résultat** : Redirection conditionnelle vers la page développement

### Scénario 4 : Module spécifique en développement
```env
REACT_APP_CALENDAR_UNDER_DEV=true
```
➡️ **Résultat** : Seul le module calendrier redirige vers développement

## Personnalisation

### Modifier les messages
Éditer directement les composants dans `/app/frontend/src/components/` :
- `MaintenancePage.js`
- `AuthMaintenancePage.js`  
- `UnderDevelopmentPage.js`

### Modifier les délais estimés
Changer les textes dans les composants :
```javascript
<p className="text-xl font-semibold text-teal-600">
  Retour prévu dans 2 heures  // ← Modifier ici
</p>
```

### Ajouter des modules spécifiques
Dans `maintenanceUtils.js`, ajouter une logique pour des modules spécifiques :
```javascript
export const isModuleUnderDevelopment = (moduleName) => {
  const moduleVar = `REACT_APP_${moduleName.toUpperCase()}_UNDER_DEV`;
  return process.env[moduleVar] === 'true';
};
```

## Routes disponibles

- `/maintenance` - Page maintenance générale
- `/auth-maintenance` - Page maintenance authentification  
- `/under-development` - Page module en développement

## Support technique

- **Email général** : support@emeres.fr
- **Email auth** : auth@emeres.fr
- **Email dev** : dev@emeres.fr

## Exemples d'activation

### Activation maintenance urgente
```bash
# Modifier .env
echo "REACT_APP_MAINTENANCE_MODE=true" >> /app/frontend/.env

# Redémarrer frontend
sudo supervisorctl restart frontend
```

### Désactivation
```bash
# Modifier .env
sed -i 's/REACT_APP_MAINTENANCE_MODE=true/REACT_APP_MAINTENANCE_MODE=false/' /app/frontend/.env

# Redémarrer frontend
sudo supervisorctl restart frontend
```

---

**Note** : Ces pages respectent entièrement la charte graphique ÉMÉRÉS avec les couleurs teal/cyan et maintiennent l'expérience utilisateur professionnelle.