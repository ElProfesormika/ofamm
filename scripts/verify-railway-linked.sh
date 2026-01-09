#!/bin/bash

# Script pour vérifier la connexion Railway maintenant que le projet est lié

echo "🔍 VÉRIFICATION RAILWAY : PROJET LIÉ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Statut du projet
echo "📋 1. STATUT DU PROJET"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
railway status 2>&1
echo ""

# 2. Variables d'environnement
echo "📋 2. VARIABLES D'ENVIRONNEMENT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Variables critiques pour la base de données :"
echo ""

DATABASE_URL=$(railway variables get DATABASE_URL 2>&1 | grep -v "Getting" | grep -v "Using" | head -1)
USE_DATABASE=$(railway variables get USE_DATABASE 2>&1 | grep -v "Getting" | grep -v "Using" | head -1)
JWT_SECRET=$(railway variables get JWT_SECRET 2>&1 | grep -v "Getting" | grep -v "Using" | head -1)

if [ -n "$DATABASE_URL" ] && [ "$DATABASE_URL" != "null" ]; then
    echo "✅ DATABASE_URL : Configurée"
    echo "   Host: $(echo $DATABASE_URL | grep -oP '@[^:]+' | sed 's/@//' || echo 'N/A')"
else
    echo "⚠️  DATABASE_URL : Non trouvée ou non configurée"
fi

if [ -n "$USE_DATABASE" ] && [ "$USE_DATABASE" != "null" ]; then
    echo "✅ USE_DATABASE : $USE_DATABASE"
else
    echo "⚠️  USE_DATABASE : Non configurée (devrait être 'true')"
fi

if [ -n "$JWT_SECRET" ] && [ "$JWT_SECRET" != "null" ]; then
    echo "✅ JWT_SECRET : Configuré"
else
    echo "⚠️  JWT_SECRET : Non configuré"
fi
echo ""

# 3. Services
echo "📋 3. SERVICES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
railway service 2>&1 | head -20
echo ""

# 4. Test de connexion à la base de données
echo "📋 4. TEST DE CONNEXION À LA BASE DE DONNÉES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Utiliser railway run pour obtenir les variables d'environnement
railway run node -e "
const { Pool } = require('pg');

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.log('❌ DATABASE_URL non trouvée dans les variables Railway');
  process.exit(1);
}

const pool = new Pool({
  connectionString: dbUrl,
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
    console.log('❌ Erreur:', e.message);
    process.exit(1);
  });
" 2>&1

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Vérification terminée"

