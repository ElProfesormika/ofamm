import fs from "fs";
import path from "path";
import { shouldUseDatabase, getPool, initDatabase } from "./db";

const dataDir = path.join(process.cwd(), "data");

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const slidesFile = path.join(dataDir, "slides.json");
const contentFile = path.join(dataDir, "content.json");

// Initialize default data
const defaultSlides = [
  {
    id: "1",
    title: "Bienvenue chez O'FAMM",
    description: "Stratégie digitale et médiastratégie au Togo - Accompagnement dans votre transformation digitale",
    image: "https://picsum.photos/1920/1080?random=1",
    ctaText: "Découvrir nos services",
    ctaLink: "/services",
  },
  {
    id: "2",
    title: "Accompagnement Professionnel",
    description: "Formation et développement pour jeunes et femmes en marketing digital et stratégie digitale",
    image: "https://picsum.photos/1920/1080?random=2",
    ctaText: "En savoir plus",
    ctaLink: "/about",
  },
  {
    id: "3",
    title: "Women in Tech 2024",
    description: "Lauréate de Women in Tech 2024 - Excellence reconnue dans le domaine de la technologie et du digital",
    image: "https://picsum.photos/1920/1080?random=3",
    ctaText: "Voir nos réalisations",
    ctaLink: "/realisations",
  },
];

const defaultContent = {
  about: {
    title: "À propos d'O'FAMM",
    content: "O'FAMM, ou Obé Mawussé Fantodji, est une femme data commerciale et médiastratégiste au Togo, reconnue pour son expertise en stratégie digitale et en prospection. Elle est la fondatrice de O'FAMM, une organisation qui accompagne des jeunes et des femmes dans leur développement professionnel et leur autonomie grâce à des programmes de formation et de marketing digital. O'FAMM a également été lauréate de Women in Tech 2024 et a lancé plusieurs initiatives pour soutenir la jeune génération en Afrique.",
  },
  legal: {
    cgu: "Conditions Générales d'Utilisation à personnaliser.",
    privacy: "Politique de confidentialité à personnaliser.",
    mentions: "Mentions légales à personnaliser.",
  },
  services: [
    {
      id: "1",
      title: "Stratégie Digitale",
      description: "Accompagnement dans votre transformation digitale avec des stratégies sur mesure.",
    },
    {
      id: "2",
      title: "Médiastratégie",
      description: "Optimisation de votre présence médiatique et de votre communication.",
    },
    {
      id: "3",
      title: "Formation & Accompagnement",
      description: "Programmes de formation pour jeunes et femmes en marketing digital.",
    },
  ],
  realisations: [],
  evenements: [],
  galerie: [],
  partenaires: [],
  impacts: [],
  distinctions: [],
  produits: [],
  reseauxSociaux: {},
  blog: {
    pubs: [],
    articles: [],
  },
};

function readJsonFile(filePath: string, defaultValue: any) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content);
    }
    // Create file with default value
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
    return defaultValue;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return defaultValue;
  }
}

function writeJsonFile(filePath: string, data: any) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
}

export async function getSlides() {
  if (shouldUseDatabase()) {
    try {
      const db = getPool();
      const result = await db.query(`
        SELECT 
          id::text as id,
          title,
          description,
          image,
          cta_text as "ctaText",
          cta_link as "ctaLink"
        FROM slides 
        ORDER BY created_at DESC
      `);
      return result.rows;
    } catch (error) {
      console.error("Error fetching slides from database:", error);
      // Fallback to JSON if database fails
      return readJsonFile(slidesFile, defaultSlides);
    }
  }
  return readJsonFile(slidesFile, defaultSlides);
}

