-- Script SQL pour convertir toutes les colonnes image/logo de VARCHAR(500) à TEXT
-- Nécessaire car les images base64 peuvent être très longues

-- Galerie
ALTER TABLE galerie ALTER COLUMN image TYPE TEXT;

-- Partenaires (logo)
ALTER TABLE partenaires ALTER COLUMN logo TYPE TEXT;

-- Distinctions
ALTER TABLE distinctions ALTER COLUMN image TYPE TEXT;

-- Impacts
ALTER TABLE impacts ALTER COLUMN image TYPE TEXT;

-- Produits
ALTER TABLE produits ALTER COLUMN image TYPE TEXT;

-- Réalisations
ALTER TABLE realisations ALTER COLUMN image TYPE TEXT;

-- Événements
ALTER TABLE evenements ALTER COLUMN image TYPE TEXT;

-- Blog Pubs
ALTER TABLE blog_pubs ALTER COLUMN image TYPE TEXT;

-- Blog Articles
ALTER TABLE blog_articles ALTER COLUMN image TYPE TEXT;

-- Slides
ALTER TABLE slides ALTER COLUMN image TYPE TEXT;

-- Vérification (optionnel - pour voir les types actuels)
-- SELECT table_name, column_name, data_type, character_maximum_length
-- FROM information_schema.columns
-- WHERE column_name IN ('image', 'logo')
-- ORDER BY table_name, column_name;

