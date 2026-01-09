# 🔧 Correction Nixpacks - Node.js 20

## Problème

Railway retourne l'erreur :
```
error: undefined variable 'nodejs-20_x'
```

## Solution Appliquée

**Option 1 (Recommandée)** : Laisser Nixpacks détecter automatiquement depuis `package.json`

Le fichier `nixpacks.toml` a été simplifié pour laisser Nixpacks détecter automatiquement la version de Node.js depuis le champ `engines` dans `package.json` :

```toml
[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm start"
```

Le `package.json` contient déjà :
```json
"engines": {
  "node": ">=20.0.0",
  "npm": ">=9.0.0"
}
```

## Alternatives si Option 1 ne fonctionne pas

Si Nixpacks ne détecte pas automatiquement Node.js 20, essayez ces alternatives :

### Option 2 : Utiliser une variable d'environnement

Ajouter dans Railway :
- Variable : `NODE_VERSION`
- Valeur : `20`

### Option 3 : Utiliser .nvmrc

Créer un fichier `.nvmrc` à la racine :
```
20
```

### Option 4 : Syntaxe alternative dans nixpacks.toml

Si nécessaire, essayer :
```toml
[phases.setup]
nixPkgs = ["nodejs-20"]
```

ou

```toml
[phases.setup]
nixPkgs = ["nodejs_20_x"]
```

## Vérification

Après le déploiement, vérifier dans les logs Railway que Node.js 20 est bien utilisé.

