const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../analyses.db');
const db = new sqlite3.Database(dbPath);

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
  try {
    const row = await dbGet(
      `SELECT * FROM saved_analyses WHERE id = ?`,
      [id]
    );
    if (!row) {
      throw new Error('Analysis not found');
    }
    return {
      ...row,
      analysisData: JSON.parse(row.analysis_data)
    };
  } catch (error) {
    throw new Error(`Failed to retrieve analysis: ${error.message}`);
  }
}

// Toggle favorite status
async function toggleFavorite(id, isFavorite) {
  try {
    await dbRun(
      `UPDATE saved_analyses SET is_favorite = ? WHERE id = ?`,
      [isFavorite ? 1 : 0, id]
    );
    return { id, is_favorite: isFavorite };
  } catch (error) {
    throw new Error(`Failed to update favorite status: ${error.message}`);
  }
}

// Delete analysis
async function deleteAnalysis(id) {
  try {
    await dbRun(
      `DELETE FROM saved_analyses WHERE id = ?`,
      [id]
    );
    return { id, message: 'Analysis deleted' };
  } catch (error) {
    throw new Error(`Failed to delete analysis: ${error.message}`);
  }
}

// Get multiple analyses by IDs (for batch email generation)
async function getAnalysesByIds(ids) {
  try {
    const placeholders = ids.map(() => '?').join(',');
    const rows = await dbAll(
      `SELECT * FROM saved_analyses WHERE id IN (${placeholders})`,
      ids
    );
    return rows.map(row => ({
      ...row,
      analysisData: JSON.parse(row.analysis_data)
    }));
  } catch (error) {
    throw new Error(`Failed to retrieve analyses: ${error.message}`);
  }
}

module.exports = {
  saveAnalysis,
  getAllAnalyses,
  getAnalysisById,
  toggleFavorite,
  deleteAnalysis,
  getAnalysesByIds
};
