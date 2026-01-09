#!/usr/bin/env node

/**
 * Script de diagnostic pour les distinctions sur Railway
 * Vérifie pourquoi les ajouts ne sont pas visibles
 */

const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_PUBLIC_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ Erreur: DATABASE_URL ou DATABASE_PUBLIC_URL doit être défini');
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function diagnose() {
  console.log('🔍 DIAGNOSTIC : DISTINCTIONS SUR RAILWAY\n');
  
  const client = await pool.connect();
  
  try {
    // 1. Vérifier les distinctions actuelles
    console.log('📊 1. DISTINCTIONS ACTUELLES DANS LA BASE:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const distinctions = await client.query(`
      SELECT 
        id,
        id::text as id_text,
        title,
        description,
        image,
        date,
        created_at,
        updated_at
      FROM distinctions 
      ORDER BY created_at DESC
    `);
    
    console.log(`Nombre total: ${distinctions.rows.length}\n`);
    distinctions.rows.forEach((d, i) => {
      console.log(`${i+1}. ID (int): ${d.id}, ID (text): ${d.id_text}`);
      console.log(`   Titre: ${d.title}`);
      console.log(`   Image: ${d.image || '❌ AUCUNE'}`);
      console.log(`   Date: ${d.date || 'Non définie'}`);
      console.log(`   Créée: ${d.created_at}`);
      console.log(`   Modifiée: ${d.updated_at}`);
      console.log('');
    });

    // 2. Vérifier le problème d'ID
    console.log('🔍 2. TEST DE CONVERSION D\'ID:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const testId = '1767794276535'; // Exemple d'ID généré par Date.now()
    const parsedId = parseInt(testId);
    console.log(`ID string: "${testId}"`);
    console.log(`ID parseInt: ${parsedId}`);
    console.log(`Est valide: ${!isNaN(parsedId)}`);
    console.log(`Problème potentiel: ${parsedId > 2147483647 ? '⚠️  ID trop grand pour INTEGER PostgreSQL!' : '✅ ID valide'}`);
    console.log('');

    // 3. Vérifier le type de colonne ID
    console.log('📋 3. STRUCTURE DE LA TABLE:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const tableInfo = await client.query(`
      SELECT 
        column_name,
        data_type,
        character_maximum_length,
        numeric_precision
      FROM information_schema.columns
      WHERE table_name = 'distinctions'
      ORDER BY ordinal_position
    `);
    
    tableInfo.rows.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type}${col.character_maximum_length ? `(${col.character_maximum_length})` : ''}${col.numeric_precision ? `(${col.numeric_precision})` : ''}`);
    });
    console.log('');

    // 4. Test d'insertion avec un ID généré par Date.now()
    console.log('🧪 4. TEST D\'INSERTION:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const testDistinction = {
      id: Date.now().toString(),
      title: 'Test Distinction - ' + new Date().toISOString(),
      description: 'Test de diagnostic',
      image: 'https://example.com/test.jpg',
      date: '2024'
    };
    
    try {
      const testIdInt = parseInt(testDistinction.id);
      console.log(`Tentative d'insertion avec ID: ${testDistinction.id} (${testIdInt})`);
      
      if (testIdInt > 2147483647) {
        console.log('❌ PROBLÈME DÉTECTÉ: ID trop grand pour INTEGER!');
        console.log('   Solution: Utiliser BIGINT ou laisser PostgreSQL générer l\'ID');
      } else {
        // Test d'insertion
        await client.query('BEGIN');
        try {
          await client.query(
            `INSERT INTO distinctions (id, title, description, image, date, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [testIdInt, testDistinction.title, testDistinction.description, testDistinction.image, testDistinction.date]
          );
          console.log('✅ Insertion réussie!');
          await client.query('ROLLBACK'); // Annuler pour ne pas polluer la base
        } catch (insertError) {
          await client.query('ROLLBACK');
          console.log(`❌ Erreur d'insertion: ${insertError.message}`);
          if (insertError.message.includes('integer out of range')) {
            console.log('   → PROBLÈME CONFIRMÉ: ID trop grand pour INTEGER');
          }
        }
      }
    } catch (error) {
      console.log(`❌ Erreur: ${error.message}`);
    }
    console.log('');

    // 5. Recommandations
    console.log('💡 5. RECOMMANDATIONS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Si les IDs générés par Date.now() sont trop grands:');
    console.log('1. Modifier la table pour utiliser BIGINT au lieu de INTEGER');
    console.log('2. OU laisser PostgreSQL générer les IDs automatiquement (SERIAL)');
    console.log('3. OU utiliser un système d\'ID différent (UUID, etc.)');
    console.log('');

  } catch (error) {
    console.error('❌ Erreur lors du diagnostic:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

diagnose().catch((error) => {
  console.error('\n❌ Erreur:', error);
  process.exit(1);
});

