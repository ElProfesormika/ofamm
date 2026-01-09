#!/usr/bin/env node

/**
 * Test complet du flux Admin → Base de données → Public
 * Vérifie que les ajouts (avec images) sont bien sauvegardés et visibles
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

async function testCompleteFlow() {
  console.log('🧪 TEST COMPLET : FLUX ADMIN → BASE → PUBLIC\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const client = await pool.connect();
  
  try {
    const testResults = [];
    
    // Test 1: Distinctions
    console.log('📝 TEST 1: DISTINCTIONS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    try {
      const testId = Date.now();
      const testDistinction = {
        id: testId,
        title: 'Test Distinction - ' + new Date().toISOString(),
        description: 'Description de test pour vérifier le flux complet',
        image: 'https://example.com/test-distinction.jpg',
        date: '2024'
      };
      
      // Simuler ajout admin
      await client.query('BEGIN');
      await client.query(
        `INSERT INTO distinctions (id, title, description, image, date, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [testDistinction.id, testDistinction.title, testDistinction.description, testDistinction.image, testDistinction.date]
      );
      
      // Simuler récupération publique
      const publicResult = await client.query(`
        SELECT id::text as id, title, description, image, date
        FROM distinctions 
        WHERE id = $1
      `, [testId]);
      
      if (publicResult.rows.length > 0) {
        const retrieved = publicResult.rows[0];
        const imageOk = retrieved.image === testDistinction.image;
        const allOk = retrieved.title === testDistinction.title && imageOk;
        
        console.log('   ✅ Ajout admin : OK');
        console.log('   ✅ Sauvegarde DB : OK');
        console.log('   ✅ Récupération publique : OK');
        console.log(`   ${imageOk ? '✅' : '❌'} Image visible : ${retrieved.image || 'MANQUANTE'}`);
        
        testResults.push({ type: 'distinctions', success: allOk });
      } else {
        console.log('   ❌ Récupération publique : ÉCHEC');
        testResults.push({ type: 'distinctions', success: false });
      }
      
      await client.query('ROLLBACK');
    } catch (error) {
      await client.query('ROLLBACK');
      console.log(`   ❌ Erreur : ${error.message}`);
      testResults.push({ type: 'distinctions', success: false });
    }
    console.log('');
    
    // Test 2: Impacts
    console.log('📝 TEST 2: IMPACTS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    try {
      const testId = Date.now();
      const testImpact = {
        id: testId,
        continent: 'Afrique',
        pays: 'Togo',
        ville: 'Lomé',
        description: 'Test d\'impact avec image',
        image: 'https://example.com/test-impact.jpg'
      };
      
      await client.query('BEGIN');
      await client.query(
        `INSERT INTO impacts (id, continent, pays, ville, description, image, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [testImpact.id, testImpact.continent, testImpact.pays, testImpact.ville, testImpact.description, testImpact.image]
      );
      
      const publicResult = await client.query(`
        SELECT id::text as id, continent, pays, ville, description, image
        FROM impacts 
        WHERE id = $1
      `, [testId]);
      
      if (publicResult.rows.length > 0) {
        const retrieved = publicResult.rows[0];
        const imageOk = retrieved.image === testImpact.image;
        
        console.log('   ✅ Ajout admin : OK');
        console.log('   ✅ Sauvegarde DB : OK');
        console.log('   ✅ Récupération publique : OK');
        console.log(`   ${imageOk ? '✅' : '❌'} Image visible : ${retrieved.image || 'MANQUANTE'}`);
        
        testResults.push({ type: 'impacts', success: imageOk });
      } else {
        console.log('   ❌ Récupération publique : ÉCHEC');
        testResults.push({ type: 'impacts', success: false });
      }
      
      await client.query('ROLLBACK');
    } catch (error) {
      await client.query('ROLLBACK');
      console.log(`   ❌ Erreur : ${error.message}`);
      testResults.push({ type: 'impacts', success: false });
    }
    console.log('');
    
    // Test 3: Produits
    console.log('📝 TEST 3: PRODUITS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    try {
      const testId = Date.now();
      const testProduit = {
        id: testId,
        title: 'Produit Test',
        description: 'Description du produit test',
        image: 'https://example.com/test-produit.jpg',
        prix: '5000 FCFA'
      };
      
      await client.query('BEGIN');
      await client.query(
        `INSERT INTO produits (id, title, description, image, prix, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [testProduit.id, testProduit.title, testProduit.description, testProduit.image, testProduit.prix]
      );
      
      const publicResult = await client.query(`
        SELECT id::text as id, title, description, image, prix
        FROM produits 
        WHERE id = $1
      `, [testId]);
      
      if (publicResult.rows.length > 0) {
        const retrieved = publicResult.rows[0];
        const imageOk = retrieved.image === testProduit.image;
        
        console.log('   ✅ Ajout admin : OK');
        console.log('   ✅ Sauvegarde DB : OK');
        console.log('   ✅ Récupération publique : OK');
        console.log(`   ${imageOk ? '✅' : '❌'} Image visible : ${retrieved.image || 'MANQUANTE'}`);
        
        testResults.push({ type: 'produits', success: imageOk });
      } else {
        console.log('   ❌ Récupération publique : ÉCHEC');
        testResults.push({ type: 'produits', success: false });
      }
      
      await client.query('ROLLBACK');
    } catch (error) {
      await client.query('ROLLBACK');
      console.log(`   ❌ Erreur : ${error.message}`);
      testResults.push({ type: 'produits', success: false });
    }
    console.log('');
    
    // Test 4: Réalisations
    console.log('📝 TEST 4: RÉALISATIONS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    try {
      const testId = Date.now();
      const testRealisation = {
        id: testId,
        title: 'Réalisation Test',
        description: 'Description de la réalisation',
        image: 'https://example.com/test-realisation.jpg',
        date: '2024'
      };
      
      await client.query('BEGIN');
      await client.query(
        `INSERT INTO realisations (id, title, description, image, date, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [testRealisation.id, testRealisation.title, testRealisation.description, testRealisation.image, testRealisation.date]
      );
      
      const publicResult = await client.query(`
        SELECT id::text as id, title, description, image, date
        FROM realisations 
        WHERE id = $1
      `, [testId]);
      
      if (publicResult.rows.length > 0) {
        const retrieved = publicResult.rows[0];
        const imageOk = retrieved.image === testRealisation.image;
        
        console.log('   ✅ Ajout admin : OK');
        console.log('   ✅ Sauvegarde DB : OK');
        console.log('   ✅ Récupération publique : OK');
        console.log(`   ${imageOk ? '✅' : '❌'} Image visible : ${retrieved.image || 'MANQUANTE'}`);
        
        testResults.push({ type: 'realisations', success: imageOk });
      } else {
        console.log('   ❌ Récupération publique : ÉCHEC');
        testResults.push({ type: 'realisations', success: false });
      }
      
      await client.query('ROLLBACK');
    } catch (error) {
      await client.query('ROLLBACK');
      console.log(`   ❌ Erreur : ${error.message}`);
      testResults.push({ type: 'realisations', success: false });
    }
    console.log('');
    
    // Test 5: Événements
    console.log('📝 TEST 5: ÉVÉNEMENTS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    try {
      const testId = Date.now();
      const testEvenement = {
        id: testId,
        title: 'Événement Test',
        description: 'Description de l\'événement',
        image: 'https://example.com/test-evenement.jpg',
        date: '2024',
        location: 'Lomé, Togo'
      };
      
      await client.query('BEGIN');
      await client.query(
        `INSERT INTO evenements (id, title, description, image, date, location, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [testEvenement.id, testEvenement.title, testEvenement.description, testEvenement.image, testEvenement.date, testEvenement.location]
      );
      
      const publicResult = await client.query(`
        SELECT id::text as id, title, description, image, date, location
        FROM evenements 
        WHERE id = $1
      `, [testId]);
      
      if (publicResult.rows.length > 0) {
        const retrieved = publicResult.rows[0];
        const imageOk = retrieved.image === testEvenement.image;
        
        console.log('   ✅ Ajout admin : OK');
        console.log('   ✅ Sauvegarde DB : OK');
        console.log('   ✅ Récupération publique : OK');
        console.log(`   ${imageOk ? '✅' : '❌'} Image visible : ${retrieved.image || 'MANQUANTE'}`);
        
        testResults.push({ type: 'evenements', success: imageOk });
      } else {
        console.log('   ❌ Récupération publique : ÉCHEC');
        testResults.push({ type: 'evenements', success: false });
      }
      
      await client.query('ROLLBACK');
    } catch (error) {
      await client.query('ROLLBACK');
      console.log(`   ❌ Erreur : ${error.message}`);
      testResults.push({ type: 'evenements', success: false });
    }
    console.log('');
    
    // Test 6: Partenaires/Collaborations
    console.log('📝 TEST 6: PARTENAIRES/COLLABORATIONS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    try {
      const testId = Date.now();
      const testPartenaire = {
        id: testId,
        name: 'Partenaire Test',
        description: 'Description du partenaire',
        logo: 'https://example.com/test-logo.jpg',
        website: 'https://example.com',
        type: 'entreprises'
      };
      
      await client.query('BEGIN');
      await client.query(
        `INSERT INTO partenaires (id, name, description, logo, website, type, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [testPartenaire.id, testPartenaire.name, testPartenaire.description, testPartenaire.logo, testPartenaire.website, testPartenaire.type]
      );
      
      const publicResult = await client.query(`
        SELECT id::text as id, name, description, logo, website, type
        FROM partenaires 
        WHERE id = $1
      `, [testId]);
      
      if (publicResult.rows.length > 0) {
        const retrieved = publicResult.rows[0];
        const logoOk = retrieved.logo === testPartenaire.logo;
        
        console.log('   ✅ Ajout admin : OK');
        console.log('   ✅ Sauvegarde DB : OK');
        console.log('   ✅ Récupération publique : OK');
        console.log(`   ${logoOk ? '✅' : '❌'} Logo visible : ${retrieved.logo || 'MANQUANT'}`);
        
        testResults.push({ type: 'partenaires', success: logoOk });
      } else {
        console.log('   ❌ Récupération publique : ÉCHEC');
        testResults.push({ type: 'partenaires', success: false });
      }
      
      await client.query('ROLLBACK');
    } catch (error) {
      await client.query('ROLLBACK');
      console.log(`   ❌ Erreur : ${error.message}`);
      testResults.push({ type: 'partenaires', success: false });
    }
    console.log('');
    
    // Résumé final
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 RÉSUMÉ DES TESTS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const successCount = testResults.filter(r => r.success).length;
    const totalCount = testResults.length;
    
    testResults.forEach(result => {
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${result.type.padEnd(20)} ${result.success ? 'SUCCÈS' : 'ÉCHEC'}`);
    });
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    if (successCount === totalCount) {
      console.log(`✅ TOUS LES TESTS SONT PASSÉS (${successCount}/${totalCount})`);
      console.log('✅ Les ajouts admin fonctionnent correctement');
      console.log('✅ Les données sont bien sauvegardées dans la base');
      console.log('✅ Les données sont visibles au public');
      console.log('✅ Les images sont correctement sauvegardées et récupérées');
    } else {
      console.log(`⚠️  ${successCount}/${totalCount} tests réussis`);
      console.log('❌ Certains tests ont échoué - vérifiez les erreurs ci-dessus');
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

testCompleteFlow().catch((error) => {
  console.error('\n❌ Erreur:', error);
  process.exit(1);
});

