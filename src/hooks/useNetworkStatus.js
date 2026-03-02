import { useState, useEffect, useCallback } from 'react';

const useNetworkStatus = () => {
    const [isOnline, setIsOnline] = useState(
        typeof navigator !== 'undefined' ? navigator.onLine : true
    );
    const [wasOffline, setWasOffline] = useState(false);
    const [connectionType, setConnectionType] = useState(null);
    const [effectiveType, setEffectiveType] = useState(null);

    const updateConnectionInfo = useCallback(() => {
        if (typeof navigator !== 'undefined' && navigator.connection) {
            setConnectionType(navigator.connection.type || null);
            setEffectiveType(navigator.connection.effectiveType || null);
        }
    }, []);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            if (wasOffline) {
                setWasOffline(false);
            }
            updateConnectionInfo();
        };

        const handleOffline = () => {
            setIsOnline(false);
            setWasOffline(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        if (navigator.connection) {
            navigator.connection.addEventListener('change', updateConnectionInfo);
        }

        updateConnectionInfo();

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            if (navigator.connection) {
                navigator.connection.removeEventListener('change', updateConnectionInfo);
            }
        };
    }, [wasOffline, updateConnectionInfo]);

    const isSlowConnection = effectiveType === 'slow-2g' || effectiveType === '2g';

    return {
        isOnline,
        wasOffline,
        connectionType,
        effectiveType,
        isSlowConnection,
    };
};

export default useNetworkStatus;