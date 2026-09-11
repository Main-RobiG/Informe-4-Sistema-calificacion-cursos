require('dotenv').config();

const bcrypt = require('bcryptjs');

const pool = require('./database/connection');

const users = [
  {
    academicRegistry: '200919744',
    fullName: 'Rudin Lopez',
    email: 'correo1@gmail.com',
    password: 'Admin123',
  },
  {
    academicRegistry: '201404365',
    fullName: 'Sergio Gudiel',
    email: 'correo2@gmail.com',
    password: 'Admin123',
  },
];

const professors = [
  'MANUEL HAROLDO CASTILLO REYNA',
  'SERGIO ARNALDO MENDEZ AGUILAR',
  'EDGAR RENE ORNELIS HOIL',
  'JORGE LUIS ALVAREZ MEJIA',
  'CESAR AUGUSTO FERNANDEZ CACERES',
  'LUIS FERNANDO ESPINO BARRIOS',
  'OTTO AMILCAR RODRIGUEZ ACOSTA',
  'EDGAR RUBEN SABAN RAXON',
  'FREIRY JAVIER GRAMAJO LOPEZ',
  'GABRIEL ALEJANDRO DIAZ LOPEZ',
  'JURGEN ANDONI RAMIREZ RAMÍREZ',
  'PEDRO PABLO HERNANDEZ RAMIREZ',
  'ALLAN ALBERTO MORATAYA GÓMEZ',
  'AIDA ALEJANDRA MANSILLA ORANTES',
  'SEBASTIAN GOMEZ LAVARREDA',
  'MIGUEL ANGEL CANCINOS RENDON',
  'SERGIO LEONEL GOMEZ BRAVO',
];

const courses = [
  { code: '0772', name: 'Estructuras de Datos', credits: 6, semester: 5 },
  { code: '0777', name: 'Organización de Lenguajes y Compiladores 1', credits: 6, semester: 5 },
  { code: '0722', name: 'Teoría de Sistemas 1', credits: 4, semester: 6 },
  { code: '0781', name: 'Organización de Lenguajes y Compiladores 2', credits: 6, semester: 6 },
  { code: '0281', name: 'Sistemas Operativos 1', credits: 6, semester: 7 },
  { code: '0724', name: 'Teoría de Sistemas 2', credits: 4, semester: 7 },
  { code: '0774', name: 'Sistemas de Bases de Datos 1', credits: 5, semester: 7 },
  { code: '0779', name: 'Arquitectura de Computadores y Ensambladores 2', credits: 5, semester: 7 },
  { code: '0970', name: 'Redes de Computadoras 1', credits: 5, semester: 7 },
  { code: '0285', name: 'Sistemas Operativos 2', credits: 4, semester: 8 },
  { code: '0775', name: 'Sistemas de Bases de Datos 2', credits: 4, semester: 8 },
  { code: '0975', name: 'Redes de Computadoras 2', credits: 4, semester: 8 },
  { code: '0729', name: 'Modelación y Simulación 1', credits: 5, semester: 9 },
  { code: '0972', name: 'Inteligencia Artificial 1', credits: 7, semester: 9 },
  { code: '0720', name: 'Modelación y Simulación 2', credits: 6, semester: 10 },
  { code: '0968', name: 'Inteligencia Artificial 2', credits: 5, semester: 10 },
];

async function seedUsers() {
  console.log('Creando usuarios iniciales...');

  for (const user of users) {
    const [existing] = await pool.query(
      `
      SELECT id
      FROM users
      WHERE academic_registry = ?
         OR email = ?
      `,
      [user.academicRegistry, user.email]
    );

    if (existing.length > 0) {
      console.log(`Usuario ${user.academicRegistry} ya existe`);
      continue;
    }

    const passwordHash = await bcrypt.hash(user.password, 10);

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
      [user.academicRegistry, user.fullName, user.email, passwordHash]
    );

    console.log(`Usuario ${user.academicRegistry} creado`);
  }
}

async function seedProfessors() {
  console.log('Creando catedráticos iniciales...');

  for (const fullName of professors) {
    const [existing] = await pool.query(
      `SELECT id FROM professors WHERE full_name = ?`,
      [fullName]
    );

    if (existing.length > 0) {
      continue;
    }

    await pool.query(`INSERT INTO professors (full_name) VALUES (?)`, [fullName]);
  }

  console.log(`Catedráticos listos (${professors.length} en catálogo)`);
}

async function seedCourses() {
  console.log('Creando cursos iniciales...');

  for (const course of courses) {
    const [existing] = await pool.query(
      `SELECT id FROM courses WHERE code = ?`,
      [course.code]
    );

    if (existing.length > 0) {
      continue;
    }

    await pool.query(
      `
      INSERT INTO courses (code, name, credits, semester)
      VALUES (?, ?, ?, ?)
      `,
      [course.code, course.name, course.credits, course.semester]
    );
  }

  console.log(`Cursos listos (${courses.length} en catálogo)`);
}

async function seed() {
  try {
    await seedUsers();
    await seedProfessors();
    await seedCourses();

    console.log('Seed finalizado correctamente');
    process.exit(0);
  } catch (error) {
    console.error('Error ejecutando seed:');
    console.error(error);
    process.exit(1);
  }
}

seed();