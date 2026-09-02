import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { LandingPage } from './components/landing/LandingPage';
import { NewsFeed } from './components/feed/NewsFeed';
import { ExplorePage } from './components/explore/ExplorePage';
import { StartupDetailsPage } from './components/startup/StartupDetailsPage';
import { FounderDashboard } from './components/dashboards/FounderDashboard';
import { InvestorDashboard } from './components/dashboards/InvestorDashboard';
import { MentorDashboard } from './components/dashboards/MentorDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { MessagesPage } from './components/messages/MessagesPage';
import { ProfilePage } from './components/profile/ProfilePage';
import {
  AboutPage,
  FeaturesPage,
  HelpCenterPage,
  PrivacyTermsPage
} from './components/static/StaticPages';
import { ExpressInterestModal } from './components/startup/ExpressInterestModal';
import { MentorRequestModal } from './components/startup/MentorRequestModal';
import { CreateStartupModal } from './components/startup/CreateStartupModal';
import { CreatePostModal } from './components/feed/CreatePostModal';
import { ArchitectureDocsModal } from './components/modals/ArchitectureDocsModal';
import { AuthModal } from './components/modals/AuthModal';
import { LoginPage } from './components/auth/LoginPage';
import { ToastContainer } from './components/common/ToastContainer';
import { AudioCallModal } from './components/common/AudioCallModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';

const AppContent: React.FC = () => {
  const {
    isLoggedIn,
    activeView,
    selectedStartupId,
    interestModalStartupId,
    setInterestModalStartupId,
    mentorModalStartupId,
    setMentorModalStartupId,
    isCreateStartupOpen,
    setIsCreateStartupOpen,
    startups
  } = useApp();

  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isArchDocsOpen, setIsArchDocsOpen] = useState(false);

  // If user is not logged in, enforce authentication screen. No member interface before login.
  if (!isLoggedIn) {
    return (
      <>
        <LoginPage />
        <ToastContainer />
      </>
    );
  }

  const selectedStartup = startups.find(s => s.id === selectedStartupId);
  const interestStartup = startups.find(s => s.id === interestModalStartupId);
  const mentorStartup = startups.find(s => s.id === mentorModalStartupId);

  const renderActiveView = () => {
    switch (activeView) {
      case 'landing':
        return <LandingPage />;
      case 'feed':
        return <NewsFeed onOpenCreatePost={() => setIsCreatePostOpen(true)} />;
      case 'explore':
        return <ExplorePage />;
      case 'startup-details':
        return <StartupDetailsPage />;
      case 'founder-dashboard':
        return <FounderDashboard />;
      case 'investor-dashboard':
        return <InvestorDashboard />;
      case 'mentor-dashboard':
        return <MentorDashboard />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'messages':
        return <MessagesPage />;
      case 'profile':
        return <ProfilePage />;
      case 'about':
        return <AboutPage />;
      case 'features':
        return <FeaturesPage />;
      case 'help':
        return <HelpCenterPage />;
      case 'terms':
        return <PrivacyTermsPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F5F9] dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        onOpenCreatePost={() => setIsCreatePostOpen(true)}
        onOpenCreateStartup={() => setIsCreateStartupOpen(true)}
        onOpenArchitectureDocs={() => setIsArchDocsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">{renderActiveView()}</main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      {interestStartup && (
        <ExpressInterestModal
          isOpen={!!interestModalStartupId}
          onClose={() => setInterestModalStartupId(null)}
          startup={interestStartup}
        />
      )}

      {mentorStartup && (
        <MentorRequestModal
          isOpen={!!mentorModalStartupId}
          onClose={() => setMentorModalStartupId(null)}
          startup={mentorStartup}
        />
      )}

      <CreateStartupModal
        isOpen={isCreateStartupOpen}
        onClose={() => setIsCreateStartupOpen(false)}
      />

      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />

      <ArchitectureDocsModal
        isOpen={isArchDocsOpen}
        onClose={() => setIsArchDocsOpen(false)}
      />

      <AuthModal />

      {/* Global Interactive Overlays */}
      <AudioCallModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
