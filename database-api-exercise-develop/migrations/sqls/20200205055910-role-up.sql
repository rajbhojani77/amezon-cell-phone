CREATE TABLE IF NOT EXISTS Roles (id   SERIAL , role VARCHAR(255), inactive BOOLEAN DEFAULT false, createdAt TIMESTAMP NOT NULL DEFAULT NOW(), updatedAt TIMESTAMP NOT NULL DEFAULT NOW(), PRIMARY KEY (id));