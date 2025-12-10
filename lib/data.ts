import fs from "fs";
import path from "path";
// import { shouldUseDatabase, getPool, initDatabase } from "./db";

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
  // TODO: Switch to database when USE_DATABASE=true
  // Uncomment when ready to use PostgreSQL:
  // if (shouldUseDatabase()) {
  //   const db = getPool();
  //   const result = await db.query("SELECT * FROM slides ORDER BY created_at DESC");
  //   return result.rows;
  // }
  return readJsonFile(slidesFile, defaultSlides);
}

export async function getContent() {
  // TODO: Switch to database when USE_DATABASE=true
  // Uncomment when ready to use PostgreSQL:
  // if (shouldUseDatabase()) {
  //   const db = getPool();
  //   const [about, services, realisations, evenements, galerie] = await Promise.all([
  //     db.query("SELECT * FROM content_about ORDER BY id DESC LIMIT 1"),
  //     db.query("SELECT * FROM services ORDER BY created_at DESC"),
  //     db.query("SELECT * FROM realisations ORDER BY created_at DESC"),
  //     db.query("SELECT * FROM evenements ORDER BY created_at DESC"),
  //     db.query("SELECT * FROM galerie ORDER BY created_at DESC"),
  //   ]);
  //   return {
  //     about: about.rows[0] || defaultContent.about,
  //     services: services.rows,
  //     realisations: realisations.rows,
  //     evenements: evenements.rows,
  //     galerie: galerie.rows,
  //   };
  // }
  return readJsonFile(contentFile, defaultContent);
}

export async function saveSlides(slides: any[]) {
  // TODO: Switch to database when USE_DATABASE=true
  // Uncomment when ready to use PostgreSQL:
  // if (shouldUseDatabase()) {
  //   const db = getPool();
  //   // Implementation for database save
  //   return true;
  // }
  return writeJsonFile(slidesFile, slides);
}

export async function saveContent(content: any) {
  // TODO: Switch to database when USE_DATABASE=true
  // Uncomment when ready to use PostgreSQL:
  // if (shouldUseDatabase()) {
  //   const db = getPool();
  //   // Implementation for database save
  //   return true;
  // }
  return writeJsonFile(contentFile, content);
}

// Initialize database on first import (only if DATABASE_URL is set)
// Uncomment when ready to use PostgreSQL:
// if (shouldUseDatabase()) {
//   initDatabase().catch(console.error);
// }

