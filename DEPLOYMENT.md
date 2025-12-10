# Guide de déploiement avec PostgreSQL sur Railway

## Préparation pour la production

### 1. Configuration de la base de données PostgreSQL

#### Sur Railway :

1. Créez un nouveau projet sur [Railway](https://railway.app)
2. Ajoutez une base de données PostgreSQL
3. Copiez l'URL de connexion (DATABASE_URL)

### 2. Variables d'environnement

Créez un fichier `.env.production` avec :

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database
USE_DATABASE=true

# JWT Secret (générez une clé sécurisée)
JWT_SECRET=votre-cle-secrete-tres-longue-et-aleatoire

# Admin Password (changez-le !)
ADMIN_PASSWORD=votre-mot-de-passe-admin-securise

# Node Environment
NODE_ENV=production
```

### 3. Migration des données JSON vers PostgreSQL

Une fois la base de données configurée, vous devrez :

1. Activer `USE_DATABASE=true` dans les variables d'environnement
2. Les fonctions dans `lib/data.ts` utiliseront automatiquement PostgreSQL
3. Les données existantes dans `data/*.json` devront être migrées manuellement ou via un script de migration

### 4. Script de migration (à créer)

Un script de migration pourra être créé pour transférer les données JSON vers PostgreSQL :

```typescript
// scripts/migrate-to-db.ts
// Script pour migrer les données JSON vers PostgreSQL
```

### 5. Déploiement sur Railway

1. Connectez votre repository GitHub à Railway
2. Configurez les variables d'environnement dans Railway
3. Railway détectera automatiquement Next.js et déploiera l'application
4. La base de données sera initialisée automatiquement au premier démarrage

### 6. Structure de la base de données

Les tables suivantes seront créées automatiquement :

- `slides` : Slides de la page d'accueil
- `content_about` : Contenu de la page À propos
- `services` : Services proposés
- `realisations` : Réalisations
- `evenements` : Événements
- `galerie` : Images de la galerie

### Notes importantes

- En développement local, les données sont stockées dans `data/*.json`
- En production avec `USE_DATABASE=true`, les données sont dans PostgreSQL
- Les images uploadées restent dans `public/uploads/` (considérez un service de stockage cloud pour la production)

