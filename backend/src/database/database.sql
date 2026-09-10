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