#!/bin/bash

# Script pour vérifier la connexion Railway via CLI et base de données

echo "🔍 VÉRIFICATION RAILWAY VIA CLI ET BASE DE DONNÉES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Vérification Railway CLI
echo "📋 1. VÉRIFICATION RAILWAY CLI"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if command -v railway &> /dev/null; then
    echo "✅ Railway CLI installé"
    railway --version
    echo ""
    
    echo "Vérification de l'authentification..."
    railway whoami 2>&1
    echo ""
    
    echo "⚠️  Note: Pour lier le projet, exécutez: railway link"
    echo "   (Cela nécessite une interaction dans le terminal)"
else
    echo "❌ Railway CLI non installé"
fi
echo ""

# Vérification directe de la base de données
echo "📋 2. VÉRIFICATION DIRECTE DE LA BASE DE DONNÉES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -n "$DATABASE_PUBLIC_URL" ] || [ -n "$DATABASE_URL" ]; then
    DB_URL="${DATABASE_PUBLIC_URL:-$DATABASE_URL}"
    echo "✅ DATABASE_URL trouvée"
    
    # Extraire les informations de connexion
    HOST=$(echo $DB_URL | grep -oP '@[^:]+' | sed 's/@//')
    PORT=$(echo $DB_URL | grep -oP ':\d+' | sed 's/://' | head -1)
    DB_NAME=$(echo $DB_URL | grep -oP '/[^?]+' | sed 's/\///' | tail -1)
    
    echo "   Host: $HOST"
    echo "   Port: $PORT"
    echo "   Database: $DB_NAME"
    echo ""
    
    # Test de connexion
    echo "Test de connexion à PostgreSQL Railway..."
    node -e "
    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: process.env.DATABASE_PUBLIC_URL || process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    pool.query('SELECT NOW() as time, version() as version, current_database() as db')
      .then(r => {
        console.log('✅ Connexion réussie!');
        console.log('   Heure serveur:', r.rows[0].time);
        console.log('   PostgreSQL:', r.rows[0].version.split(' ')[0], r.rows[0].version.split(' ')[1]);
        console.log('   Database:', r.rows[0].db);
        return pool.query('SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = \\'public\\'');
      })
      .then(r => {
        console.log('   Tables:', r.rows[0].count);
        process.exit(0);
      })
      .catch(e => {
        console.log('❌ Erreur de connexion:', e.message);
        process.exit(1);
      });
    " 2>&1
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ La base de données Railway est accessible et fonctionnelle"
    else
        echo ""
        echo "❌ Problème de connexion à la base de données"
    fi
else
    echo "⚠️  DATABASE_URL non définie dans l'environnement"
    echo "   Cette variable devrait être fournie automatiquement par Railway"
    echo "   Vérifiez les variables d'environnement dans votre projet Railway"
fi
echo ""

# Résumé
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 RÉSUMÉ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Pour lier votre projet local à Railway:"
echo "  1. Allez dans votre projet sur Railway"
echo "  2. Exécutez: railway link"
echo "  3. Sélectionnez votre projet"
echo ""
echo "Pour vérifier les variables d'environnement sur Railway:"
echo "  railway variables"
echo ""
echo "Pour vérifier les services:"
echo "  railway service"
echo ""

