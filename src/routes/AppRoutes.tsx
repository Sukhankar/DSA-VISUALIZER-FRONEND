import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { AlgorithmsPage } from '../pages/AlgorithmsPage';
import { AlgorithmDetailPage } from '../pages/AlgorithmDetailPage';
import { VisualizationPage } from '../pages/VisualizationPage';
import { ProblemsExplorerPage } from '../pages/ProblemsExplorerPage';
import { ProblemDetailPage } from '../pages/ProblemDetailPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { FavoritesPage } from '../pages/FavoritesPage';
import { AdminPage } from '../pages/AdminPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

import { ProfilePage } from '../pages/ProfilePage';
import { AchievementsPage } from '../pages/AchievementsPage';
import { BadgesPage } from '../pages/BadgesPage';
import { PracticeArenaPage } from '../pages/PracticeArenaPage';
import { PracticeSessionPage } from '../pages/PracticeSessionPage';

import { RoadmapPage } from '../pages/RoadmapPage';
import { AssessmentPage } from '../pages/AssessmentPage';
import { TopicPathPage } from '../pages/TopicPathPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/algorithms" element={<AlgorithmsPage />} />
      <Route path="/algorithms/:slug" element={<AlgorithmDetailPage />} />
      <Route path="/visualize/:slug" element={<VisualizationPage />} />
      <Route path="/problems" element={<ProblemsExplorerPage />} />
      <Route path="/problems/:slug" element={<ProblemDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes (Authenticated Users) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/roadmap/assessment" element={<AssessmentPage />} />
        <Route path="/onboarding" element={<AssessmentPage />} />
        <Route path="/roadmap/topics/:slug" element={<TopicPathPage />} />
        <Route path="/roadmap/:moduleSlug" element={<TopicPathPage />} />

        <Route path="/practice" element={<PracticeArenaPage />} />
        <Route path="/practice/session/:id" element={<PracticeSessionPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/badges" element={<BadgesPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
      </Route>


      {/* Role-Guarded Routes (ROLE_ADMIN Users) */}
      <Route element={<ProtectedRoute requiredRole="ROLE_ADMIN" />}>
        <Route path="/admin" element={<AdminPage />} />
      </Route>

      {/* 404 Catch-All Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
