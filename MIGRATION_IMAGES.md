# Migration des colonnes image vers TEXT

## Problème
Les colonnes `image` et `logo` étaient en `VARCHAR(500)`, ce qui limite la taille des images base64.

## Solution
Toutes les colonnes `image` et `logo` ont été converties en `TEXT` pour supporter les images base64 de grande taille.

## Tables concernées
- `galerie.image`
- `partenaires.logo`
- `distinctions.image`
- `impacts.image`
- `produits.image`
- `realisations.image`
- `evenements.image`
- `blog_pubs.image`
- `blog_articles.image`
- `slides.image`

## Migration automatique
La migration est automatique via `lib/db.ts` dans `initDatabase()`. Elle s'exécute au démarrage de l'application.

## Migration manuelle (si nécessaire)
Exécutez le script SQL : `scripts/fix-all-image-columns.sql`

Ou via Railway :
1. Allez sur railway.app → Votre projet → PostgreSQL
2. Cliquez sur "Query" ou "Connect"
3. Exécutez les commandes ALTER TABLE du script SQL
