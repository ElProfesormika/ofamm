#!/bin/bash

# Script pour corriger toutes les pages admin avec la même gestion d'erreur

echo "🔧 Correction de toutes les pages admin..."

# Liste des fichiers à corriger
FILES=(
  "app/admin/impacts/page.tsx"
  "app/admin/boutique/page.tsx"
  "app/admin/realisations/page.tsx"
  "app/admin/evenements/page.tsx"
  "app/admin/galerie/page.tsx"
  "app/admin/collaborations/page.tsx"
  "app/admin/blog/pubs/page.tsx"
  "app/admin/blog/articles/page.tsx"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file existe"
  else
    echo "❌ $file n'existe pas"
  fi
done

