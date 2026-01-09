# Guide de Déploiement sur Railway

Ce guide vous explique comment déployer l'application O'FAMM sur Railway.

## Prérequis

- Un compte [Railway](https://railway.app)
- Un compte GitHub (pour connecter le repository)
- Les fichiers de configuration sont déjà en place

## Étapes de Déploiement

### 1. Préparation du Repository

Assurez-vous que votre code est poussé sur GitHub :

```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### 2. Créer un Projet sur Railway

1. Connectez-vous à [Railway](https://railway.app)
2. Cliquez sur "New Project"
3. Sélectionnez "Deploy from GitHub repo"
4. Choisissez votre repository

### 3. Ajouter une Base de Données PostgreSQL

1. Dans votre projet Railway, cliquez sur "+ New"
2. Sélectionnez "Database" → "Add PostgreSQL"
3. Railway créera automatiquement une base de données PostgreSQL
4. La variable `DATABASE_URL` sera automatiquement ajoutée à vos variables d'environnement

### 4. Configurer les Variables d'Environnement

Dans votre projet Railway, allez dans "Variables" et ajoutez :

#### Variables Requises :

```env
# Database (ajoutée automatiquement par Railway si vous avez ajouté PostgreSQL)
USE_DATABASE=true

# JWT Secret (générez une clé sécurisée)
JWT_SECRET=votre-cle-secrete-tres-longue-et-aleatoire

# Admin Password (changez-le !)
ADMIN_PASSWORD=votre-mot-de-passe-admin-securise

# Node Environment
NODE_ENV=production

# URL de l'application (optionnel, Railway le définit automatiquement)
NEXT_PUBLIC_APP_URL=https://votre-app.railway.app
```

#### Générer un JWT_SECRET sécurisé :

```bash
openssl rand -base64 32
```

### 5. Configuration du Service

Railway détectera automatiquement Next.js grâce aux fichiers de configuration :
- `package.json` avec les scripts `build` et `start`
- `nixpacks.toml` pour la configuration de build
- `railway.json` pour les paramètres Railway

### 6. Déploiement Automatique

Une fois configuré :
1. Railway détectera automatiquement les changements sur votre branche `main`
2. Il construira l'application avec `npm run build`
3. Il démarrera l'application avec `npm start`
4. L'application sera accessible via l'URL fournie par Railway

### 7. Initialisation de la Base de Données

La base de données sera initialisée automatiquement au premier démarrage grâce à `lib/db.ts`.

Les tables suivantes seront créées automatiquement :
- `slides`
- `content_about`
- `content_legal`
- `services`
- `realisations`
- `evenements`
- `galerie`
- `partenaires`
- `blog_pubs`
- `blog_articles`

### 8. Migration des Données (Optionnel)

Si vous avez des données dans `data/*.json` que vous souhaitez migrer :

1. Connectez-vous à votre base de données PostgreSQL via Railway
2. Utilisez un outil comme pgAdmin ou DBeaver
3. Importez manuellement les données depuis les fichiers JSON

### 9. Configuration du Domaine Personnalisé (Optionnel)

1. Dans Railway, allez dans "Settings" → "Domains"
2. Ajoutez votre domaine personnalisé
3. Configurez les enregistrements DNS selon les instructions Railway

### 10. Gestion des Fichiers Uploadés

⚠️ **Important** : Les fichiers uploadés dans `public/uploads/` ne persistent pas entre les redéploiements sur Railway.

**Solutions recommandées :**

1. **Railway Volumes** (Recommandé pour le développement) :
   - Ajoutez un Volume Railway pour `public/uploads/`
   - Les fichiers persisteront entre les redéploiements

2. **Service de Stockage Cloud** (Recommandé pour la production) :
   - Utilisez AWS S3, Cloudinary, ou un service similaire
   - Modifiez `app/api/upload/route.ts` pour uploader vers le service cloud

### 11. Monitoring et Logs

- **Logs** : Accessibles dans l'onglet "Deployments" → Cliquez sur un déploiement
- **Metrics** : Disponibles dans l'onglet "Metrics"
- **Health Checks** : Railway vérifie automatiquement la santé de l'application

### 12. Variables d'Environnement Sensibles

⚠️ **Sécurité** : Ne commitez jamais vos variables d'environnement dans Git.

- Utilisez toujours les variables d'environnement Railway
- Le fichier `.env.example` est fourni comme référence
- Ne créez jamais de fichier `.env` dans le repository

## Dépannage

### L'application ne démarre pas

1. Vérifiez les logs dans Railway
2. Vérifiez que toutes les variables d'environnement sont définies
3. Vérifiez que `DATABASE_URL` est correctement configuré

### Erreurs de connexion à la base de données

1. Vérifiez que `USE_DATABASE=true` est défini
2. Vérifiez que `DATABASE_URL` est correct
3. Vérifiez que la base de données PostgreSQL est active dans Railway

### Les images ne s'affichent pas

1. Vérifiez que le dossier `public/uploads/` existe
2. Utilisez Railway Volumes pour persister les fichiers
3. Ou migrez vers un service de stockage cloud

### Build échoue

1. Vérifiez les logs de build dans Railway
2. Assurez-vous que toutes les dépendances sont dans `package.json`
3. Vérifiez que Node.js version 18+ est utilisé

## Commandes Utiles

```bash
# Vérifier la configuration localement
npm run build
npm start

# Vérifier les variables d'environnement
railway variables

# Voir les logs en temps réel
railway logs
```

## Support

Pour plus d'aide :
- [Documentation Railway](https://docs.railway.app)
- [Documentation Next.js](https://nextjs.org/docs)
- [Support Railway](https://railway.app/support)

