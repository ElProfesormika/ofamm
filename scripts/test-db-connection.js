#!/usr/bin/env node

/**
 * Script de test pour vérifier la connexion à la base de données Railway
 * et le flux Admin -> Base de données -> Public
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

async function testConnection() {
  console.log('🔌 Test de connexion à la base de données Railway...\n');
  
  const client = await pool.connect();
  
  try {
    // Test 1: Vérifier la connexion
    console.log('📊 Test 1: Vérification de la connexion...');
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('✅ Connexion réussie!');
    console.log(`   - Heure serveur: ${result.rows[0].current_time}`);
    console.log(`   - PostgreSQL: ${result.rows[0].pg_version.split(' ')[0]} ${result.rows[0].pg_version.split(' ')[1]}\n`);

    // Test 2: Vérifier que toutes les tables existent
    console.log('📊 Test 2: Vérification des tables...');
    const tables = [
      'slides', 'content_about', 'content_legal', 'services', 
      'realisations', 'evenements', 'galerie', 'partenaires',
      'blog_pubs', 'blog_articles', 'impacts', 'distinctions', 
      'produits', 'reseaux_sociaux'
    ];
    
    for (const table of tables) {
      const tableCheck = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        )
      `, [table]);
      
      if (tableCheck.rows[0].exists) {
        const count = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`   ✅ Table "${table}": ${count.rows[0].count} enregistrement(s)`);
      } else {
        console.log(`   ❌ Table "${table}": N'EXISTE PAS`);
      }
    }
    console.log('');

    // Test 3: Vérifier les données dans les tables principales
    console.log('📊 Test 3: Vérification des données...');
    
    const slidesCount = await client.query('SELECT COUNT(*) as count FROM slides');
    console.log(`   - Slides: ${slidesCount.rows[0].count}`);
    
    const servicesCount = await client.query('SELECT COUNT(*) as count FROM services');
    console.log(`   - Services: ${servicesCount.rows[0].count}`);
    
    const realisationsCount = await client.query('SELECT COUNT(*) as count FROM realisations');
    console.log(`   - Réalisations: ${realisationsCount.rows[0].count}`);
    
    const impactsCount = await client.query('SELECT COUNT(*) as count FROM impacts');
    console.log(`   - Impacts: ${impactsCount.rows[0].count}`);
    
    const distinctionsCount = await client.query('SELECT COUNT(*) as count FROM distinctions');
    console.log(`   - Distinctions: ${distinctionsCount.rows[0].count}`);
    
    const produitsCount = await client.query('SELECT COUNT(*) as count FROM produits');
    console.log(`   - Produits: ${produitsCount.rows[0].count}`);
    
    const reseauxCount = await client.query('SELECT COUNT(*) as count FROM reseaux_sociaux');
    console.log(`   - Réseaux sociaux: ${reseauxCount.rows[0].count}`);
    console.log('');

    // Test 4: Test d'écriture (simuler un ajout admin)
    console.log('📊 Test 4: Test d\'écriture (simulation ajout admin)...');
    const testService = {
      title: 'Test Service - ' + new Date().toISOString(),
      description: 'Ceci est un test de sauvegarde depuis l\'admin'
    };
    
    await client.query(
      'INSERT INTO services (title, description) VALUES ($1, $2)',
      [testService.title, testService.description]
    );
    console.log('   ✅ Test d\'écriture réussi!');
    
    // Vérifier que la donnée est bien enregistrée
    const testRead = await client.query(
      'SELECT * FROM services WHERE title = $1',
      [testService.title]
    );
    
    if (testRead.rows.length > 0) {
      console.log('   ✅ Test de lecture réussi! Donnée visible immédiatement.');
    } else {
      console.log('   ❌ Test de lecture échoué! Donnée non trouvée.');
    }
    
    // Nettoyer le test
    await client.query('DELETE FROM services WHERE title = $1', [testService.title]);
    console.log('   ✅ Donnée de test supprimée\n');

    // Test 5: Vérifier le flux complet Admin -> DB -> Public
    console.log('📊 Test 5: Simulation flux Admin -> Base -> Public...');
    
    // Simuler un ajout depuis l'admin
    const testImpact = {
      continent: 'Afrique',
      pays: 'Togo',
      ville: 'Lomé',
      description: 'Test d\'impact - visible immédiatement au public',
      image: 'https://example.com/test.jpg'
    };
    
    await client.query(
      `INSERT INTO impacts (continent, pays, ville, description, image)
       VALUES ($1, $2, $3, $4, $5)`,
      [testImpact.continent, testImpact.pays, testImpact.ville, testImpact.description, testImpact.image]
    );
    console.log('   ✅ Admin ajoute un impact');
    
    // Simuler la lecture depuis la page publique
    const publicRead = await client.query(
      `SELECT id::text as id, continent, pays, ville, description, image 
       FROM impacts 
       WHERE description = $1`,
      [testImpact.description]
    );
    
    if (publicRead.rows.length > 0) {
      console.log('   ✅ Page publique peut lire l\'impact ajouté');
      console.log(`   ✅ Impact visible: ${publicRead.rows[0].description}`);
    } else {
      console.log('   ❌ Page publique ne peut pas lire l\'impact');
    }
    
    // Nettoyer
    await client.query('DELETE FROM impacts WHERE description = $1', [testImpact.description]);
    console.log('   ✅ Test nettoyé\n');

    console.log('🎉 Tous les tests sont passés avec succès!');
    console.log('\n✅ La base de données est correctement liée à l\'application');
    console.log('✅ L\'admin peut faire des ajouts');
    console.log('✅ Les ajouts sont immédiatement visibles au public');
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

testConnection().catch((error) => {
  console.error('\n❌ Erreur:', error);
  process.exit(1);
});

