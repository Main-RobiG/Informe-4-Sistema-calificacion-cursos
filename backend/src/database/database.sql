DROP DATABASE IF EXISTS sistema_calificacion_cursos;

CREATE DATABASE sistema_calificacion_cursos
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE sistema_calificacion_cursos;

-- =========================================================
-- TABLA: users
-- =========================================================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    academic_registry VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

-- =========================================================
-- TABLA: courses
-- =========================================================

CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    credits INT NOT NULL,
    semester INT NULL,

    CONSTRAINT chk_course_credits
        CHECK (credits >= 0),

    CONSTRAINT chk_course_semester
        CHECK (semester IS NULL OR semester BETWEEN 1 AND 10)
);

-- =========================================================
-- TABLA: professors
-- =========================================================

CREATE TABLE professors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- TABLA: posts
-- =========================================================

CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    course_id INT NULL,
    professor_id INT NULL,

    content TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_posts_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_posts_course
        FOREIGN KEY (course_id)
        REFERENCES courses(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_posts_professor
        FOREIGN KEY (professor_id)
        REFERENCES professors(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_post_entity
        CHECK (
            (course_id IS NOT NULL AND professor_id IS NULL)
            OR
            (course_id IS NULL AND professor_id IS NOT NULL)
        )
);

-- =========================================================
-- TABLA: comments
-- =========================================================

CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,

    post_id INT NOT NULL,
    user_id INT NOT NULL,

    content TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_comments_post
        FOREIGN KEY (post_id)
        REFERENCES posts(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_comments_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- =========================================================
-- TABLA: approved_courses
-- =========================================================

CREATE TABLE approved_courses (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,
    course_id INT NOT NULL,

    approved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_approved_courses_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_approved_courses_course
        FOREIGN KEY (course_id)
        REFERENCES courses(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_user_course
        UNIQUE (user_id, course_id)
);

-- =========================================================
-- ÍNDICES
-- =========================================================

CREATE INDEX idx_posts_created_at
ON posts(created_at);

CREATE INDEX idx_posts_course
ON posts(course_id);

CREATE INDEX idx_posts_professor
ON posts(professor_id);

CREATE INDEX idx_professors_name
ON professors(full_name);

CREATE INDEX idx_courses_name
ON courses(name);

CREATE INDEX idx_users_academic_registry
ON users(academic_registry);

-- =========================================================
-- DATOS INICIALES: CATEDRÁTICOS
-- =========================================================

INSERT INTO professors (full_name) VALUES
('MANUEL HAROLDO CASTILLO REYNA'),
('SERGIO ARNALDO MENDEZ AGUILAR'),
('EDGAR RENE ORNELIS HOIL'),
('JORGE LUIS ALVAREZ MEJIA'),
('CESAR AUGUSTO FERNANDEZ CACERES'),
('LUIS FERNANDO ESPINO BARRIOS'),
('OTTO AMILCAR RODRIGUEZ ACOSTA'),
('EDGAR RUBEN SABAN RAXON'),
('FREIRY JAVIER GRAMAJO LOPEZ'),
('GABRIEL ALEJANDRO DIAZ LOPEZ'),
('JURGEN ANDONI RAMIREZ RAMÍREZ'),
('PEDRO PABLO HERNANDEZ RAMIREZ'),
('ALLAN ALBERTO MORATAYA GÓMEZ'),
('AIDA ALEJANDRA MANSILLA ORANTES'),
('SEBASTIAN GOMEZ LAVARREDA'),
('MIGUEL ANGEL CANCINOS RENDON'),
('SERGIO LEONEL GOMEZ BRAVO');

-- =========================================================
-- DATOS INICIALES: CURSOS
-- =========================================================

INSERT INTO courses (code, name, credits, semester) VALUES
('0772', 'Estructuras de Datos', 6, 5),
('0777', 'Organización de Lenguajes y Compiladores 1', 6, 5),
('0722', 'Teoría de Sistemas 1', 4, 6),
('0781', 'Organización de Lenguajes y Compiladores 2', 6, 6),
('0281', 'Sistemas Operativos 1', 6, 7),
('0724', 'Teoría de Sistemas 2', 4, 7),
('0774', 'Sistemas de Bases de Datos 1', 5, 7),
('0779', 'Arquitectura de Computadores y Ensambladores 2', 5, 7),
('0970', 'Redes de Computadoras 1', 5, 7),
('0285', 'Sistemas Operativos 2', 4, 8),
('0775', 'Sistemas de Bases de Datos 2', 4, 8),
('0975', 'Redes de Computadoras 2', 4, 8),
('0729', 'Modelación y Simulación 1', 5, 9),
('0972', 'Inteligencia Artificial 1', 7, 9),
('0720', 'Modelación y Simulación 2', 6, 10),
('0968', 'Inteligencia Artificial 2', 5, 10);