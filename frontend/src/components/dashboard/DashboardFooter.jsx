import { motion } from 'framer-motion';
import { FiHeart, FiTwitter, FiFacebook, FiInstagram, FiMail } from 'react-icons/fi';

export default function DashboardFooter() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: 'Support', href: '#support' },
    { label: 'Feedback', href: '#feedback' },
    { label: 'Settings', href: '#settings' },
    { label: 'Privacy', href: '#privacy' },
    { label: 'Terms', href: '#terms' },
    { label: 'About', href: '#about' }
  ];

  const socialLinks = [
    { icon: FiTwitter, href: '#twitter', label: 'Twitter' },
    { icon: FiFacebook, href: '#facebook', label: 'Facebook' },
    { icon: FiInstagram, href: '#instagram', label: 'Instagram' },
    { icon: FiMail, href: '#email', label: 'Email' }
  ];

  return (
    <motion.footer
      data-aos="fade-up"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mt-12 py-8 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-emerald-50"
    >
      <div className="page space-y-6">
        {/* Quick Links */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 sm:gap-6"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="visible"
        >
          {footerLinks.map((link, idx) => (
            <motion.a
              key={link.label}
              href={link.href}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ color: '#27ae60', scale: 1.05 }}
              className="text-xs sm:text-sm text-gray-600 hover:text-emerald-600 transition-colors font-medium"
            >
              {link.label}
            </motion.a>
          ))}
        </motion.div>

        {/* Social Links */}
        <div className="flex justify-center gap-4">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={social.label}
                href={social.href}
                title={social.label}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-emerald-600 hover:border-emerald-600 transition-all shadow-sm"
              >
                <Icon size={18} />
              </motion.a>
            );
          })}
        </div>

        {/* Copyright & Credits */}
        <motion.div
          className="text-center text-xs sm:text-sm text-gray-600 space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="flex items-center justify-center gap-1">
            Made with <FiHeart size={14} className="text-red-500" /> by AgriGo Team
          </p>
          <p>
            © {currentYear} AgriGo 2.0 • Agricultural Resource Sharing Platform
          </p>
          <p className="text-gray-500">
            Empowering farmers and resource providers to work together
          </p>
        </motion.div>

        {/* Version Info */}
        <motion.div
          className="text-center text-xs text-gray-500 border-t border-gray-200 pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p>Version 2.0 • Last Updated: {new Date().toLocaleDateString()}</p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
