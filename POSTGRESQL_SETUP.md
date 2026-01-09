# Configuration PostgreSQL pour Production (Railway)

Ce document explique comment configurer PostgreSQL pour le déploiement en production sur Railway.

## Configuration des Variables d'Environnement

Pour activer PostgreSQL en production, vous devez définir les variables d'environnement suivantes :

### Variables requises

```bash
# URL de connexion PostgreSQL (fournie par Railway)
DATABASE_URL=postgresql://user:password@host:port/database

# Activer l'utilisation de la base de données
USE_DATABASE=true

# Secret JWT pour l'authentification admin
JWT_SECRET=your-secret-key-change-in-production

# Identifiants admin
ADMIN_USERNAME=OFAMM2026
ADMIN_PASSWORD=obe@_001
```

## Déploiement sur Railway

### 1. Créer une base de données PostgreSQL

1. Connectez-vous à votre compte Railway
2. Créez un nouveau projet
3. Ajoutez un service PostgreSQL
4. Railway générera automatiquement la variable `DATABASE_URL`

### 2. Configurer les variables d'environnement

Dans les paramètres de votre service Next.js sur Railway :

1. Allez dans l'onglet "Variables"
2. Ajoutez les variables suivantes :
   - `DATABASE_URL` (déjà fournie par Railway PostgreSQL)
   - `USE_DATABASE=true`
   - `JWT_SECRET` (générez une clé secrète forte)
   - `ADMIN_USERNAME` (votre nom d'utilisateur admin)
   - `ADMIN_PASSWORD` (votre mot de passe admin sécurisé)

### 3. Initialisation automatique

Lors du premier démarrage de l'application, les tables PostgreSQL seront automatiquement créées grâce à la fonction `initDatabase()` dans `lib/db.ts`.

Les tables créées sont :
- `slides` - Carrousel d'accueil
- `content_about` - Section À propos
- `services` - Services proposés
- `realisations` - Réalisations et projets
- `evenements` - Événements
- `galerie` - Galerie d'images
- `partenaires` - Partenaires
- `blog_pubs` - Publicités
- `blog_articles` - Articles de blog

## Mode Développement vs Production

### Développement (local)
- Par défaut, l'application utilise des fichiers JSON (`data/slides.json` et `data/content.json`)
- Aucune configuration PostgreSQL nécessaire
- Les données sont stockées localement

### Production (Railway)
- Activez `USE_DATABASE=true` et configurez `DATABASE_URL`
- Toutes les données sont stockées dans PostgreSQL
- Les modifications de l'admin sont persistées en base de données
- Les pages publiques lisent directement depuis PostgreSQL

## Migration des Données

Si vous avez des données dans les fichiers JSON et que vous voulez les migrer vers PostgreSQL :

1. Activez PostgreSQL en production
2. Connectez-vous à l'interface admin
3. Les données JSON seront automatiquement chargées lors du premier accès
4. Toute modification via l'admin sera sauvegardée en PostgreSQL

## Fallback Automatique

Le système inclut un mécanisme de fallback :
- Si PostgreSQL n'est pas disponible ou en cas d'erreur, l'application bascule automatiquement vers les fichiers JSON
- Cela garantit la disponibilité de l'application même en cas de problème de base de données

## Vérification

Pour vérifier que PostgreSQL fonctionne correctement :

1. Connectez-vous à l'interface admin
2. Ajoutez ou modifiez du contenu
3. Vérifiez que les modifications apparaissent sur les pages publiques
4. Les données doivent être persistées même après un redémarrage

## Support

En cas de problème :
- Vérifiez les logs Railway pour les erreurs de connexion
- Assurez-vous que `DATABASE_URL` est correctement configurée
- Vérifiez que `USE_DATABASE=true` est défini

