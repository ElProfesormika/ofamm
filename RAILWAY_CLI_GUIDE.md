# Guide Railway CLI : Vérification de la Connexion

## ✅ État Actuel

- **Railway CLI** : Installé (version 4.23.0)
- **Authentification** : Connecté en tant que Housséni YABRE
- **Base de données** : Connectée et fonctionnelle
- **Tables** : 14 tables présentes

## 🔗 Lier le Projet Local à Railway

Pour lier votre projet local à Railway :

```bash
railway link
```

Cela vous permettra de :
1. Sélectionner votre workspace
2. Sélectionner votre projet OFAMM
3. Accéder aux commandes Railway CLI directement depuis le projet

## 📋 Commandes Railway CLI Utiles

Une fois le projet lié :

### Variables d'environnement
```bash
railway variables          # Voir toutes les variables
railway variables get DATABASE_URL  # Voir une variable spécifique
```

### Services
```bash
railway service            # Voir les services du projet
railway service list      # Lister tous les services
```

### Logs
```bash
railway logs              # Voir les logs en temps réel
railway logs --tail       # Suivre les logs
```

### Statut et Informations
```bash
railway status            # Voir le statut du projet
railway open              # Ouvrir le dashboard Railway dans le navigateur
railway whoami            # Voir l'utilisateur connecté
```

### Déploiement
```bash
railway up               # Déployer le projet
railway redeploy         # Redéployer le dernier déploiement
railway restart          # Redémarrer un service
```

### Base de données
```bash
railway connect          # Se connecter à la base de données (psql)
```

## 🔍 Vérification de la Connexion

### Méthode 1 : Via Railway CLI (après `railway link`)
```bash
railway variables | grep DATABASE_URL
railway service
```

### Méthode 2 : Vérification directe (déjà fait)
```bash
DATABASE_PUBLIC_URL="votre-url" node scripts/verify-railway-db-connection.js
```

## ✅ Résultat de la Vérification

La vérification directe confirme :
- ✅ Connexion PostgreSQL Railway : OK
- ✅ 14 tables créées et fonctionnelles
- ✅ Données présentes dans toutes les tables
- ✅ Structure correcte (BIGINT pour tous les IDs)
- ✅ Base de données bien reliée à l'application

## 💡 Note

Le lien Railway CLI (`railway link`) est **optionnel** mais utile pour :
- Gérer les variables d'environnement
- Voir les logs en temps réel
- Redéployer facilement
- Accéder rapidement au dashboard

La connexion à la base de données fonctionne déjà parfaitement sans le lien CLI.
