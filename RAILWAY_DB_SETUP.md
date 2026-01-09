# ✅ Base de Données Railway - Configuration Complète

## 🎉 Statut : Base de données initialisée avec succès !

### Tables créées (14 tables) :
- ✅ `slides` - Carrousel d'accueil
- ✅ `content_about` - Section À propos
- ✅ `content_legal` - Contenu légal (CGU, privacy, mentions)
- ✅ `services` - Services proposés
- ✅ `realisations` - Réalisations
- ✅ `evenements` - Événements
- ✅ `galerie` - Galerie d'images
- ✅ `partenaires` - Collaborations
- ✅ `blog_pubs` - Publicités
- ✅ `blog_articles` - Articles
- ✅ `impacts` - Impacts géographiques
- ✅ `distinctions` - Distinctions et récompenses
- ✅ `produits` - Produits de la boutique
- ✅ `reseaux_sociaux` - Réseaux sociaux

### Données importées :
- ✅ 3 slides
- ✅ Contenu "À propos"
- ✅ Contenu légal
- ✅ 4 services
- ✅ 3 réalisations
- ✅ 1 événement
- ✅ 2 partenaires
- ✅ 1 impact
- ✅ 1 distinction
- ✅ 1 produit
- ✅ Réseaux sociaux

## 🔧 Configuration des Variables d'Environnement sur Railway

### Dans votre service Next.js sur Railway, ajoutez ces variables :

#### Variables de Base de Données (déjà configurées par Railway PostgreSQL)
```
DATABASE_URL=postgresql://postgres:ApqkYmoXcciLkCnRuxfCjeuLoXIlIMpu@postgres.railway.internal:5432/railway
```

#### Variables Requises pour l'Application
```
USE_DATABASE=true
JWT_SECRET=votre-cle-secrete-tres-longue-et-aleatoire
ADMIN_USERNAME=OFAMM2026
ADMIN_PASSWORD=obe@_001
NODE_ENV=production
```

### Comment ajouter les variables sur Railway :

1. Allez dans votre projet Railway
2. Sélectionnez votre service Next.js
3. Cliquez sur l'onglet **"Variables"**
4. Ajoutez chaque variable une par une :
   - Cliquez sur **"New Variable"**
   - Entrez le nom de la variable
   - Entrez la valeur
   - Cliquez sur **"Add"**

## 🔐 Génération d'une clé JWT sécurisée

Pour générer une clé JWT sécurisée, exécutez :

```bash
openssl rand -base64 32
```

Ou utilisez un générateur en ligne : https://generate-secret.vercel.app/32

## ✅ Vérification de la Connexion

Une fois les variables configurées, l'application se connectera automatiquement à la base de données Railway au démarrage.

### Test de connexion

L'application vérifiera automatiquement la connexion au démarrage. Si tout est correct, vous verrez dans les logs :

```
Database tables initialized successfully
```

## 📝 Notes Importantes

1. **DATABASE_URL** : Utilisez l'URL interne (`postgres.railway.internal`) pour les connexions depuis l'application Railway
2. **DATABASE_PUBLIC_URL** : Utilisez cette URL uniquement pour les connexions externes (scripts, outils de gestion)
3. **SSL** : La connexion SSL est automatiquement configurée pour Railway
4. **Initialisation** : Les tables sont créées automatiquement au premier démarrage si elles n'existent pas

## 🚀 Prochaines Étapes

1. ✅ Base de données initialisée
2. ⏳ Configurer les variables d'environnement sur Railway
3. ⏳ Redéployer l'application
4. ⏳ Vérifier que l'application se connecte correctement

## 🔄 Réinitialisation (si nécessaire)

Si vous devez réinitialiser la base de données, exécutez :

```bash
DATABASE_PUBLIC_URL="postgresql://postgres:ApqkYmoXcciLkCnRuxfCjeuLoXIlIMpu@centerbeam.proxy.rlwy.net:28451/railway" node scripts/init-railway-db.js
```

## 📊 Structure de la Base de Données

Toutes les tables utilisent :
- `id` : SERIAL PRIMARY KEY (auto-incrémenté)
- `created_at` : TIMESTAMP avec valeur par défaut CURRENT_TIMESTAMP
- `updated_at` : TIMESTAMP avec valeur par défaut CURRENT_TIMESTAMP

Les données sont maintenant synchronisées entre votre environnement local et Railway !