export async function getContent() {
  const useDb = shouldUseDatabase();
  console.log("getContent called - shouldUseDatabase():", useDb);
  console.log("USE_DATABASE:", process.env.USE_DATABASE);
  console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Configurée" : "Non configurée");
  
  if (useDb) {
    try {
      const db = getPool();
      console.log("Fetching content from database...");
      const [about, legal, services, realisations, evenements, galerie, partenaires, pubs, articles, impacts, distinctions, produits, reseauxSociaux] = await Promise.all([
        db.query("SELECT title, content FROM content_about ORDER BY id DESC LIMIT 1"),
        db.query("SELECT cgu, privacy, mentions FROM content_legal ORDER BY id DESC LIMIT 1"),
        db.query(`
          SELECT 
            id::text as id,
            title,
            description
          FROM services 
          ORDER BY created_at DESC
        `),
        db.query(`
          SELECT 
            id::text as id,
            title,
            description,
            image,
            date
          FROM realisations 
          ORDER BY created_at DESC
        `),
        db.query(`
          SELECT 
            id::text as id,
            title,
            description,
            image,
            date,
            location
          FROM evenements 
          ORDER BY created_at DESC
        `),
        db.query(`
          SELECT 
            id::text as id,
            title,
            image
          FROM galerie 
          ORDER BY created_at DESC
        `),
        db.query(`
          SELECT 
            id::text as id,
            name,
            description,
            logo,
            website,
            type
          FROM partenaires 
          ORDER BY created_at DESC
        `),
        db.query(`
          SELECT 
            id::text as id,
            title,
            description,
            image,
            date,
            link
          FROM blog_pubs 
          ORDER BY created_at DESC
        `),
        db.query(`
          SELECT 
            id::text as id,
            title,
            description,
            excerpt,
            content,
            image,
            date,
            author
          FROM blog_articles 
          ORDER BY created_at DESC
        `),
        db.query(`
          SELECT 
            id::text as id,
            continent,
            pays,
            ville,
            description,
            image
          FROM impacts 
          ORDER BY created_at DESC
        `),
        db.query(`
          SELECT 
            id::text as id,
            title,
            description,
            image,
            date
          FROM distinctions 
          ORDER BY created_at DESC
        `),
        db.query(`
          SELECT 
            id::text as id,
            title,
            description,
            image,
            prix
          FROM produits 
          ORDER BY created_at DESC
        `),
        db.query(`
          SELECT 
            facebook,
            twitter,
            instagram,
            linkedin,
            youtube,
            tiktok
          FROM reseaux_sociaux 
          ORDER BY id DESC LIMIT 1
        `),
      ]);
      
      return {
        about: about.rows[0] || defaultContent.about,
        legal: legal.rows[0] || defaultContent.legal,
        services: services.rows,
        realisations: realisations.rows,
        evenements: evenements.rows,
        galerie: galerie.rows,
        partenaires: partenaires.rows,
        impacts: impacts.rows,
        distinctions: distinctions.rows,
        produits: produits.rows,
        reseauxSociaux: reseauxSociaux.rows[0] || {},
        blog: {
          pubs: pubs.rows,
          articles: articles.rows,
        },
      };
      console.log("Content fetched from database successfully");
      console.log("Distinctions count:", distinctions.rows.length);
      console.log("Impacts count:", impacts.rows.length);
      console.log("Produits count:", produits.rows.length);
      return {
        about: about.rows[0] || defaultContent.about,
        legal: legal.rows[0] || defaultContent.legal,
        services: services.rows,
        realisations: realisations.rows,
        evenements: evenements.rows,
        galerie: galerie.rows,
        partenaires: partenaires.rows,
        impacts: impacts.rows,
        distinctions: distinctions.rows,
        produits: produits.rows,
        reseauxSociaux: reseauxSociaux.rows[0] || {},
        blog: {
          pubs: pubs.rows,
          articles: articles.rows,
        },
      };
    } catch (error) {
      console.error("Error fetching content from database:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      // Fallback to JSON if database fails
      console.log("Falling back to JSON file");
      return readJsonFile(contentFile, defaultContent);
    }
  }
  const data = readJsonFile(contentFile, defaultContent);
  return {
    ...defaultContent,
    ...data,
    legal: data.legal || defaultContent.legal,
    impacts: data.impacts || [],
    distinctions: data.distinctions || [],
    produits: data.produits || [],
    reseauxSociaux: data.reseauxSociaux || {},
  };
}

export async function saveSlides(slides: any[]) {
  if (shouldUseDatabase()) {
    try {
      const db = getPool();
      const client = await db.connect();
      
      try {
        await client.query("BEGIN");
        
        // Delete all existing slides
        await client.query("DELETE FROM slides");
        
        // Insert all slides
        for (const slide of slides) {
          const slideId = slide.id ? parseInt(slide.id) : null;
          await client.query(
            `INSERT INTO slides (id, title, description, image, cta_text, cta_link, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)`,
            [
              slideId,
              slide.title || "",
              slide.description || "",
              slide.image || null,
              slide.ctaText || null,
              slide.ctaLink || null,
            ]
          );
        }
        
        await client.query("COMMIT");
        return true;
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Error saving slides to database:", error);
      // Fallback to JSON if database fails
      return writeJsonFile(slidesFile, slides);
    }
  }
  return writeJsonFile(slidesFile, slides);
}

export async function saveContent(content: any) {
  console.log("saveContent called - shouldUseDatabase():", shouldUseDatabase());
  console.log("USE_DATABASE:", process.env.USE_DATABASE);
  console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Configurée" : "Non configurée");
  
  if (shouldUseDatabase()) {
    try {
      const db = getPool();
      console.log("Connecting to database...");
      const client = await db.connect();
      console.log("Database connected, starting transaction...");
      
      try {
        await client.query("BEGIN");
        console.log("Transaction BEGIN");
        
        // Save about section
        if (content.about) {
          await client.query("DELETE FROM content_about");
          await client.query(
            `INSERT INTO content_about (title, content, updated_at)
             VALUES ($1, $2, CURRENT_TIMESTAMP)`,
            [content.about.title, content.about.content]
          );
        }

        // Save legal section
        if (content.legal) {
          await client.query("DELETE FROM content_legal");
          await client.query(
            `INSERT INTO content_legal (cgu, privacy, mentions, updated_at)
             VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
            [
              content.legal.cgu || "",
              content.legal.privacy || "",
              content.legal.mentions || "",
            ]
          );
        }
        
        // Save services
        if (content.services) {
          await client.query("DELETE FROM services");
          for (const service of content.services) {
            const serviceId = service.id ? parseInt(service.id) : null;
            await client.query(
              `INSERT INTO services (id, title, description, updated_at)
               VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
              [
                serviceId,
                service.title || "",
                service.description || "",
              ]
            );
          }
        }
        
        // Save realisations
        if (content.realisations) {
          await client.query("DELETE FROM realisations");
          for (const realisation of content.realisations) {
            const realisationId = realisation.id ? parseInt(realisation.id) : null;
            await client.query(
              `INSERT INTO realisations (id, title, description, image, date, updated_at)
               VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
              [
                realisationId,
                realisation.title || "",
                realisation.description || "",
                realisation.image || null,
                realisation.date || null,
              ]
            );
          }
        }
        
        // Save evenements
        if (content.evenements) {
          await client.query("DELETE FROM evenements");
          for (const evenement of content.evenements) {
            const evenementId = evenement.id ? parseInt(evenement.id) : null;
            await client.query(
              `INSERT INTO evenements (id, title, description, image, date, location, updated_at)
               VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)`,
              [
                evenementId,
                evenement.title || "",
                evenement.description || "",
                evenement.image || null,
                evenement.date || null,
                evenement.location || null,
              ]
            );
          }
        }
        
        // Save galerie
        if (content.galerie) {
          await client.query("DELETE FROM galerie");
          for (const item of content.galerie) {
            const itemId = item.id ? parseInt(item.id) : null;
            await client.query(
              `INSERT INTO galerie (id, title, image, updated_at)
               VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
              [
                itemId,
                item.title || null,
                item.image || "",
              ]
            );
          }
        }
        
        // Save partenaires
        if (content.partenaires) {
          await client.query("DELETE FROM partenaires");
          for (const partenaire of content.partenaires) {
            const partenaireId = partenaire.id ? parseInt(partenaire.id) : null;
            await client.query(
              `INSERT INTO partenaires (id, name, description, logo, website, type, updated_at)
               VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)`,
              [
                partenaireId,
                partenaire.name || "",
                partenaire.description || null,
                partenaire.logo || null,
                partenaire.website || null,
                partenaire.type || null,
              ]
            );
          }
        }
        
        // Save blog pubs
        if (content.blog?.pubs) {
          await client.query("DELETE FROM blog_pubs");
          for (const pub of content.blog.pubs) {
            const pubId = pub.id ? parseInt(pub.id) : null;
            await client.query(
              `INSERT INTO blog_pubs (id, title, description, image, date, link, updated_at)
               VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)`,
              [
                pubId,
                pub.title || "",
                pub.description || "",
                pub.image || null,
                pub.date || null,
                pub.link || null,
              ]
            );
          }
        }
        
        // Save blog articles
        if (content.blog?.articles) {
          await client.query("DELETE FROM blog_articles");
          for (const article of content.blog.articles) {
            const articleId = article.id ? parseInt(article.id) : null;
            await client.query(
              `INSERT INTO blog_articles (id, title, description, excerpt, content, image, date, author, updated_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)`,
              [
                articleId,
                article.title || "",
                article.description || "",
                article.excerpt || null,
                article.content || null,
                article.image || null,
                article.date || null,
                article.author || null,
              ]
            );
          }
        }
        
        // Save impacts
        if (content.impacts) {
          await client.query("DELETE FROM impacts");
          for (const impact of content.impacts) {
            const impactId = impact.id ? parseInt(impact.id) : null;
            await client.query(
              `INSERT INTO impacts (id, continent, pays, ville, description, image, updated_at)
               VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)`,
              [
                impactId,
                impact.continent || null,
                impact.pays || null,
                impact.ville || null,
                impact.description || null,
                impact.image || null,
              ]
            );
          }
        }

        // Save distinctions
        if (content.distinctions) {
          console.log(`Saving ${content.distinctions.length} distinction(s)`);
          await client.query("DELETE FROM distinctions");
          console.log("DELETE FROM distinctions: OK");
          for (const distinction of content.distinctions) {
            const distinctionId = distinction.id ? parseInt(distinction.id) : null;
            console.log(`Inserting distinction: ${distinction.title} (ID: ${distinctionId}, Image: ${distinction.image || 'none'})`);
            await client.query(
              `INSERT INTO distinctions (id, title, description, image, date, updated_at)
               VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
              [
                distinctionId,
                distinction.title || "",
                distinction.description || null,
                distinction.image || null,
                distinction.date || null,
              ]
            );
            console.log(`Distinction inserted successfully: ${distinction.title}`);
          }
          console.log(`All ${content.distinctions.length} distinction(s) saved successfully`);
        } else {
          console.log("WARNING: content.distinctions is missing or empty - no distinctions will be saved");
        }

        // Save produits
        if (content.produits) {
          await client.query("DELETE FROM produits");
          for (const produit of content.produits) {
            const produitId = produit.id ? parseInt(produit.id) : null;
            await client.query(
              `INSERT INTO produits (id, title, description, image, prix, updated_at)
               VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
              [
                produitId,
                produit.title || "",
                produit.description || null,
                produit.image || null,
                produit.prix || null,
              ]
            );
          }
        }

        // Save reseaux sociaux
        if (content.reseauxSociaux) {
          await client.query("DELETE FROM reseaux_sociaux");
          await client.query(
            `INSERT INTO reseaux_sociaux (facebook, twitter, instagram, linkedin, youtube, tiktok, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)`,
            [
              content.reseauxSociaux.facebook || null,
              content.reseauxSociaux.twitter || null,
              content.reseauxSociaux.instagram || null,
              content.reseauxSociaux.linkedin || null,
              content.reseauxSociaux.youtube || null,
              content.reseauxSociaux.tiktok || null,
            ]
          );
        }
        
        await client.query("COMMIT");
        console.log("Transaction COMMIT successful");
        console.log("saveContent: All data saved to database successfully");
        return true;
      } catch (error) {
        await client.query("ROLLBACK");
        console.error("Transaction error in saveContent:", error);
        console.error("Error details:", {
          message: error instanceof Error ? error.message : String(error),
          code: (error as any)?.code,
          stack: error instanceof Error ? error.stack : undefined,
        });
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Error saving content to database:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      // En production, ne pas faire de fallback silencieux - remonter l'erreur
      if (process.env.NODE_ENV === "production") {
        throw error;
      }
      // En développement, fallback vers JSON
      console.warn("Falling back to JSON file (development mode)");
      return writeJsonFile(contentFile, content);
    }
  }
  console.log("saveContent: Using JSON file (shouldUseDatabase() returned false)");
  return writeJsonFile(contentFile, content);
}

// Initialize database on first import (only if DATABASE_URL is set)
if (shouldUseDatabase()) {
  initDatabase().catch(console.error);
}

