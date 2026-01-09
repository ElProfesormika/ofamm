# 🔧 Correction : Mise à jour Node.js 18 → 20

## Problème

Railway a rencontré une erreur :
```
error: Node.js 18.x has reached End-Of-Life and has been removed
```

Node.js 18.x a atteint sa fin de vie et n'est plus disponible dans Nixpacks.

## Solution Appliquée

✅ **nixpacks.toml** : `nodejs-18_x` → `nodejs-20_x`
✅ **package.json** : `node >=18.0.0` → `node >=20.0.0`

## Fichiers Modifiés

- `nixpacks.toml` - Version Node.js mise à jour
- `package.json` - Engine Node.js mis à jour

## Vérification

Node.js 20.x est la version LTS actuelle et est compatible avec Next.js 14.2.35.

## Prochaines Étapes

1. Commiter les changements :
   ```bash
   git add nixpacks.toml package.json
   git commit -m "Fix: Update Node.js from 18 to 20 for Railway deployment"
   git push origin main
   ```

2. Railway redéploiera automatiquement avec Node.js 20.

