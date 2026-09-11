import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import RecoverPassword from './pages/RecoverPassword';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import Profile from './pages/Profile';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recover-password" element={<RecoverPassword />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/posts/new"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />

        <Route
          path="/posts/:id"
          element={
            <ProtectedRoute>
              <PostDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/:academicRegistry"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;