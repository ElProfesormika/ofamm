#!/usr/bin/env node

/**
 * Script pour initialiser la base de données Railway
 * Usage: node scripts/init-railway-db.js
 * 
 * Variables d'environnement requises:
 * - DATABASE_URL ou DATABASE_PUBLIC_URL
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Récupérer l'URL de la base de données
const databaseUrl = process.env.DATABASE_PUBLIC_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ Erreur: DATABASE_URL ou DATABASE_PUBLIC_URL doit être défini');
  process.exit(1);
}

console.log('🔌 Connexion à la base de données Railway...');

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function initDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('📊 Création des tables...');
    
    // Create slides table
    await client.query(`
      CREATE TABLE IF NOT EXISTS slides (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image VARCHAR(500),
        cta_text VARCHAR(100),
        cta_link VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table slides créée');

    // Create content_about table
    await client.query(`
      CREATE TABLE IF NOT EXISTS content_about (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table content_about créée');

    // Create content_legal table
    await client.query(`
      CREATE TABLE IF NOT EXISTS content_legal (
        id SERIAL PRIMARY KEY,
        cgu TEXT,
        privacy TEXT,
        mentions TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table content_legal créée');

    // Create services table
    await client.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table services créée');

    // Create realisations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS realisations (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image VARCHAR(500),
        date VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table realisations créée');

    // Create evenements table
    await client.query(`
      CREATE TABLE IF NOT EXISTS evenements (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image VARCHAR(500),
        date VARCHAR(100),
        location VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table evenements créée');

    // Create galerie table
    await client.query(`
      CREATE TABLE IF NOT EXISTS galerie (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        image VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table galerie créée');

    // Create partenaires table
    await client.query(`
      CREATE TABLE IF NOT EXISTS partenaires (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        logo VARCHAR(500),
        website VARCHAR(500),
        type VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table partenaires créée');

    // Add type column if it doesn't exist
    await client.query(`
      ALTER TABLE partenaires 
      ADD COLUMN IF NOT EXISTS type VARCHAR(100)
    `);

    // Create blog_pubs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS blog_pubs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image VARCHAR(500),
        date VARCHAR(100),
        link VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table blog_pubs créée');

    // Create blog_articles table
    await client.query(`
      CREATE TABLE IF NOT EXISTS blog_articles (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        excerpt TEXT,
        content TEXT,
        image VARCHAR(500),
        date VARCHAR(100),
        author VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table blog_articles créée');

    // Create impacts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS impacts (
        id SERIAL PRIMARY KEY,
        continent VARCHAR(255),
        pays VARCHAR(255),
        ville VARCHAR(255),
        description TEXT,
        image VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table impacts créée');

    // Create distinctions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS distinctions (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image VARCHAR(500),
        date VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table distinctions créée');

    // Create produits table
    await client.query(`
      CREATE TABLE IF NOT EXISTS produits (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image VARCHAR(500),
        prix VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table produits créée');

    // Create reseaux_sociaux table
    await client.query(`
      CREATE TABLE IF NOT EXISTS reseaux_sociaux (
        id SERIAL PRIMARY KEY,
        facebook VARCHAR(500),
        twitter VARCHAR(500),
        instagram VARCHAR(500),
        linkedin VARCHAR(500),
        youtube VARCHAR(500),
        tiktok VARCHAR(500),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table reseaux_sociaux créée');

    console.log('\n🎉 Toutes les tables ont été créées avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création des tables:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function importLocalData() {
  const client = await pool.connect();
  const dataDir = path.join(process.cwd(), 'data');
  
  try {
    console.log('\n📥 Importation des données locales...');
    
    // Import slides
    const slidesFile = path.join(dataDir, 'slides.json');
    if (fs.existsSync(slidesFile)) {
      const slides = JSON.parse(fs.readFileSync(slidesFile, 'utf-8'));
      if (Array.isArray(slides) && slides.length > 0) {
        for (const slide of slides) {
          await client.query(`
            INSERT INTO slides (title, description, image, cta_text, cta_link)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT DO NOTHING
          `, [slide.title, slide.description, slide.image, slide.ctaText, slide.ctaLink]);
        }
        console.log(`✅ ${slides.length} slides importés`);
      }
    }

    // Import content
    const contentFile = path.join(dataDir, 'content.json');
    if (fs.existsSync(contentFile)) {
      const content = JSON.parse(fs.readFileSync(contentFile, 'utf-8'));
      
      // Import about
      if (content.about) {
        await client.query(`
          INSERT INTO content_about (title, content)
          VALUES ($1, $2)
          ON CONFLICT (id) DO UPDATE SET title = $1, content = $2
        `, [content.about.title, content.about.content]);
        console.log('✅ Contenu "À propos" importé');
      }

      // Import legal
      if (content.legal) {
        await client.query(`
          INSERT INTO content_legal (cgu, privacy, mentions)
          VALUES ($1, $2, $3)
          ON CONFLICT (id) DO UPDATE SET cgu = $1, privacy = $2, mentions = $3
        `, [content.legal.cgu, content.legal.privacy, content.legal.mentions]);
        console.log('✅ Contenu légal importé');
      }

      // Import services
      if (Array.isArray(content.services) && content.services.length > 0) {
        for (const service of content.services) {
          await client.query(`
            INSERT INTO services (title, description)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
          `, [service.title, service.description]);
        }
        console.log(`✅ ${content.services.length} services importés`);
      }

      // Import realisations
      if (Array.isArray(content.realisations) && content.realisations.length > 0) {
        for (const realisation of content.realisations) {
          await client.query(`
            INSERT INTO realisations (title, description, image, date)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT DO NOTHING
          `, [realisation.title, realisation.description, realisation.image, realisation.date]);
        }
        console.log(`✅ ${content.realisations.length} réalisations importées`);
      }

      // Import evenements
      if (Array.isArray(content.evenements) && content.evenements.length > 0) {
        for (const evenement of content.evenements) {
          await client.query(`
            INSERT INTO evenements (title, description, image, date, location)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT DO NOTHING
          `, [evenement.title, evenement.description, evenement.image, evenement.date, evenement.location]);
        }
        console.log(`✅ ${content.evenements.length} événements importés`);
      }

      // Import partenaires
      if (Array.isArray(content.partenaires) && content.partenaires.length > 0) {
        for (const partenaire of content.partenaires) {
          await client.query(`
            INSERT INTO partenaires (name, description, logo, website, type)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT DO NOTHING
          `, [partenaire.name, partenaire.description, partenaire.logo, partenaire.website, partenaire.type]);
        }
        console.log(`✅ ${content.partenaires.length} partenaires importés`);
      }

      // Import impacts
      if (Array.isArray(content.impacts) && content.impacts.length > 0) {
        for (const impact of content.impacts) {
          await client.query(`
            INSERT INTO impacts (continent, pays, ville, description, image)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT DO NOTHING
          `, [impact.continent, impact.pays, impact.ville, impact.description, impact.image]);
        }
        console.log(`✅ ${content.impacts.length} impacts importés`);
      }

      // Import distinctions
      if (Array.isArray(content.distinctions) && content.distinctions.length > 0) {
        for (const distinction of content.distinctions) {
          await client.query(`
            INSERT INTO distinctions (title, description, image, date)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT DO NOTHING
          `, [distinction.title, distinction.description, distinction.image, distinction.date]);
        }
        console.log(`✅ ${content.distinctions.length} distinctions importées`);
      }

      // Import produits
      if (Array.isArray(content.produits) && content.produits.length > 0) {
        for (const produit of content.produits) {
          await client.query(`
            INSERT INTO produits (title, description, image, prix)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT DO NOTHING
          `, [produit.title, produit.description, produit.image, produit.prix]);
        }
        console.log(`✅ ${content.produits.length} produits importés`);
      }

      // Import reseaux sociaux
      if (content.reseauxSociaux && Object.keys(content.reseauxSociaux).length > 0) {
        await client.query(`
          INSERT INTO reseaux_sociaux (facebook, twitter, instagram, linkedin, youtube, tiktok)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (id) DO UPDATE SET 
            facebook = $1, twitter = $2, instagram = $3, 
            linkedin = $4, youtube = $5, tiktok = $6
        `, [
          content.reseauxSociaux.facebook || null,
          content.reseauxSociaux.twitter || null,
          content.reseauxSociaux.instagram || null,
          content.reseauxSociaux.linkedin || null,
          content.reseauxSociaux.youtube || null,
          content.reseauxSociaux.tiktok || null,
        ]);
        console.log('✅ Réseaux sociaux importés');
      }
    }

    console.log('\n🎉 Importation des données terminée!');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'importation:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function main() {
  try {
    await initDatabase();
    await importLocalData();
    console.log('\n✅ Base de données Railway initialisée avec succès!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erreur:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();

