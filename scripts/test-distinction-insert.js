#!/usr/bin/env node

const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_PUBLIC_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ Erreur: DATABASE_URL ou DATABASE_PUBLIC_URL doit être défini');
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false }
});

async function test() {
  const client = await pool.connect();
  try {
    const testId = Date.now();
    const testDistinction = {
      title: 'Test Distinction - ' + new Date().toISOString(),
      description: 'Test après correction',
      image: 'https://example.com/test.jpg',
      date: '2024'
    };
    
    console.log('🧪 Test d\'insertion avec ID:', testId);
    
    await client.query('BEGIN');
    try {
      await client.query(
        `INSERT INTO distinctions (id, title, description, image, date, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [testId, testDistinction.title, testDistinction.description, testDistinction.image, testDistinction.date]
      );
      console.log('✅ Insertion réussie!');
      
      const result = await client.query('SELECT * FROM distinctions WHERE id = $1', [testId]);
      if (result.rows.length > 0) {
        console.log('✅ Récupération réussie!');
        console.log('   Titre:', result.rows[0].title);
        console.log('   Image:', result.rows[0].image);
      }
      
      await client.query('ROLLBACK');
      console.log('✅ Test terminé avec succès!');
    } catch (error) {
      await client.query('ROLLBACK');
      console.log('❌ Erreur:', error.message);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

test();

