const pool = require('../database/connection');

class CourseModel {
  static async findAll() {
    const [rows] = await pool.query(`
      SELECT
        id,
        code,
        name,
        credits,
        semester
      FROM courses
      ORDER BY name ASC
    `);

    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `
      SELECT
        id,
        code,
        name,
        credits,
        semester
      FROM courses
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
        code,
        name,
        credits,
        semester
      FROM courses
      WHERE name LIKE ?
         OR code LIKE ?
      ORDER BY name ASC
      `,
      [`%${search}%`, `%${search}%`]
    );

    return rows;
  }
}

module.exports = CourseModel;