const pool = require('../database/connection');

class UserModel {
  static async findByAcademicRegistry(academicRegistry) {
    const [rows] = await pool.query(
      `
      SELECT
        id,
        academic_registry,
        full_name,
        email,
        password_hash,
        created_at,
        updated_at
      FROM users
      WHERE academic_registry = ?
      LIMIT 1
      `,
      [academicRegistry]
    );

    return rows[0] || null;
  }

  static async findByEmail(email) {
    const [rows] = await pool.query(
      `
      SELECT
        id,
        academic_registry,
        full_name,
        email,
        password_hash,
        created_at,
        updated_at
      FROM users
      WHERE email = ?
      LIMIT 1
      `,
      [email]
    );

    return rows[0] || null;
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `
      SELECT
        id,
        academic_registry,
        full_name,
        email,
        created_at,
        updated_at
      FROM users
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    return rows[0] || null;
  }

  static async create({
    academicRegistry,
    fullName,
    email,
    passwordHash
  }) {
    const [result] = await pool.query(
      `
      INSERT INTO users (
        academic_registry,
        full_name,
        email,
        password_hash
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        academicRegistry,
        fullName,
        email,
        passwordHash
      ]
    );

    return this.findById(result.insertId);
  }

  static async updatePassword(
    id,
    passwordHash
  ) {
    const [result] = await pool.query(
      `
      UPDATE users
      SET password_hash = ?
      WHERE id = ?
      `,
      [
        passwordHash,
        id
      ]
    );

    return result.affectedRows > 0;
  }

  static async updateProfile(
    id,
    {
      fullName,
      email
    }
  ) {
    const [result] = await pool.query(
      `
      UPDATE users
      SET
        full_name = ?,
        email = ?
      WHERE id = ?
      `,
      [
        fullName,
        email,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return this.findById(id);
  }

  static async searchByAcademicRegistry(
    academicRegistry
  ) {
    const [rows] = await pool.query(
      `
      SELECT
        id,
        academic_registry,
        full_name,
        email,
        created_at,
        updated_at
      FROM users
      WHERE academic_registry LIKE ?
      ORDER BY academic_registry ASC
      LIMIT 20
      `,
      [`%${academicRegistry}%`]
    );

    return rows;
  }
}

module.exports = UserModel;