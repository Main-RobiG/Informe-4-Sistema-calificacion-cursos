require('dotenv').config();

const bcrypt = require('bcryptjs');

const pool =
  require('./database/connection');

async function seed() {
  try {
    console.log(
      'Creando usuarios iniciales...'
    );

    const users = [
      {
        academicRegistry: '200919744',
        fullName: 'Rudin Lopez',
        email: 'correo1@gmail.com',
        password: 'Admin123'
      },
      {
        academicRegistry: '201404365',
        fullName: 'Sergio Gudiel',
        email: 'correo2@gmail.com',
        password: 'Admin123'
      }
    ];

    for (const user of users) {
      const [existing] =
        await pool.query(
          `
          SELECT id
          FROM users
          WHERE academic_registry = ?
             OR email = ?
          `,
          [
            user.academicRegistry,
            user.email
          ]
        );

      if (existing.length > 0) {
        console.log(
          `Usuario ${user.academicRegistry} ya existe`
        );

        continue;
      }

      const passwordHash =
        await bcrypt.hash(
          user.password,
          10
        );

      await pool.query(
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
          user.academicRegistry,
          user.fullName,
          user.email,
          passwordHash
        ]
      );

      console.log(
        `Usuario ${user.academicRegistry} creado`
      );
    }

    console.log(
      'Seed finalizado correctamente'
    );

    process.exit(0);
  } catch (error) {
    console.error(
      'Error ejecutando seed:'
    );

    console.error(error);

    process.exit(1);
  }
}

seed();