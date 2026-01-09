# Guide de déploiement avec PostgreSQL sur Railway

> ⚠️ **Note** : Ce fichier est conservé pour référence. Pour un guide complet et à jour, consultez **[RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)**

## Configuration Rapide

### 1. Fichiers de Configuration Créés

Les fichiers suivants ont été créés pour Railway :
- `railway.json` - Configuration Railway
- `nixpacks.toml` - Configuration de build
- `env.example` - Exemple de variables d'environnement
- `.railwayignore` - Fichiers à ignorer lors du déploiement
- `RAILWAY_DEPLOYMENT.md` - Guide complet de déploiement

### 2. Variables d'Environnement Requises

Voir `env.example` pour la liste complète. Variables essentielles :

```env
DATABASE_URL=postgresql://... (fourni automatiquement par Railway)
USE_DATABASE=true
JWT_SECRET=votre-cle-secrete
ADMIN_PASSWORD=votre-mot-de-passe
NODE_ENV=production
```

### 3. Déploiement

1. Connectez votre repo GitHub à Railway
2. Ajoutez un service PostgreSQL
3. Configurez les variables d'environnement
4. Railway déploiera automatiquement

### 4. Structure de la Base de Données

Les tables suivantes seront créées automatiquement :

- `slides` : Slides de la page d'accueil
- `content_about` : Contenu de la page À propos
- `content_legal` : Contenu légal (CGU, privacy, mentions)
- `services` : Services proposés
- `realisations` : Réalisations
- `evenements` : Événements
- `galerie` : Images de la galerie
- `partenaires` : Collaborations
- `blog_pubs` : Publicités
- `blog_articles` : Articles

### Notes Importantes

- En développement local, les données sont stockées dans `data/*.json`
- En production avec `USE_DATABASE=true`, les données sont dans PostgreSQL
- Les images uploadées : utilisez Railway Volumes ou un service cloud (S3, Cloudinary)
- La base de données est initialisée automatiquement au premier démarrage

Pour plus de détails, consultez **[RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)**

