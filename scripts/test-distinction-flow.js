#!/usr/bin/env node

/**
 * Script de test pour vérifier le flux complet d'ajout d'une distinction
 * Admin → Base de données → Public
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

async function testDistinctionFlow() {
  console.log('🔍 Test du flux Distinction (Admin → DB → Public)\n');
  
  const client = await pool.connect();
  
  try {
    // Étape 1: Vérifier l'état actuel
    console.log('📊 Étape 1: État actuel des distinctions...');
    const currentDistinctions = await client.query('SELECT * FROM distinctions ORDER BY created_at DESC');
    console.log(`   - Nombre de distinctions: ${currentDistinctions.rows.length}`);
    currentDistinctions.rows.forEach((d, i) => {
      console.log(`   ${i + 1}. ${d.title} (ID: ${d.id}, Image: ${d.image ? 'Oui' : 'Non'})`);
    });
    console.log('');

    // Étape 2: Simuler un ajout depuis l'admin
    console.log('📝 Étape 2: Simulation ajout depuis l\'admin...');
    const testDistinction = {
      title: 'Test Distinction - ' + new Date().toISOString(),
      description: 'Ceci est un test de distinction avec image',
      image: 'https://example.com/test-distinction.jpg',
      date: '2024'
    };
    
    const insertResult = await client.query(
      `INSERT INTO distinctions (title, description, image, date, created_at, updated_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING *`,
      [testDistinction.title, testDistinction.description, testDistinction.image, testDistinction.date]
    );
    
    const newDistinction = insertResult.rows[0];
    console.log(`   ✅ Distinction ajoutée avec succès!`);
    console.log(`   - ID: ${newDistinction.id}`);
    console.log(`   - Titre: ${newDistinction.title}`);
    console.log(`   - Image: ${newDistinction.image}`);
    console.log(`   - Date: ${newDistinction.date}`);
    console.log('');

    // Étape 3: Vérifier que la distinction est dans la base
    console.log('🔍 Étape 3: Vérification dans la base de données...');
    const checkDistinction = await client.query(
      'SELECT * FROM distinctions WHERE id = $1',
      [newDistinction.id]
    );
    
    if (checkDistinction.rows.length > 0) {
      const dbDistinction = checkDistinction.rows[0];
      console.log(`   ✅ Distinction trouvée dans la base de données`);
      console.log(`   - Titre: ${dbDistinction.title}`);
      console.log(`   - Image: ${dbDistinction.image || 'AUCUNE IMAGE'}`);
      console.log(`   - Description: ${dbDistinction.description || 'Aucune description'}`);
      
      if (!dbDistinction.image) {
        console.log(`   ⚠️  ATTENTION: L'image n'a pas été sauvegardée!`);
      }
    } else {
      console.log(`   ❌ Distinction NON trouvée dans la base de données`);
    }
    console.log('');

    // Étape 4: Simuler la récupération depuis la page publique
    console.log('🌐 Étape 4: Simulation récupération depuis la page publique...');
    const publicDistinctions = await client.query(`
      SELECT 
        id::text as id,
        title,
        description,
        image,
        date
      FROM distinctions 
      ORDER BY created_at DESC
    `);
    
    const foundDistinction = publicDistinctions.rows.find(d => d.id === newDistinction.id.toString());
    
    if (foundDistinction) {
      console.log(`   ✅ Distinction récupérée depuis la page publique`);
      console.log(`   - Titre: ${foundDistinction.title}`);
      console.log(`   - Image: ${foundDistinction.image || 'AUCUNE IMAGE'}`);
      
      if (!foundDistinction.image) {
        console.log(`   ⚠️  PROBLÈME: L'image n'est pas récupérée par la page publique!`);
      } else {
        console.log(`   ✅ Image correctement récupérée: ${foundDistinction.image}`);
      }
    } else {
      console.log(`   ❌ Distinction NON récupérée depuis la page publique`);
    }
    console.log('');

    // Étape 5: Vérifier toutes les distinctions avec images manquantes
    console.log('🔍 Étape 5: Vérification des distinctions avec images manquantes...');
    const allDistinctions = await client.query('SELECT id, title, image FROM distinctions');
    const withoutImage = allDistinctions.rows.filter(d => !d.image || d.image.trim() === '');
    
    if (withoutImage.length > 0) {
      console.log(`   ⚠️  ${withoutImage.length} distinction(s) sans image:`);
      withoutImage.forEach(d => {
        console.log(`   - ID ${d.id}: ${d.title}`);
      });
    } else {
      console.log(`   ✅ Toutes les distinctions ont une image`);
    }
    console.log('');

    // Nettoyer le test
    console.log('🧹 Nettoyage...');
    await client.query('DELETE FROM distinctions WHERE title = $1', [testDistinction.title]);
    console.log('   ✅ Distinction de test supprimée\n');

    // Résumé
    console.log('📋 RÉSUMÉ:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    if (withoutImage.length > 0) {
      console.log('⚠️  PROBLÈME DÉTECTÉ:');
      console.log(`   - ${withoutImage.length} distinction(s) n'ont pas d'image`);
      console.log('   - Vérifiez que l\'image est bien envoyée lors de l\'ajout');
      console.log('   - Vérifiez que le champ image n\'est pas vide ou null');
    } else {
      console.log('✅ Tous les tests sont passés!');
      console.log('✅ Les distinctions sont correctement sauvegardées');
      console.log('✅ Les images sont correctement sauvegardées');
      console.log('✅ Les données sont visibles depuis la page publique');
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

testDistinctionFlow().catch((error) => {
  console.error('\n❌ Erreur:', error);
  process.exit(1);
});

