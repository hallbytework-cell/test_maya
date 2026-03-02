import { WifiOff, Wifi, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useNetworkStatus from '@/hooks/useNetworkStatus';

const OfflineBanner = () => {
    const { isOnline, wasOffline, isSlowConnection } = useNetworkStatus();

    return (
        <AnimatePresence>
            {!isOnline && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    className="fixed top-0 left-0 right-0 z-[9999] bg-red-600 text-white py-3 px-4 shadow-lg"
                >
                    <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
                        <WifiOff className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-medium">
                            You're offline. Some features may not work properly.
                        </span>
                    </div>
                </motion.div>
            )}

            {isOnline && wasOffline && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ delay: 0.2 }}
                    className="fixed top-0 left-0 right-0 z-[9999] bg-green-600 text-white py-3 px-4 shadow-lg"
                >
                    <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
                        <Wifi className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-medium">
                            You're back online!
                        </span>
                    </div>
                </motion.div>
            )}

            {isOnline && isSlowConnection && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    className="fixed top-0 left-0 right-0 z-[9999] bg-amber-500 text-white py-2 px-4 shadow-lg"
                >
                    <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        <span className="text-xs font-medium">
                            Slow connection detected. Some features may load slowly.
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OfflineBanner;