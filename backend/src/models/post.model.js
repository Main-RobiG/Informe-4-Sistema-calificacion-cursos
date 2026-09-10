const pool = require('../database/connection');

class PostModel {
  static async create({
    userId,
    courseId,
    professorId,
    content
  }) {
    const [result] = await pool.query(
      `
      INSERT INTO posts (
        user_id,
        course_id,
        professor_id,
        content
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        userId,
        courseId || null,
        professorId || null,
        content
      ]
    );

    return this.findById(result.insertId);
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `
      SELECT
        p.id,
        p.content,
        p.created_at,

        u.id AS user_id,
        u.academic_registry,
        u.full_name AS user_name,

        c.id AS course_id,
        c.code AS course_code,
        c.name AS course_name,

        pr.id AS professor_id,
        pr.full_name AS professor_name

      FROM posts p

      INNER JOIN users u
        ON p.user_id = u.id

      LEFT JOIN courses c
        ON p.course_id = c.id

      LEFT JOIN professors pr
        ON p.professor_id = pr.id

      WHERE p.id = ?

      LIMIT 1
      `,
      [id]
    );

    return rows[0] || null;
  }

  static async findAll(filters = {}) {
    let query = `
      SELECT
        p.id,
        p.content,
        p.created_at,

        u.id AS user_id,
        u.academic_registry,
        u.full_name AS user_name,

        c.id AS course_id,
        c.code AS course_code,
        c.name AS course_name,

        pr.id AS professor_id,
        pr.full_name AS professor_name

      FROM posts p

      INNER JOIN users u
        ON p.user_id = u.id

      LEFT JOIN courses c
        ON p.course_id = c.id

      LEFT JOIN professors pr
        ON p.professor_id = pr.id

      WHERE 1 = 1
    `;

    const params = [];

    if (filters.courseId) {
      query += `
        AND p.course_id = ?
      `;

      params.push(filters.courseId);
    }

    if (filters.professorId) {
      query += `
        AND p.professor_id = ?
      `;

      params.push(filters.professorId);
    }

    if (filters.courseName) {
      query += `
        AND c.name LIKE ?
      `;

      params.push(`%${filters.courseName}%`);
    }

    if (filters.professorName) {
      query += `
        AND pr.full_name LIKE ?
      `;

      params.push(`%${filters.professorName}%`);
    }

    query += `
      ORDER BY p.created_at DESC
    `;

    const [rows] = await pool.query(
      query,
      params
    );

    return rows;
  }
}

module.exports = PostModel;