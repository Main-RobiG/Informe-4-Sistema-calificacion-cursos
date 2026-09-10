const pool = require('../database/connection');

class ApprovedCourseModel {
  static async findByUserId(userId) {
    const [rows] = await pool.query(
      `
      SELECT
        ac.id,
        ac.user_id,
        ac.course_id,
        ac.approved_at,

        c.code,
        c.name,
        c.credits,
        c.semester

      FROM approved_courses ac

      INNER JOIN courses c
        ON ac.course_id = c.id

      WHERE ac.user_id = ?

      ORDER BY c.semester ASC, c.name ASC
      `,
      [userId]
    );

    return rows;
  }

  static async findOne(userId, courseId) {
    const [rows] = await pool.query(
      `
      SELECT
        id,
        user_id,
        course_id,
        approved_at
      FROM approved_courses
      WHERE user_id = ?
        AND course_id = ?
      LIMIT 1
      `,
      [userId, courseId]
    );

    return rows[0] || null;
  }

  static async create(userId, courseId) {
    const [result] = await pool.query(
      `
      INSERT INTO approved_courses (
        user_id,
        course_id
      )
      VALUES (?, ?)
      `,
      [userId, courseId]
    );

    return result.insertId;
  }

  static async delete(userId, courseId) {
    const [result] = await pool.query(
      `
      DELETE FROM approved_courses
      WHERE user_id = ?
        AND course_id = ?
      `,
      [userId, courseId]
    );

    return result.affectedRows > 0;
  }

  static async getTotalCredits(userId) {
    const [rows] = await pool.query(
      `
      SELECT
        COALESCE(SUM(c.credits), 0) AS total_credits
      FROM approved_courses ac

      INNER JOIN courses c
        ON ac.course_id = c.id

      WHERE ac.user_id = ?
      `,
      [userId]
    );

    return rows[0].total_credits;
  }
}

module.exports = ApprovedCourseModel;