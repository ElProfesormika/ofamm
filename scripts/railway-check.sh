#!/bin/bash

# Script pour vérifier la connexion Railway via CLI

echo "🔍 VÉRIFICATION RAILWAY CLI"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Vérifier si Railway CLI est installé
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI n'est pas installé"
    echo "   Installation: sudo npm install -g @railway/cli"
    exit 1
fi

echo "✅ Railway CLI installé: $(railway --version)"
echo ""

# Vérifier la connexion
echo "📋 Vérification de la connexion..."
if railway whoami &> /dev/null; then
    echo "✅ Connecté à Railway"
    railway whoami
    echo ""
    
    # Vérifier le projet lié
    echo "📋 Projet lié:"
    railway status 2>&1 | head -10
    echo ""
    
    # Vérifier les variables d'environnement
    echo "📋 Variables d'environnement (DATABASE_URL, USE_DATABASE):"
    railway variables 2>&1 | grep -E "DATABASE|USE_DATABASE" || echo "   Variables non trouvées dans la sortie"
    echo ""
    
    # Vérifier les services
    echo "📋 Services:"
    railway service 2>&1 | head -10
    echo ""
    
    echo "✅ Vérification Railway CLI terminée"
else
    echo "⚠️  Non connecté à Railway"
    echo ""
    echo "Pour vous connecter:"
    echo "  1. railway login"
    echo "  2. railway link"
    echo ""
    echo "Note: La vérification directe via PostgreSQL fonctionne déjà"
    echo "      et confirme que la base de données est bien reliée."
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

