# Guide d'installation et de configuration

## Installation

1. Installez les dépendances :
```bash
npm install
```

2. Créez un fichier `.env.local` à la racine du projet avec le contenu suivant :
```
JWT_SECRET=votre-cle-secrete-tres-longue-et-aleatoire
ADMIN_PASSWORD=votre-mot-de-passe-admin-securise
```

**Important** : Changez ces valeurs par des valeurs sécurisées en production !

### Configuration de la base de données (optionnel pour la production)

Pour utiliser PostgreSQL en production (sur Railway par exemple) :

1. Ajoutez ces variables d'environnement :
```
DATABASE_URL=postgresql://user:password@host:port/database
USE_DATABASE=true
```

2. Les tables seront créées automatiquement au premier démarrage
3. Voir `DEPLOYMENT.md` pour plus de détails sur le déploiement

## Démarrage

Lancez le serveur de développement :
```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Accès à l'administration

### URL d'accès
- **Page de connexion :** `http://localhost:3000/admin/login`
- **Dashboard :** `http://localhost:3000/admin` (après connexion)

### Identifiants par défaut
- **Identifiant :** `OFAMM2026`
- **Mot de passe :** `obe@_001`

> ⚠️ **Important** : Changez ces identifiants en production (`.env.local`) :
> ```
> ADMIN_USERNAME=votre-identifiant
> ADMIN_PASSWORD=votre-mot-de-passe-securise
> JWT_SECRET=votre-cle-secrete-tres-longue
> ```

### Fonctionnalités
1. **Slides** : Gérer les slides de la page d'accueil avec upload d'images
2. **Contenu** : Modifier la section "À propos" et les services
3. **Réalisations** : Ajouter, modifier, supprimer des réalisations
4. **Événements** : Gérer les événements avec date et lieu
5. **Galerie** : Ajouter des images à la galerie

Voir `ADMIN_ACCESS.md` pour plus de détails.

## Structure des données

Les données sont stockées dans le dossier `data/` :
- `slides.json` : Contient les slides de la page d'accueil
- `content.json` : Contient le contenu des pages (À propos, Services, etc.)

Ces fichiers sont créés automatiquement au premier démarrage avec des données par défaut.

## Fonctionnalités

- ✅ Mode sombre/clair avec persistance
- ✅ Slides interactifs sur la page d'accueil
- ✅ Section admin complète avec CRUD
- ✅ Gestion du contenu en temps réel
- ✅ Design responsive et moderne

