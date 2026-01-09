# 🔐 Variables d'Environnement Railway - Configuration Complète

## ✅ Variables à ajouter dans Railway

Copiez-collez ces variables dans l'onglet **"Variables"** de votre service Next.js sur Railway :

### Variables Requises

```env
USE_DATABASE=true
JWT_SECRET=yvWYPk1/nRLTznOa5JwmCexJ4Rw/PUxmYW2CH4kt2xg=
ADMIN_USERNAME=OFAMM2026
ADMIN_PASSWORD=obe@_001
NODE_ENV=production
```

### Variable Automatique (déjà configurée par Railway)

```env
DATABASE_URL=postgresql://postgres:ApqkYmoXcciLkCnRuxfCjeuLoXIlIMpu@postgres.railway.internal:5432/railway
```

**Note** : Cette variable est automatiquement ajoutée par Railway lorsque vous créez un service PostgreSQL. Vous n'avez pas besoin de l'ajouter manuellement.

## 📋 Instructions pour Ajouter les Variables sur Railway

1. **Connectez-vous à Railway** : https://railway.app
2. **Sélectionnez votre projet**
3. **Cliquez sur votre service Next.js**
4. **Allez dans l'onglet "Variables"**
5. **Pour chaque variable ci-dessus** :
   - Cliquez sur **"New Variable"**
   - Entrez le **nom** de la variable (ex: `USE_DATABASE`)
   - Entrez la **valeur** (ex: `true`)
   - Cliquez sur **"Add"**

## 🔐 Détails des Variables

### `USE_DATABASE`
- **Valeur** : `true`
- **Description** : Active l'utilisation de PostgreSQL au lieu des fichiers JSON
- **Obligatoire** : Oui

### `JWT_SECRET`
- **Valeur** : `yvWYPk1/nRLTznOa5JwmCexJ4Rw/PUxmYW2CH4kt2xg=`
- **Description** : Clé secrète pour signer les tokens JWT d'authentification admin
- **Obligatoire** : Oui
- **Sécurité** : ⚠️ Ne partagez jamais cette clé publiquement

### `ADMIN_USERNAME`
- **Valeur** : `OFAMM2026`
- **Description** : Nom d'utilisateur pour accéder au panneau d'administration
- **Obligatoire** : Oui
- **Recommandation** : Changez-le pour un identifiant plus sécurisé en production

### `ADMIN_PASSWORD`
- **Valeur** : `obe@_001`
- **Description** : Mot de passe pour accéder au panneau d'administration
- **Obligatoire** : Oui
- **Recommandation** : Changez-le pour un mot de passe plus fort en production

### `NODE_ENV`
- **Valeur** : `production`
- **Description** : Environnement d'exécution (production)
- **Obligatoire** : Recommandé

### `DATABASE_URL`
- **Valeur** : Automatiquement fournie par Railway
- **Description** : URL de connexion PostgreSQL
- **Obligatoire** : Oui (automatique)

## ✅ Vérification

Après avoir ajouté toutes les variables :

1. **Redéployez l'application** sur Railway
2. **Vérifiez les logs** - Vous devriez voir :
   ```
   Database tables initialized successfully
   ```
3. **Testez l'accès admin** : `https://votre-app.railway.app/admin/login`
   - Identifiant : `OFAMM2026`
   - Mot de passe : `obe@_001`

## 🔒 Sécurité

⚠️ **Important** : 
- Ne commitez jamais ces valeurs dans Git
- Changez `ADMIN_PASSWORD` et `ADMIN_USERNAME` pour des valeurs plus sécurisées
- La clé `JWT_SECRET` est déjà sécurisée (générée aléatoirement)

## 📝 Checklist de Déploiement

- [ ] Variables d'environnement ajoutées sur Railway
- [ ] Application redéployée
- [ ] Logs vérifiés (pas d'erreurs de connexion DB)
- [ ] Accès admin testé
- [ ] Données visibles dans l'application

## 🎉 Résultat Attendu

Une fois toutes les variables configurées :
- ✅ L'application se connectera automatiquement à PostgreSQL
- ✅ Les tables sont déjà créées (14 tables)
- ✅ Les données sont déjà importées
- ✅ L'application fonctionnera en mode production avec base de données

