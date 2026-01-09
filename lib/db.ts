// Database configuration for PostgreSQL
// This will be used when deploying to Railway with PostgreSQL

import { Pool } from "pg";

// Database connection pool
let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const connectionConfig: any = {
      connectionString: process.env.DATABASE_URL,
    };
    
    // Configuration SSL pour Railway (Railway utilise SSL par défaut)
    if (process.env.NODE_ENV === "production" || process.env.DATABASE_URL?.includes("railway")) {
      connectionConfig.ssl = {
        rejectUnauthorized: false,
      };
    }
    
    pool = new Pool(connectionConfig);
  }
  return pool;
}

// Initialize database tables
export async function initDatabase() {
  const db = getPool();
  
  try {
    // Create slides table
    await db.query(`
      CREATE TABLE IF NOT EXISTS slides (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image TEXT,
        cta_text VARCHAR(100),
        cta_link VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create content table for about section
    await db.query(`
      CREATE TABLE IF NOT EXISTS content_about (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create legal content table
    await db.query(`
      CREATE TABLE IF NOT EXISTS content_legal (
        id SERIAL PRIMARY KEY,
        cgu TEXT,
        privacy TEXT,
        mentions TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create services table
    await db.query(`
      CREATE TABLE IF NOT EXISTS services (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create realisations table
    await db.query(`
      CREATE TABLE IF NOT EXISTS realisations (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image TEXT,
        date VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create evenements table
    await db.query(`
      CREATE TABLE IF NOT EXISTS evenements (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image TEXT,
        date VARCHAR(100),
        location VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create galerie table
    await db.query(`
      CREATE TABLE IF NOT EXISTS galerie (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(255),
        image VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create partenaires table
    await db.query(`
      CREATE TABLE IF NOT EXISTS partenaires (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        logo VARCHAR(500),
        website VARCHAR(500),
        type VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Add type column if it doesn't exist (for existing databases)
    await db.query(`
      ALTER TABLE partenaires 
      ADD COLUMN IF NOT EXISTS type VARCHAR(100)
    `);

    // Create blog_pubs table
    await db.query(`
      CREATE TABLE IF NOT EXISTS blog_pubs (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image TEXT,
        date VARCHAR(100),
        link VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create blog_articles table
    await db.query(`
      CREATE TABLE IF NOT EXISTS blog_articles (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        excerpt TEXT,
        content TEXT,
        image TEXT,
        date VARCHAR(100),
        author VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create impacts table
    await db.query(`
      CREATE TABLE IF NOT EXISTS impacts (
        id BIGSERIAL PRIMARY KEY,
        continent VARCHAR(255),
        pays VARCHAR(255),
        ville VARCHAR(255),
        description TEXT,
        image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create distinctions table
    await db.query(`
      CREATE TABLE IF NOT EXISTS distinctions (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image TEXT,
        date VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create produits table
    await db.query(`
      CREATE TABLE IF NOT EXISTS produits (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image TEXT,
        prix VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create reseaux_sociaux table
    await db.query(`
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

    console.log("Database tables initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

// Helper function to check if we should use database
export function shouldUseDatabase(): boolean {
  return !!process.env.DATABASE_URL && process.env.USE_DATABASE === "true";
}

