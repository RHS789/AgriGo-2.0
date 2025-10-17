import WeatherCard from '../components/dashboard/WeatherCard.jsx';
import CropHealthChart from '../components/dashboard/CropHealthChart.jsx';
import ResourceStats from '../components/dashboard/ResourceStats.jsx';
import ActivityTimeline from '../components/dashboard/ActivityTimeline.jsx';
import MarketTrends from '../components/dashboard/MarketTrends.jsx';
import CommunityTips from '../components/dashboard/CommunityTips.jsx';
import MLRecommendations from '../components/dashboard/MLRecommendations.jsx';
import DashboardTopBar from '../components/dashboard/DashboardTopBar.jsx';
import DashboardFooter from '../components/dashboard/DashboardFooter.jsx';
import { motion } from 'framer-motion';

export default function Dashboard() {
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

  return (
    <main className="page space-y-6">
      <DashboardTopBar />

      <motion.div
        className="grid gap-6 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Column - Main Content */}
        <motion.div className="space-y-6 lg:col-span-2" variants={itemVariants}>
          <WeatherCard />
          <CropHealthChart />
          <MarketTrends />
        </motion.div>

        {/* Right Column - Sidebar */}
        <motion.div className="space-y-6" variants={itemVariants}>
          <ResourceStats />
          <MLRecommendations />
          <ActivityTimeline />
          <CommunityTips />
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DashboardFooter />
      </motion.div>
    </main>
  );
}
