const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../analyses.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  }
});

// Initialize table on connection
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS saved_analyses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_name TEXT NOT NULL,
      analysis_data TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_favorite BOOLEAN DEFAULT 0
    )
  `);
});

// Promisify database methods
const dbGet = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const dbRun = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

// Save a company analysis
async function saveAnalysis(companyName, analysisData) {
  if (!companyName || typeof companyName !== 'string') {
    throw new Error('Valid company name is required');
  }
  if (!analysisData) {
    throw new Error('Analysis data is required');
  }

  const timestamp = new Date().toISOString();
  const analysisJson = JSON.stringify(analysisData);

  try {
    const result = await dbRun(
      `INSERT INTO saved_analyses (company_name, analysis_data, timestamp)
       VALUES (?, ?, ?)`,
      [companyName, analysisJson, timestamp]
    );
    return {
      id: result.lastID,
      companyName,
      timestamp,
      message: 'Analysis saved successfully'
    };
  } catch (error) {
    throw new Error(`Failed to save analysis: ${error.message}`);
  }
}

// Get all saved analyses
async function getAllAnalyses() {
  try {
    const rows = await dbAll(
      `SELECT id, company_name, timestamp, is_favorite,
              SUBSTR(analysis_data, 1, 200) as preview
       FROM saved_analyses
       ORDER BY timestamp DESC`,
      []
    );
    return rows || [];
  } catch (error) {
    throw new Error(`Failed to retrieve analyses: ${error.message}`);
  }
}

// Get single analysis by ID
async function getAnalysisById(id) {
  if (!id || !Number.isInteger(Number(id))) {
    throw new Error('Valid analysis ID is required');
  }

  try {
    const row = await dbGet(
      `SELECT * FROM saved_analyses WHERE id = ?`,
      [id]
    );
    if (!row) {
      throw new Error('Analysis not found');
    }

    let analysisData;
    try {
      analysisData = JSON.parse(row.analysis_data);
    } catch (parseError) {
      throw new Error(`Invalid analysis data format: ${parseError.message}`);
    }

    return {
      ...row,
      analysisData
    };
  } catch (error) {
    if (error.message === 'Analysis not found' || error.message.includes('Invalid analysis data format')) {
      throw error;
    }
    throw new Error(`Failed to retrieve analysis: ${error.message}`);
  }
}

// Toggle favorite status
async function toggleFavorite(id, isFavorite) {
  if (!id || !Number.isInteger(Number(id))) {
    throw new Error('Valid analysis ID is required');
  }

  try {
    const result = await dbRun(
      `UPDATE saved_analyses SET is_favorite = ? WHERE id = ?`,
      [isFavorite ? 1 : 0, id]
    );
    if (result.changes === 0) {
      throw new Error('Analysis not found');
    }
    return { id, is_favorite: isFavorite };
  } catch (error) {
    if (error.message === 'Analysis not found') {
      throw error;
    }
    throw new Error(`Failed to update favorite status: ${error.message}`);
  }
}

// Delete analysis
async function deleteAnalysis(id) {
  if (!id || !Number.isInteger(Number(id))) {
    throw new Error('Valid analysis ID is required');
  }

  try {
    const result = await dbRun(
      `DELETE FROM saved_analyses WHERE id = ?`,
      [id]
    );
    if (result.changes === 0) {
      throw new Error('Analysis not found');
    }
    return { id, message: 'Analysis deleted' };
  } catch (error) {
    if (error.message === 'Analysis not found') {
      throw error;
    }
    throw new Error(`Failed to delete analysis: ${error.message}`);
  }
}

// Get multiple analyses by IDs (for batch email generation)
async function getAnalysesByIds(ids) {
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return [];
  }

  try {
    const placeholders = ids.map(() => '?').join(',');
    const rows = await dbAll(
      `SELECT * FROM saved_analyses WHERE id IN (${placeholders})`,
      ids
    );

    return rows.map(row => {
      let analysisData;
      try {
        analysisData = JSON.parse(row.analysis_data);
      } catch (parseError) {
        console.error(`Failed to parse analysis data for ID ${row.id}:`, parseError);
        return null; // Mark for filtering
      }
      return {
        ...row,
        analysisData
      };
    }).filter(row => row !== null); // Filter out invalid records
  } catch (error) {
    throw new Error(`Failed to retrieve analyses: ${error.message}`);
  }
}

// Graceful database shutdown
function closeDatabase() {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

module.exports = {
  saveAnalysis,
  getAllAnalyses,
  getAnalysisById,
  toggleFavorite,
  deleteAnalysis,
  getAnalysesByIds,
  closeDatabase
};
