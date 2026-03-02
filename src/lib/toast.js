import toast from 'react-hot-toast';

const TOAST_DURATION = 3000;
const MAX_TOASTS = 3;
let toastQueue = [];
let activeToasts = 0;
// Dummy test
const processQueue = () => {
    while (toastQueue.length > 0 && activeToasts < MAX_TOASTS) {
        const { type, message, options } = toastQueue.shift();
        showToast(type, message, options, true);
    }
};

const showToast = (type, message, options = {}, fromQueue = false) => {
    if (!fromQueue && activeToasts >= MAX_TOASTS) {
        toastQueue.push({ type, message, options });
        return;
    }

    activeToasts++;

    const defaultOptions = {
        duration: TOAST_DURATION,
        position: 'top-center',
        ...options,
    };

    const toastId = toast[type]?.(message, defaultOptions) || toast(message, defaultOptions);

    setTimeout(() => {
        activeToasts--;
        processQueue();
    }, defaultOptions.duration);

    return toastId;
};

const toastQueue$ = {
    success: (message, options) => showToast('success', message, {
        icon: '✓',
        style: {
            background: '#10B981',
            color: '#fff',
            fontWeight: '500',
        },
        ...options,
    }),

    error: (message, options) => showToast('error', message, {
        icon: '✕',
        style: {
            background: '#EF4444',
            color: '#fff',
            fontWeight: '500',
        },
        ...options,
    }),

    warning: (message, options) => showToast('custom', message, {
        icon: '⚠',
        style: {
            background: '#F59E0B',
            color: '#fff',
            fontWeight: '500',
        },
        ...options,
    }),

    info: (message, options) => showToast('custom', message, {
        icon: 'ℹ',
        style: {
            background: '#3B82F6',
            color: '#fff',
            fontWeight: '500',
        },
        ...options,
    }),

    loading: (message, options) => toast.loading(message, {
        position: 'top-center',
        ...options,
    }),

    dismiss: (toastId) => toast.dismiss(toastId),

    dismissAll: () => {
        toast.dismiss();
        toastQueue = [];
        activeToasts = 0;
    },

    promise: (promise, messages, options) => {
        return toast.promise(promise, messages, {
            position: 'top-center',
            ...options,
        });
    },
};

export default toastQueue$;