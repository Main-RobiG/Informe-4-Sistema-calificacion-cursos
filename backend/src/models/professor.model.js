const pool = require('../database/connection');

class ProfessorModel {
  static async findAll() {
    const [rows] = await pool.query(`
      SELECT
        id,
        full_name,
        created_at
      FROM professors
      ORDER BY full_name ASC
    `);

    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `
      SELECT
        id,
        full_name,
        created_at
      FROM professors
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    return rows[0] || null;
  }

  static async searchByName(search) {
    const [rows] = await pool.query(
      `
      SELECT
        id,
        full_name,
        created_at
      FROM professors
      WHERE full_name LIKE ?
      ORDER BY full_name ASC
      `,
      [`%${search}%`]
    );

    return rows;
  }
}

module.exports = ProfessorModel;