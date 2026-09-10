require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes =
  require('./routes/auth.routes');

const app = express();

const PORT =
  process.env.PORT || 3000;

const courseRoutes =
  require('./routes/course.routes');

const professorRoutes =
  require('./routes/professor.routes');

const postRoutes =
  require('./routes/post.routes');

const commentRoutes =
  require('./routes/comment.routes');

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message:
      'API Sistema de Calificación de Cursos funcionando'
  });
});

app.use(
  '/api/auth',
  authRoutes
);

app.use(
  '/api/courses',
  courseRoutes
);

app.use(
  '/api/professors',
  professorRoutes
);

app.use(
  '/api/posts',
  postRoutes
);

app.use(
  '/api',
  commentRoutes
);

app.use((req, res) => {
  res.status(404).json({
    message: 'Ruta no encontrada'
  });
});

app.listen(PORT, () => {
  console.log(
    `Servidor ejecutándose en http://localhost:${PORT}`
  );
});