import { useEffect, useState } from 'react';
import WeatherCard from '../components/dashboard/WeatherCard.jsx';
import CropHealthChart from '../components/dashboard/CropHealthChart.jsx';
import ResourceStats from '../components/dashboard/ResourceStats.jsx';
import ActivityTimeline from '../components/dashboard/ActivityTimeline.jsx';
import MarketTrends from '../components/dashboard/MarketTrends.jsx';
import CommunityTips from '../components/dashboard/CommunityTips.jsx';
import MLRecommendations from '../components/dashboard/MLRecommendations.jsx';
import DashboardTopBar from '../components/dashboard/DashboardTopBar.jsx';
import DashboardFooter from '../components/dashboard/DashboardFooter.jsx';
import FarmerDashboard from '../components/dashboard/FarmerDashboard.jsx';
import ResourceProviderDashboard from '../components/dashboard/ResourceProviderDashboard.jsx';
import { motion } from 'framer-motion';
import { getAuth } from '../store/authStore.js';
import { getProfile } from '../services/auth.js';

export default function Dashboard() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const auth = getAuth();
        if (auth?.user?.role) {
          setUserRole(auth.user.role);
        } else {
          const profile = await getProfile();
          setUserRole(profile?.role || 'farmer');
        }
      } catch (err) {
        console.error('Role fetch error:', err);
        setUserRole('farmer');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  // Render role-based dashboard if specific role components exist
  if (!loading && userRole === 'resource_provider') {
    return (
      <ResourceProviderDashboard />
    );
  }

  if (!loading && userRole === 'farmer') {
    return (
      <FarmerDashboard />
    );
  }

  // Default dashboard for both roles
  return (
    <main className="page space-y-4 sm:space-y-6">
      <DashboardTopBar />

      {/* Resource Stats - Full Width */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <ResourceStats />
      </motion.div>

      {/* Main Grid - Responsive */}
      <motion.div
        className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Column - Main Content */}
        <motion.div className="space-y-4 sm:space-y-6 lg:col-span-2" variants={itemVariants}>
          <WeatherCard />
          <CropHealthChart />
          <MarketTrends />
        </motion.div>

        {/* Right Column - Sidebar (Stacks on mobile) */}
        <motion.div className="space-y-4 sm:space-y-6 lg:col-span-1" variants={itemVariants}>
          <MLRecommendations />
          <ActivityTimeline />
          <CommunityTips />
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div variants={itemVariants}>
        <DashboardFooter />
      </motion.div>
    </main>
  );
}
