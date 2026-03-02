import React from 'react';
import * as Sentry from '@sentry/react';
import { AlertCircle } from 'lucide-react';
import logger from '@/lib/logger';
import { toast } from 'react-hot-toast';

export default function SentryTestButton() {
  const handleTestError = () => {
    try {
      logger.info('Sending test error to Sentry', { type: 'test_verification' });
      throw new Error('This is your first Sentry test error - verification that error tracking is working!');
    } catch (error) {
      Sentry.captureException(error, { 
        tags: { isTestEvent: true },
        contexts: { 
          custom: { 
            test_type: 'manual_verification',
            timestamp: new Date().toISOString()
          } 
        }
      });
      logger.error('Test error sent to Sentry', error);
      toast.success('Test error sent! Check Sentry dashboard for details.');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleTestError}
        className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors text-sm"
        title="Send a test error to Sentry for verification (dev only)"
      >
        <AlertCircle className="w-4 h-4" />
        Test Sentry
      </button>
      <p className="text-xs text-gray-600 bg-white px-3 py-2 rounded border border-gray-200">
        Dev mode: Sentry disabled
      </p>
    </div>
  );
}
