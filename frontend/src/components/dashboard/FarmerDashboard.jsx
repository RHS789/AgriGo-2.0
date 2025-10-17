import { motion } from 'framer-motion';
import WeatherCard from './WeatherCard.jsx';
import CropHealthChart from './CropHealthChart.jsx';
import ResourceStats from './ResourceStats.jsx';
import ActivityTimeline from './ActivityTimeline.jsx';
import MarketTrends from './MarketTrends.jsx';
import MLRecommendations from './MLRecommendations.jsx';
import CommunityTips from './CommunityTips.jsx';
import DashboardTopBar from './DashboardTopBar.jsx';
import DashboardFooter from './DashboardFooter.jsx';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiCalendar, FiMessageSquare } from 'react-icons/fi';

export default function FarmerDashboard() {
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

  const quickActions = [
    {
      icon: FiShoppingCart,
      label: 'Browse Resources',
      href: '/resources',
      color: 'emerald',
    },
    {
      icon: FiCalendar,
      label: 'My Bookings',
      href: '/bookings',
      color: 'blue',
    },
    {
      icon: FiMessageSquare,
      label: 'Messages',
      href: '/bookings',
      color: 'purple',
    },
  ];

  return (
    <main className="page space-y-6">
      <DashboardTopBar />

      {/* Quick Actions */}
      <motion.div
        className="grid gap-4 sm:grid-cols-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {quickActions.map((action) => {
          const Icon = action.icon;
          const colors = {
            emerald: 'from-emerald-400 to-emerald-600',
            blue: 'from-blue-400 to-blue-600',
            purple: 'from-purple-400 to-purple-600',
          };
          return (
            <Link
              key={action.href}
              to={action.href}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="card-body flex items-center gap-4">
                <div className={`bg-gradient-to-br ${colors[action.color]} p-3 rounded-lg text-white`}>
                  <Icon className="text-xl" />
                </div>
                <p className="font-medium text-gray-900">{action.label}</p>
              </div>
            </Link>
          );
        })}
      </motion.div>

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
