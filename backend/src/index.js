const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const authModule = require('./routes/auth.routes');
const publicacionesModule = require('./routes/publicaciones.routes');
const perfilesModule = require('./routes/perfiles.routes');

const authRoutes = authModule.default || authModule;
const publicacionesRoutes =
  publicacionesModule.default || publicacionesModule;
const perfilesRoutes =
  perfilesModule.default || perfilesModule;

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'API Sistema de Calificación de Cursos funcionando'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/publicaciones', publicacionesRoutes);
app.use('/api/perfiles', perfilesRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Servidor ejecutándose en http://localhost:${PORT}`
  );
});