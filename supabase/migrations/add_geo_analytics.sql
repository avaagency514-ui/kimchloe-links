-- Ajouter les colonnes de géolocalisation et le flag anti-bot à la table visits
ALTER TABLE visits ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS is_bot BOOLEAN DEFAULT false;

-- Si on veut pouvoir faire des requêtes plus performantes par le futur :
CREATE INDEX IF NOT EXISTS visits_country_idx ON visits(country);
CREATE INDEX IF NOT EXISTS visits_is_bot_idx ON visits(is_bot);
