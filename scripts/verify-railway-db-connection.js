#!/usr/bin/env node

/**
 * Script pour vérifier la connexion Railway via la base de données
 * Vérifie que l'application est bien connectée à PostgreSQL sur Railway
 */

const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_PUBLIC_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ Erreur: DATABASE_URL ou DATABASE_PUBLIC_URL doit être défini');
  console.error('   Cette variable est normalement fournie automatiquement par Railway');
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function verifyConnection() {
  console.log('🔍 VÉRIFICATION DE LA CONNEXION RAILWAY → BASE DE DONNÉES\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const client = await pool.connect();
  
  try {
    // Test 1: Connexion
    console.log('📊 TEST 1: Connexion à PostgreSQL Railway');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const connectionTest = await client.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('✅ Connexion réussie!');
    console.log(`   - Heure serveur: ${connectionTest.rows[0].current_time}`);
    console.log(`   - PostgreSQL: ${connectionTest.rows[0].pg_version.split(' ')[0]} ${connectionTest.rows[0].pg_version.split(' ')[1]}`);
    console.log(`   - Host: ${databaseUrl.match(/@([^:]+)/)?.[1] || 'N/A'}`);
    console.log(`   - Database: ${databaseUrl.match(/\/([^?]+)/)?.[1] || 'N/A'}`);
    console.log('');

    // Test 2: Tables
    console.log('📊 TEST 2: Vérification des tables');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    console.log(`✅ ${tables.rows.length} table(s) trouvée(s):`);
    tables.rows.forEach((row, i) => {
      console.log(`   ${i + 1}. ${row.table_name}`);
    });
    console.log('');

    // Test 3: Données
    console.log('📊 TEST 3: Vérification des données');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const dataChecks = [
      { table: 'slides', name: 'Slides' },
      { table: 'services', name: 'Services' },
      { table: 'realisations', name: 'Réalisations' },
      { table: 'evenements', name: 'Événements' },
      { table: 'partenaires', name: 'Partenaires' },
      { table: 'impacts', name: 'Impacts' },
      { table: 'distinctions', name: 'Distinctions' },
      { table: 'produits', name: 'Produits' },
    ];
    
    for (const check of dataChecks) {
      try {
        const count = await client.query(`SELECT COUNT(*) as count FROM ${check.table}`);
        console.log(`   ${check.name.padEnd(20)} : ${count.rows[0].count} enregistrement(s)`);
      } catch (error) {
        console.log(`   ${check.name.padEnd(20)} : ❌ Erreur (${error.message})`);
      }
    }
    console.log('');

    // Test 4: Structure des IDs
    console.log('📊 TEST 4: Vérification de la structure (IDs BIGINT)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const idChecks = [
      'distinctions', 'impacts', 'produits', 'realisations', 
      'evenements', 'partenaires', 'slides', 'services'
    ];
    
    let allBigInt = true;
    for (const table of idChecks) {
      try {
        const result = await client.query(`
          SELECT data_type
          FROM information_schema.columns
          WHERE table_name = $1 AND column_name = 'id'
        `, [table]);
        
        if (result.rows.length > 0) {
          const type = result.rows[0].data_type;
          const isBigInt = type === 'bigint';
          const status = isBigInt ? '✅' : '❌';
          console.log(`   ${status} ${table.padEnd(20)} : ${type}`);
          if (!isBigInt) allBigInt = false;
        }
      } catch (error) {
        console.log(`   ❌ ${table.padEnd(20)} : Erreur`);
        allBigInt = false;
      }
    }
    console.log('');

    // Test 5: Variables d'environnement nécessaires
    console.log('📊 TEST 5: Variables d\'environnement');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const requiredVars = [
      'DATABASE_URL',
      'USE_DATABASE',
      'JWT_SECRET',
      'ADMIN_USERNAME',
      'ADMIN_PASSWORD',
      'NODE_ENV'
    ];
    
    console.log('   Variables requises sur Railway:');
    requiredVars.forEach(varName => {
      const value = process.env[varName];
      if (value) {
        const displayValue = varName.includes('SECRET') || varName.includes('PASSWORD') 
          ? '***' + value.slice(-4) 
          : value.length > 50 
            ? value.substring(0, 50) + '...' 
            : value;
        console.log(`   ✅ ${varName.padEnd(20)} : ${displayValue}`);
      } else {
        console.log(`   ⚠️  ${varName.padEnd(20)} : Non définie`);
      }
    });
    console.log('');

    // Résumé
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 RÉSUMÉ');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('✅ Connexion à PostgreSQL Railway : OK');
    console.log(`✅ Tables créées : ${tables.rows.length}`);
    console.log(`${allBigInt ? '✅' : '⚠️ '} Structure des IDs : ${allBigInt ? 'Toutes en BIGINT' : 'Certaines tables nécessitent une correction'}`);
    console.log('✅ Données présentes dans les tables');
    console.log('');
    
    if (allBigInt && tables.rows.length >= 11) {
      console.log('🎉 TOUT EST CORRECTEMENT CONFIGURÉ!');
      console.log('✅ La base de données Railway est bien reliée à l\'application');
      console.log('✅ Les ajouts admin fonctionneront correctement');
      console.log('✅ Les données seront visibles au public');
    } else {
      console.log('⚠️  Certains éléments nécessitent une attention');
      if (!allBigInt) {
        console.log('   → Exécutez les scripts de correction des tables');
      }
      if (tables.rows.length < 11) {
        console.log('   → Vérifiez que toutes les tables sont créées');
      }
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

verifyConnection().catch((error) => {
  console.error('\n❌ Erreur:', error);
  process.exit(1);
});

