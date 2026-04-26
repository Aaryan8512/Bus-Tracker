import { motion } from 'framer-motion';
import { Bus } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]">
      {/* Road */}
      <div className="relative w-full max-w-sm h-1.5 bg-gray-200 rounded-full mb-12 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 to-green-600 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity }}
        />
        {/* Moving bus */}
        <motion.div
          className="absolute -top-4 flex items-center justify-center"
          initial={{ left: '-10%' }}
          animate={{ left: '105%' }}
          transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity }}
        >
          <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-200">
            <Bus className="w-5 h-5 text-white" />
          </div>
        </motion.div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
          <Bus className="w-4 h-4 text-white" />
        </div>
        <span className="text-2xl font-bold text-gray-900">Busly</span>
      </div>
      <p className="text-sm text-gray-500">Loading your transit experience...</p>
    </div>
  );
}
