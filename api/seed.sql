-- Script SQL de création et d'initialisation de la base de données
-- Basé sur seed.js

-- 1. Nettoyage (Ordre inverse des dépendances)
DROP TABLE IF EXISTS "user_favorites" CASCADE;
DROP TABLE IF EXISTS "pollutions" CASCADE;
DROP TABLE IF EXISTS "utilisateurs" CASCADE;
DROP TYPE IF EXISTS "enum_pollutions_type_pollution";

-- 2. Création du Type Enum pour les pollutions (PostgreSQL)
CREATE TYPE "enum_pollutions_type_pollution" AS ENUM('Plastique', 'Chimique', 'Dépôt sauvage', 'Eau', 'Air', 'Autre');

-- 3. Création des Tables
CREATE TABLE "utilisateurs" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR(255) NOT NULL UNIQUE,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL
);

CREATE TABLE "pollutions" (
    "id" SERIAL PRIMARY KEY,
    "titre" TEXT NOT NULL,
    "type_pollution" "enum_pollutions_type_pollution" NOT NULL,
    "description" TEXT NOT NULL,
    "date_observation" DATE NOT NULL,
    "lieu" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "photo_url" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "user_favorites" (
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL REFERENCES "utilisateurs" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "pollutionId" INTEGER NOT NULL REFERENCES "pollutions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("userId", "pollutionId")
);

-- 4. Insertion des Données

-- Utilisateurs
INSERT INTO "utilisateurs" ("username", "email", "password") VALUES
('user1', 'user1@example.com', 'password123'),
('user2', 'user2@example.com', 'password123'),
('user3', 'user3@example.com', 'password123'),
('user4', 'user4@example.com', 'password123'),
('user5', 'user5@example.com', 'password123'),
('user6', 'user6@example.com', 'password123'),
('user7', 'user7@example.com', 'password123'),
('user8', 'user8@example.com', 'password123'),
('user9', 'user9@example.com', 'password123'),
('user10', 'user10@example.com', 'password123');

-- Pollutions
INSERT INTO "pollutions" ("titre", "type_pollution", "description", "date_observation", "lieu", "latitude", "longitude", "photo_url") VALUES
('Déchets sur la plage', 'Plastique', 'Bouteilles et sacs plastiques éparpillés sur le sable.', '2024-01-15', 'Plage de Calais', 50.9513, 1.8587, 'https://images.unsplash.com/photo-1618477461853-5e87a2754897?auto=format&fit=crop&q=80&w=600'),
('Fumée noire usine', 'Air', 'Épaisse fumée noire sortant de la cheminée industrielle.', '2024-02-10', 'Zone industrielle Nord', 48.8566, 2.3522, 'https://images.unsplash.com/photo-1611273426728-66a982181759?auto=format&fit=crop&q=80&w=600'),
('Bidons dans la rivière', 'Chimique', 'Plusieurs bidons rouillés abandonnés dans le cours d''eau.', '2024-03-05', 'Rivière Liane', 50.7252, 1.6133, 'https://images.unsplash.com/photo-1596700867041-35b8db1e8a93?auto=format&fit=crop&q=80&w=600'),
('Décharge sauvage en forêt', 'Dépôt sauvage', 'Gravats et vieux meubles déposés illégalement.', '2024-03-20', 'Forêt de Fontainebleau', 48.4047, 2.7016, 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=600'),
('Mousse suspecte', 'Eau', 'Mousse blanche anormale à la surface de l''étang.', '2024-04-01', 'Étang des Aulnes', 47.2184, -1.5536, 'https://images.unsplash.com/photo-1592860867458-7dc8e5792c90?auto=format&fit=crop&q=80&w=600'),
('Sacs poubelle abandonnés', 'Autre', 'Tas de sacs poubelles laissés sur le trottoir hors jour de collecte.', '2024-04-12', 'Centre ville', 45.7640, 4.8357, NULL),
('Masques chirurgicaux', 'Plastique', 'Dizaines de masques jetés dans le parc.', '2024-04-15', 'Parc de la Tête d''Or', 45.7772, 4.8550, 'https://images.unsplash.com/photo-1584652868574-0669f6e522a1?auto=format&fit=crop&q=80&w=600'),
('Huile de vidange', 'Chimique', 'Trace d''huile sur le parking du supermarché.', '2024-04-18', 'Super U Parking', 43.6047, 1.4442, NULL),
('Bouteilles en verre', 'Dépôt sauvage', 'Débris de verre et bouteilles vides après une fête.', '2024-04-20', 'Quais de Seine', 48.8584, 2.2945, NULL),
('Odeur pestilentielle', 'Air', 'Forte odeur de soufre provenant de l''usine voisine.', '2024-04-22', 'Quartier Est', 50.6292, 3.0573, NULL);

-- Favoris
-- Note: On utilise des sous-requêtes pour récupérer les IDs afin d'être robuste si les IDs changent
-- User 1 aime pollution 1 et 2
INSERT INTO "user_favorites" ("userId", "pollutionId") VALUES 
((SELECT id FROM utilisateurs WHERE username = 'user1'), (SELECT id FROM pollutions WHERE titre = 'Déchets sur la plage')),
((SELECT id FROM utilisateurs WHERE username = 'user1'), (SELECT id FROM pollutions WHERE titre = 'Fumée noire usine'));

-- User 2 aime pollution 3
INSERT INTO "user_favorites" ("userId", "pollutionId") VALUES 
((SELECT id FROM utilisateurs WHERE username = 'user2'), (SELECT id FROM pollutions WHERE titre = 'Bidons dans la rivière'));

