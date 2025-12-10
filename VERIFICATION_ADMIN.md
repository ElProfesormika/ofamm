# Vérification de la structure Admin

## ✅ Pages Admin existantes

1. **`app/admin/page.tsx`** - Page principale admin (dashboard)
   - Affiche le composant `AdminDashboard`
   - Protégée par le middleware

2. **`app/admin/login/page.tsx`** - Page de connexion
   - Formulaire de login avec identifiant et mot de passe
   - Redirige vers `/admin` après connexion réussie

## ✅ Composants Admin

1. **`components/AdminDashboard.tsx`** - Dashboard complet avec :
   - Gestion des slides
   - Gestion du contenu (À propos, Services)
   - Gestion des réalisations
   - Gestion des événements
   - Gestion de la galerie

## ✅ API Routes

1. **`app/api/auth/login/route.ts`** - Authentification
2. **`app/api/auth/logout/route.ts`** - Déconnexion
3. **`app/api/slides/route.ts`** - CRUD des slides
4. **`app/api/content/route.ts`** - CRUD du contenu
5. **`app/api/upload/route.ts`** - Upload d'images

## ✅ Middleware

- **`middleware.ts`** - Protège toutes les routes `/admin/*` sauf `/admin/login`

## 🔑 Identifiants

- **Identifiant :** `OFAMM2026`
- **Mot de passe :** `obe@_001`

## 🔄 Flux de connexion

1. Utilisateur va sur `/admin/login`
2. Saisit identifiant et mot de passe
3. Clic sur "Se connecter"
4. API vérifie les identifiants
5. Si OK : cookie `admin_token` est défini
6. Redirection vers `/admin` avec `window.location.href`
7. Middleware vérifie le cookie
8. Si cookie valide : accès au dashboard

## 🐛 Si ça ne fonctionne pas

1. Vérifiez les logs du serveur (terminal)
2. Vérifiez la console du navigateur (F12)
3. Vérifiez les cookies dans DevTools → Application → Cookies
4. Redémarrez le serveur (`npm run dev`)

