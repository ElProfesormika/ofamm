# Test d'authentification

## Identifiants de test
- **Identifiant :** `OFAMM2026`
- **Mot de passe :** `obe@_001`

## Étapes de débogage

1. **Ouvrez la console du navigateur** (F12 → Console)
2. **Ouvrez le terminal** où `npm run dev` tourne
3. **Allez sur** `http://localhost:3000/admin/login`
4. **Entrez les identifiants** et cliquez sur "Se connecter"
5. **Regardez les logs** dans :
   - Console du navigateur (F12)
   - Terminal du serveur

## Ce que vous devriez voir

### Dans la console du navigateur :
```
=== CLIENT: Sending login request ===
Username: OFAMM2026
Password length: 8
=== CLIENT: Response received ===
Status: 200
OK: true
Response data: {success: true, message: "Connexion réussie"}
=== CLIENT: Login successful, redirecting ===
```

### Dans le terminal du serveur :
```
Login attempt received: { username: 'OFAMM2026', password: '***' }
=== AUTHENTICATION DEBUG ===
Provided username: "OFAMM2026"
Expected username: "OFAMM2026"
Username match: true
...
Authentication successful
Cookie set successfully
```

## Si ça ne fonctionne pas

1. **Redémarrez le serveur** : Arrêtez (Ctrl+C) et relancez `npm run dev`
2. **Videz le cache** : Ctrl+Shift+R dans le navigateur
3. **Vérifiez les cookies** : F12 → Application → Cookies → localhost
4. **Vérifiez les identifiants** : Assurez-vous qu'il n'y a pas d'espaces

