#!/bin/bash

# Script pour vérifier la connexion Railway via différentes méthodes

echo "🔍 VÉRIFICATION DE LA CONNEXION RAILWAY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Méthode 1: Railway CLI
echo "📋 Méthode 1: Railway CLI"
if command -v railway &> /dev/null; then
    echo "✅ Railway CLI installé"
    railway --version
    echo ""
    echo "Vérification de la connexion..."
    railway whoami 2>&1 || echo "⚠️  Non connecté à Railway"
    echo ""
    echo "Vérification des variables d'environnement..."
    railway variables 2>&1 | head -20 || echo "⚠️  Impossible de récupérer les variables"
else
    echo "❌ Railway CLI non installé"
    echo "   Installation: npm install -g @railway/cli"
fi
echo ""

# Méthode 2: Vérification directe de la base de données
echo "📋 Méthode 2: Vérification directe de la base de données"
if [ -n "$DATABASE_PUBLIC_URL" ] || [ -n "$DATABASE_URL" ]; then
    DB_URL="${DATABASE_PUBLIC_URL:-$DATABASE_URL}"
    echo "✅ DATABASE_URL trouvée"
    echo "   Host: $(echo $DB_URL | grep -oP '@[^:]+' | sed 's/@//')"
    echo "   Port: $(echo $DB_URL | grep -oP ':\d+' | sed 's/://' | head -1)"
    echo ""
    echo "Test de connexion..."
    node -e "
    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: process.env.DATABASE_PUBLIC_URL || process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    pool.query('SELECT NOW() as time, version() as version')
      .then(r => {
        console.log('✅ Connexion réussie!');
        console.log('   Heure serveur:', r.rows[0].time);
        console.log('   PostgreSQL:', r.rows[0].version.split(' ')[0], r.rows[0].version.split(' ')[1]);
        process.exit(0);
      })
      .catch(e => {
        console.log('❌ Erreur de connexion:', e.message);
        process.exit(1);
      });
    " 2>&1 || echo "❌ Impossible de se connecter"
else
    echo "⚠️  DATABASE_URL non définie dans l'environnement"
fi
echo ""

# Méthode 3: Vérification des tables
echo "📋 Méthode 3: Vérification des tables"
if [ -n "$DATABASE_PUBLIC_URL" ] || [ -n "$DATABASE_URL" ]; then
    node -e "
    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: process.env.DATABASE_PUBLIC_URL || process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    pool.query(\`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    \`)
      .then(r => {
        console.log('✅ Tables trouvées:', r.rows.length);
        r.rows.forEach((row, i) => {
          console.log(\`   \${i+1}. \${row.table_name}\`);
        });
        process.exit(0);
      })
      .catch(e => {
        console.log('❌ Erreur:', e.message);
        process.exit(1);
      });
    " 2>&1 || echo "❌ Impossible de vérifier les tables"
else
    echo "⚠️  DATABASE_URL non définie"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Vérification terminée"

