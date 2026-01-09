# 🔧 Problème des Images sur Railway

## 🔴 Problème Identifié

Les images uploadées ne sont **pas visibles en production** sur Railway car :

1. **Système de fichiers éphémère** : Railway utilise un système de fichiers temporaire
2. **Fichiers perdus** : Les fichiers dans `/public/uploads/` sont **perdus lors des redéploiements**
3. **Pas de persistance** : Le dossier `public/uploads` n'est pas persistant entre les déploiements

## ✅ Solutions Possibles

### Solution 1 : URLs Externes (Recommandé) ⭐

Utiliser un service de stockage externe :
- **Cloudinary** (gratuit jusqu'à 25GB)
- **Imgur** (gratuit, API simple)
- **AWS S3** (payant mais fiable)
- **Supabase Storage** (gratuit jusqu'à 1GB)

**Avantages** :
- ✅ Persistance garantie
- ✅ CDN intégré
- ✅ Optimisation automatique
- ✅ Pas de perte lors des redéploiements

### Solution 2 : Base64 dans PostgreSQL

Stocker les images directement en base64 dans la colonne `image` de PostgreSQL.

**Avantages** :
- ✅ Pas de service externe nécessaire
- ✅ Persistance garantie
- ✅ Simple à implémenter

**Inconvénients** :
- ❌ Augmente la taille de la base de données
- ❌ Ralentit les requêtes
- ❌ Limite de taille (max ~1MB par image recommandé)

### Solution 3 : Volume Persistant Railway (Payant)

Utiliser un volume persistant Railway pour stocker les fichiers.

**Avantages** :
- ✅ Fichiers persistants
- ✅ Pas de changement de code nécessaire

**Inconvénients** :
- ❌ Coût supplémentaire
- ❌ Configuration complexe

## 💡 Solution Immédiate (Temporaire)

Pour l'instant, les images sont configurées avec `unoptimized={true}` pour les chemins `/uploads/` afin d'éviter les erreurs Next.js Image.

**Pour tester** :
1. Vérifier que les images sont bien sauvegardées dans la DB : `node scripts/check-image-paths.js`
2. Utiliser des URLs externes (ex: `https://picsum.photos/400/300`) pour tester
3. Voir les logs dans la console navigateur (F12) pour les erreurs d'images

## 📋 Prochaines Étapes Recommandées

1. **Court terme** : Utiliser des URLs externes pour les nouvelles images
2. **Moyen terme** : Implémenter Cloudinary ou Imgur pour l'upload
3. **Long terme** : Migrer toutes les images vers un service externe

## 🔍 Diagnostic

Pour vérifier les chemins d'images dans la base de données :

```bash
node scripts/check-image-paths.js
```

Ce script affichera :
- Les chemins d'images stockés
- Si ce sont des URLs externes (✅) ou des chemins locaux (⚠️)
- Le nombre d'images par type de contenu

