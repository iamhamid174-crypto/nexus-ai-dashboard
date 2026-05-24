import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import DashboardLayout from './components/layout/DashboardLayout';
import AuthLayout from './components/layout/AuthLayout';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

import DashboardPage from './pages/dashboard/DashboardPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import ProjectsPage from './pages/projects/ProjectsPage';
import BillingPage from './pages/billing/BillingPage';
import ProfilePage from './pages/profile/ProfilePage';
import SettingsPage from './pages/settings/SettingsPage';

import ContentGeneratorPage from './pages/ai-tools/ContentGeneratorPage';
import EmailGeneratorPage from './pages/ai-tools/EmailGeneratorPage';
import SocialMediaPage from './pages/ai-tools/SocialMediaPage';
import CodeAssistantPage from './pages/ai-tools/CodeAssistantPage';
import ImagePromptPage from './pages/ai-tools/ImagePromptPage';

import ErrorPage from './components/common/ErrorPage';
import { selectTheme } from './store/slices/themeSlice';
import { selectIsAuthenticated } from './store/slices/authSlice';

/* ─── Protected Route ─────────────────────────────────────────── */
function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  return children;
}

/* ─── Public Route (redirect if already logged in) ────────────── */
function PublicRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

/* ─── App ─────────────────────────────────────────────────────── */
export default function App() {
  const theme = useSelector(selectTheme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Auth routes */}
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <AuthLayout />
          </PublicRoute>
        }
      >
        <Route index element={<Navigate to="/auth/login" replace />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Protected dashboard routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />

        {/* AI Tools */}
        <Route path="ai/content" element={<ContentGeneratorPage />} />
        <Route path="ai/email" element={<EmailGeneratorPage />} />
        <Route path="ai/social" element={<SocialMediaPage />} />
        <Route path="ai/code" element={<CodeAssistantPage />} />
        <Route path="ai/image-prompt" element={<ImagePromptPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<ErrorPage code={404} message="Page not found" />} />
    </Routes>
  );
}
