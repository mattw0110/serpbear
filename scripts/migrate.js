const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

async function runMigrations() {
  const dbPath = process.env.DATABASE_PATH || '/tmp/data/database.sqlite';
  const dataDir = path.dirname(dbPath);
  
  // Ensure data directory exists
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log(`Created data directory: ${dataDir}`);
    }
    console.log(`Using data directory: ${dataDir}`);
  } catch (error) {
    console.error('Error creating data directory:', error.message);
    process.exit(1);
  }
  
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false,
  });

  try {
    // Test connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Run migrations manually
    const migrationsDir = path.join(__dirname, '../database/migrations');
    const migrationFiles = fs.readdirSync(migrationsDir).sort();
    
    // Create SequelizeMeta table if it doesn't exist
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "SequelizeMeta" (
        "name" VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY
      );
    `);
    
    for (const file of migrationFiles) {
      if (file.endsWith('.js')) {
        const [result] = await sequelize.query(
          'SELECT name FROM SequelizeMeta WHERE name = ?',
          { replacements: [file] }
        );
        
        if (result.length === 0) {
          console.log(`Running migration: ${file}`);
          const migration = require(path.join(migrationsDir, file));
          
          if (migration.up) {
            await migration.up(sequelize.getQueryInterface(), Sequelize);
            await sequelize.query(
              'INSERT INTO SequelizeMeta (name) VALUES (?)',
              { replacements: [file] }
            );
            console.log(`Migration ${file} completed successfully.`);
          }
        } else {
          console.log(`Migration ${file} already applied.`);
        }
      }
    }
    
    console.log('All migrations completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

runMigrations();
