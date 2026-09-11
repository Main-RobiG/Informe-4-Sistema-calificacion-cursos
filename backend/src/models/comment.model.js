const pool = require('../database/connection');

class CommentModel {
  static async create({
    postId,
    userId,
    content
  }) {
    const [result] = await pool.query(
      `
      INSERT INTO comments (
        post_id,
        user_id,
        content
      )
      VALUES (?, ?, ?)
      `,
      [
        postId,
        userId,
        content
      ]
    );

    return this.findById(result.insertId);
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `
      SELECT
        c.id,
        c.post_id,
        c.content,
        c.created_at,

        u.id AS user_id,
        u.academic_registry,
        u.full_name AS user_name

      FROM comments c

      INNER JOIN users u
        ON c.user_id = u.id

      WHERE c.id = ?

      LIMIT 1
      `,
      [id]
    );

    return rows[0] || null;
  }

  static async findByPostId(postId) {
    const [rows] = await pool.query(
      `
      SELECT
        c.id,
        c.post_id,
        c.content,
        c.created_at,

        u.id AS user_id,
        u.academic_registry,
        u.full_name AS user_name

      FROM comments c

      INNER JOIN users u
        ON c.user_id = u.id

      WHERE c.post_id = ?

      ORDER BY c.created_at ASC
      `,
      [postId]
    );

    return rows;
  }
}

module.exports = CommentModel;