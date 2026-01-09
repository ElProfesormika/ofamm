#!/bin/bash
# Script pour corriger toutes les colonnes image via Railway CLI

echo "🔧 Correction des colonnes image via Railway CLI..."
echo ""

# Vérifier si Railway CLI est installé
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI n'est pas installé"
    echo "   Installez-le avec: npm install -g @railway/cli"
    exit 1
fi

# Vérifier si le projet est lié
if ! railway status &> /dev/null; then
    echo "❌ Le projet n'est pas lié à Railway"
    echo "   Exécutez: railway link"
    exit 1
fi

echo "✅ Railway CLI détecté"
echo "📋 Exécution des commandes SQL..."
echo ""

# Exécuter les commandes SQL via Railway
railway run psql $DATABASE_URL << 'SQL'
-- Correction de toutes les colonnes image/logo
ALTER TABLE galerie ALTER COLUMN image TYPE TEXT;
ALTER TABLE partenaires ALTER COLUMN logo TYPE TEXT;
ALTER TABLE distinctions ALTER COLUMN image TYPE TEXT;
ALTER TABLE impacts ALTER COLUMN image TYPE TEXT;
ALTER TABLE produits ALTER COLUMN image TYPE TEXT;
ALTER TABLE realisations ALTER COLUMN image TYPE TEXT;
ALTER TABLE evenements ALTER COLUMN image TYPE TEXT;
ALTER TABLE blog_pubs ALTER COLUMN image TYPE TEXT;
ALTER TABLE blog_articles ALTER COLUMN image TYPE TEXT;
ALTER TABLE slides ALTER COLUMN image TYPE TEXT;

-- Vérification
SELECT table_name, column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE column_name IN ('image', 'logo')
ORDER BY table_name, column_name;
SQL

echo ""
echo "✅ Migration terminée !"
