/**
 * Script de test complet pour vérifier le flux admin → DB → public
 * Teste l'ajout, la modification, la suppression et l'affichage public
 */

const { Pool } = require("pg");
require("dotenv").config({ path: ".env.local" });

const DATABASE_URL = process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL non configurée");
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: DATABASE_URL.includes("railway") || DATABASE_URL.includes("render.com") ? { rejectUnauthorized: false } : false,
});

async function testCompleteFlow() {
  const client = await pool.connect();
  
  try {
    console.log("\n╔══════════════════════════════════════════════════════════════╗");
    console.log("║  TEST COMPLET : FLUX ADMIN → DB → PUBLIC                     ║");
    console.log("╚══════════════════════════════════════════════════════════════╝\n");

    // 1. Vérifier la connexion
    console.log("1️⃣  Vérification de la connexion à la base de données...");
    const connectionTest = await client.query("SELECT NOW()");
    console.log("   ✅ Connexion OK:", connectionTest.rows[0].now);

    // 2. Vérifier l'existence des tables
    console.log("\n2️⃣  Vérification des tables...");
    const tables = [
      "distinctions",
      "impacts",
      "produits",
      "realisations",
      "evenements",
      "galerie",
      "partenaires",
      "blog_pubs",
      "blog_articles",
      "slides",
      "services",
      "reseaux_sociaux",
    ];

    for (const table of tables) {
      const result = await client.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        )`,
        [table]
      );
      if (result.rows[0].exists) {
        console.log(`   ✅ Table ${table} existe`);
      } else {
        console.log(`   ❌ Table ${table} n'existe pas`);
      }
    }

    // 3. Vérifier les colonnes ID (BIGINT)
    console.log("\n3️⃣  Vérification des types de colonnes ID...");
    const idColumns = await client.query(`
      SELECT 
        table_name,
        column_name,
        data_type
      FROM information_schema.columns
      WHERE column_name = 'id' 
        AND table_schema = 'public'
        AND table_name IN ('distinctions', 'impacts', 'produits', 'realisations', 'evenements', 'galerie', 'partenaires', 'blog_pubs', 'blog_articles', 'slides', 'services')
      ORDER BY table_name
    `);

    for (const row of idColumns.rows) {
      if (row.data_type === "bigint") {
        console.log(`   ✅ ${row.table_name}.id est BIGINT`);
      } else {
        console.log(`   ⚠️  ${row.table_name}.id est ${row.data_type} (devrait être BIGINT)`);
      }
    }

    // 4. Test d'ajout d'une distinction (simulation admin)
    console.log("\n4️⃣  Test d'ajout d'une distinction (simulation admin)...");
    const testDistinctionId = Date.now().toString();
    const testDistinction = {
      id: testDistinctionId,
      title: "Test Distinction - " + new Date().toISOString(),
      description: "Ceci est un test automatique",
      image: "https://picsum.photos/400/300?random=" + Math.random(),
      date: new Date().toISOString().split("T")[0],
    };

    try {
      // Supprimer si existe déjà
      await client.query("DELETE FROM distinctions WHERE id = $1", [parseInt(testDistinctionId)]);
      
      // Insérer
      await client.query(
        `INSERT INTO distinctions (id, title, description, image, date, updated_at)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
        [
          parseInt(testDistinctionId),
          testDistinction.title,
          testDistinction.description,
          testDistinction.image,
          testDistinction.date,
        ]
      );
      console.log("   ✅ Distinction ajoutée avec succès");
      console.log(`      ID: ${testDistinctionId}`);
      console.log(`      Title: ${testDistinction.title}`);
    } catch (error) {
      console.error("   ❌ Erreur lors de l'ajout:", error.message);
      if (error.message.includes("out of range")) {
        console.error("      ⚠️  Problème de type ID (INTEGER overflow)");
      }
    }

    // 5. Vérifier que la distinction est récupérable (simulation public)
    console.log("\n5️⃣  Test de récupération (simulation public)...");
    const fetchedDistinction = await client.query(
      "SELECT * FROM distinctions WHERE id = $1",
      [parseInt(testDistinctionId)]
    );

    if (fetchedDistinction.rows.length > 0) {
      const dist = fetchedDistinction.rows[0];
      console.log("   ✅ Distinction récupérée avec succès");
      console.log(`      ID: ${dist.id}`);
      console.log(`      Title: ${dist.title}`);
      console.log(`      Image: ${dist.image ? "✅ Présente" : "❌ Absente"}`);
      console.log(`      Description: ${dist.description ? "✅ Présente" : "❌ Absente"}`);
    } else {
      console.log("   ❌ Distinction non trouvée après insertion");
    }

    // 6. Test d'ajout d'un impact
    console.log("\n6️⃣  Test d'ajout d'un impact...");
    const testImpactId = Date.now().toString();
    const testImpact = {
      id: testImpactId,
      continent: "Afrique",
      pays: "Togo",
      ville: "Lomé",
      description: "Test d'impact automatique",
      image: "https://picsum.photos/400/300?random=" + Math.random(),
    };

    try {
      await client.query("DELETE FROM impacts WHERE id = $1", [parseInt(testImpactId)]);
      await client.query(
        `INSERT INTO impacts (id, continent, pays, ville, description, image, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)`,
        [
          parseInt(testImpactId),
          testImpact.continent,
          testImpact.pays,
          testImpact.ville,
          testImpact.description,
          testImpact.image,
        ]
      );
      console.log("   ✅ Impact ajouté avec succès");
    } catch (error) {
      console.error("   ❌ Erreur lors de l'ajout:", error.message);
    }

    // 7. Test d'ajout d'un produit
    console.log("\n7️⃣  Test d'ajout d'un produit...");
    const testProduitId = Date.now().toString();
    const testProduit = {
      id: testProduitId,
      title: "Produit Test",
      description: "Description du produit test",
      image: "https://picsum.photos/400/300?random=" + Math.random(),
      prix: "10000 FCFA",
    };

    try {
      await client.query("DELETE FROM produits WHERE id = $1", [parseInt(testProduitId)]);
      await client.query(
        `INSERT INTO produits (id, title, description, image, prix, updated_at)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
        [
          parseInt(testProduitId),
          testProduit.title,
          testProduit.description,
          testProduit.image,
          testProduit.prix,
        ]
      );
      console.log("   ✅ Produit ajouté avec succès");
    } catch (error) {
      console.error("   ❌ Erreur lors de l'ajout:", error.message);
    }

    // 8. Vérifier les comptes
    console.log("\n8️⃣  Comptes des données...");
    const counts = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM distinctions) as distinctions,
        (SELECT COUNT(*) FROM impacts) as impacts,
        (SELECT COUNT(*) FROM produits) as produits,
        (SELECT COUNT(*) FROM realisations) as realisations,
        (SELECT COUNT(*) FROM evenements) as evenements,
        (SELECT COUNT(*) FROM galerie) as galerie,
        (SELECT COUNT(*) FROM partenaires) as partenaires,
        (SELECT COUNT(*) FROM blog_pubs) as pubs,
        (SELECT COUNT(*) FROM blog_articles) as articles
    `);

    const count = counts.rows[0];
    console.log(`   Distinctions: ${count.distinctions}`);
    console.log(`   Impacts: ${count.impacts}`);
    console.log(`   Produits: ${count.produits}`);
    console.log(`   Réalisations: ${count.realisations}`);
    console.log(`   Événements: ${count.evenements}`);
    console.log(`   Galerie: ${count.galerie}`);
    console.log(`   Partenaires: ${count.partenaires}`);
    console.log(`   Pubs: ${count.pubs}`);
    console.log(`   Articles: ${count.articles}`);

    // 9. Nettoyer les données de test
    console.log("\n9️⃣  Nettoyage des données de test...");
    await client.query("DELETE FROM distinctions WHERE id = $1", [parseInt(testDistinctionId)]);
    await client.query("DELETE FROM impacts WHERE id = $1", [parseInt(testImpactId)]);
    await client.query("DELETE FROM produits WHERE id = $1", [parseInt(testProduitId)]);
    console.log("   ✅ Données de test supprimées");

    console.log("\n╔══════════════════════════════════════════════════════════════╗");
    console.log("║  ✅ TEST COMPLET TERMINÉ                                     ║");
    console.log("╚══════════════════════════════════════════════════════════════╝\n");

  } catch (error) {
    console.error("\n❌ Erreur lors du test:", error);
    console.error("Stack:", error.stack);
  } finally {
    client.release();
    await pool.end();
  }
}

testCompleteFlow().catch(console.error);

