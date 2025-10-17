import { motion } from 'framer-motion';
import ResourceStats from './ResourceStats.jsx';
import ActivityTimeline from './ActivityTimeline.jsx';
import CommunityTips from './CommunityTips.jsx';
import MLRecommendations from './MLRecommendations.jsx';
import DashboardTopBar from './DashboardTopBar.jsx';
import DashboardFooter from './DashboardFooter.jsx';
import ProviderBookings from './ProviderBookings.jsx';
import ProviderStats from './ProviderStats.jsx';
import { Link } from 'react-router-dom';
import { FiPlus, FiBarChart3, FiCalendar } from 'react-icons/fi';

export default function ResourceProviderDashboard() {
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
      icon: FiPlus,
      label: 'Add Resource',
      href: '/resources/new',
      color: 'emerald',
    },
    {
      icon: FiBarChart3,
      label: 'My Resources',
      href: '/resources',
      color: 'blue',
    },
    {
      icon: FiCalendar,
      label: 'Bookings',
      href: '/bookings',
      color: 'purple',
    },
  ];

  return (
    <main className="page space-y-4 sm:space-y-6">
      <DashboardTopBar />

      {/* Quick Actions */}
      <motion.div
        className="grid gap-2 sm:gap-4 grid-cols-1 sm:grid-cols-3"
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
            <motion.div
              key={action.href}
              whileHover={{ y: -4, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={action.href}
                className="card hover:shadow-lg transition-all h-full"
              >
                <div className="card-body flex items-center gap-3 sm:gap-4">
                  <div className={`bg-gradient-to-br ${colors[action.color]} p-2 sm:p-3 rounded-lg text-white flex-shrink-0`}>
                    <Icon className="text-lg sm:text-xl" />
                  </div>
                  <p className="font-medium text-gray-900 text-sm sm:text-base">{action.label}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
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
          <ProviderStats />
          <ProviderBookings />
        </motion.div>

        {/* Right Column - Sidebar (Stacks on mobile) */}
        <motion.div className="space-y-4 sm:space-y-6 lg:col-span-1" variants={itemVariants}>
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
