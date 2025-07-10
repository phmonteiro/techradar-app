import sql from 'mssql';
import fs from 'fs/promises';
import path from 'path';

// Path to config.json
const configPath = path.resolve('src', 'components', 'TechRadar', 'config.json');

// SQL Server connection configuration
const sqlConfig = {
  user: process.env.DB_USER || 'sqlroot',
  password: process.env.DB_PASSWORD || ':.9Qpc:4KuH6VfH',
  server: process.env.DB_SERVER || 'pettracker.database.windows.net',
  database: process.env.DB_NAME || 'techradar',
  options: {
    encrypt: true, // For Azure
    trustServerCertificate: true, // For local dev / self-signed certs
  }
};

const populateMssqlDatabase = async () => {
  try {
    // Read config.json file
    const fileContent = await fs.readFile(configPath, 'utf-8');
    const configData = JSON.parse(fileContent);

    // Connect to SQL Server
    await sql.connect(sqlConfig);
    console.log('Connected to SQL Server');

    // Ensure tables exist (create if not)
    await createTablesIfNotExist();

    // Insert radar date
    await insertDate(configData.date);
    
    // Insert radar entries
    await insertEntries(configData.entries);

    console.log('Database populated successfully!');
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    await sql.close();
    console.log('SQL connection closed');
  }
};

async function createTablesIfNotExist() {
  try {
    // Check if radar_dates table exists
    const datesTableResult = await sql.query(`
      IF NOT EXISTS (
        SELECT * FROM sys.tables WHERE name = 'radar_dates'
      )
      CREATE TABLE radar_dates (
        id INT PRIMARY KEY IDENTITY(1,1),
        date VARCHAR(10) NOT NULL,
        created_at DATETIME DEFAULT GETDATE()
      )
    `);

    // Check if radar_entries table exists
    const entriesTableResult = await sql.query(`
      IF NOT EXISTS (
        SELECT * FROM sys.tables WHERE name = 'radar_entries'
      )
      CREATE TABLE radar_entries (
        id INT PRIMARY KEY IDENTITY(1,1),
        quadrant INT NOT NULL,
        ring INT NOT NULL,
        label VARCHAR(255) NOT NULL,
        link VARCHAR(512),
        active BIT DEFAULT 1,
        moved INT DEFAULT 0,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE(),
        CONSTRAINT UC_QuadrantRingLabel UNIQUE (quadrant, ring, label)
      )
    `);

    // Create indexes for better performance
    await sql.query(`
      IF NOT EXISTS (
        SELECT * FROM sys.indexes WHERE name = 'idx_radar_entries_quadrant'
      )
      CREATE INDEX idx_radar_entries_quadrant ON radar_entries(quadrant)
    `);

    await sql.query(`
      IF NOT EXISTS (
        SELECT * FROM sys.indexes WHERE name = 'idx_radar_entries_ring'
      )
      CREATE INDEX idx_radar_entries_ring ON radar_entries(ring)
    `);

    console.log('Tables and indexes created or already exist');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

async function insertDate(date) {
  try {
    // Check if date already exists
    const dateCheck = await sql.query`
      SELECT id FROM radar_dates WHERE date = ${date}
    `;

    if (dateCheck.recordset.length === 0) {
      // Insert the date if it doesn't exist
      await sql.query`
        INSERT INTO radar_dates (date)
        VALUES (${date})
      `;
      console.log(`Date ${date} inserted`);
    } else {
      console.log(`Date ${date} already exists, skipping`);
    }
  } catch (error) {
    console.error('Error inserting date:', error);
    throw error;
  }
}

async function insertEntries(entries) {
  try {
    // Process each entry
    for (const entry of entries) {
      // Check if entry exists
      const entryCheck = await sql.query`
        SELECT id FROM radar_entries 
        WHERE quadrant = ${entry.quadrant} 
        AND ring = ${entry.ring} 
        AND label = ${entry.label}
      `;

      if (entryCheck.recordset.length === 0) {
        // Insert new entry
        await sql.query`
          INSERT INTO radar_entries (quadrant, ring, label, link, active, moved)
          VALUES (${entry.quadrant}, ${entry.ring}, ${entry.label}, 
                 ${entry.link || null}, ${entry.active ? 1 : 0}, ${entry.moved})
        `;
        console.log(`Entry '${entry.label}' inserted`);
      } else {
        // Update existing entry
        await sql.query`
          UPDATE radar_entries
          SET link = ${entry.link || null},
              active = ${entry.active ? 1 : 0},
              moved = ${entry.moved},
              updated_at = GETDATE()
          WHERE quadrant = ${entry.quadrant}
          AND ring = ${entry.ring}
          AND label = ${entry.label}
        `;
        console.log(`Entry '${entry.label}' updated`);
      }
    }
    
    console.log(`Total of ${entries.length} entries processed`);
  } catch (error) {
    console.error('Error inserting entries:', error);
    throw error;
  }
}

// Run the script
populateMssqlDatabase();
