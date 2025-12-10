# 🔐 Accès à l'Administration

## 📍 URL d'accès

### Page de connexion
```
http://localhost:3000/admin/login
```

### Dashboard admin (après connexion)
```
http://localhost:3000/admin
```

## 🔑 Identifiants par défaut

**Identifiant :** `OFAMM2026`

**Mot de passe :** `obe@_001`

> ⚠️ **Important** : Changez ces identifiants en production en créant un fichier `.env.local` avec :
> ```
> ADMIN_USERNAME=votre-identifiant
> ADMIN_PASSWORD=votre-mot-de-passe-securise
> JWT_SECRET=votre-cle-secrete-tres-longue
> ```

## 📋 Fonctionnalités disponibles dans l'admin

### 1. **Onglet Slides**
- ✅ Ajouter des slides
- ✅ Modifier les slides existants
- ✅ Supprimer des slides
- ✅ Upload d'images depuis votre ordinateur
- ✅ Personnaliser le titre, description, bouton CTA

### 2. **Onglet Contenu**
- ✅ Modifier la section "À propos"
- ✅ Gérer les services (ajouter, modifier, supprimer)

### 3. **Onglet Réalisations**
- ✅ Ajouter des réalisations
- ✅ Upload d'images
- ✅ Modifier ou supprimer

### 4. **Onglet Événements**
- ✅ Ajouter des événements
- ✅ Upload d'images
- ✅ Ajouter date et lieu
- ✅ Modifier ou supprimer

### 5. **Onglet Galerie**
- ✅ Ajouter des images à la galerie
- ✅ Upload d'images depuis votre ordinateur
- ✅ Modifier ou supprimer

## 🚀 Guide d'utilisation rapide

1. **Accéder à l'admin :**
   - Ouvrez votre navigateur
   - Allez sur `http://localhost:3000/admin/login`
   - Entrez le mot de passe : `admin123`
   - Cliquez sur "Se connecter"

2. **Gérer les slides :**
   - Cliquez sur l'onglet "Slides"
   - Cliquez sur "Ajouter un slide"
   - Remplissez les informations
   - Cliquez sur la zone d'upload pour sélectionner une image
   - Cliquez sur "Enregistrer"

3. **Modifier le contenu :**
   - Cliquez sur l'onglet "Contenu"
   - Modifiez les textes
   - Cliquez sur "Enregistrer"

4. **Ajouter des réalisations/événements/images :**
   - Sélectionnez l'onglet correspondant
   - Cliquez sur "Ajouter"
   - Remplissez les informations
   - Upload une image si nécessaire
   - Cliquez sur "Enregistrer"

## 🔒 Sécurité

- Les routes admin sont protégées par authentification
- Le token de session expire après 7 jours
- En production, utilisez un mot de passe fort
- Ne partagez jamais vos identifiants

## 📝 Notes

- Toutes les modifications sont immédiatement visibles sur le site public
- Les images uploadées sont stockées dans `public/uploads/`
- Les données sont stockées dans `data/slides.json` et `data/content.json` (mode développement)
- En production avec PostgreSQL, les données seront dans la base de données

