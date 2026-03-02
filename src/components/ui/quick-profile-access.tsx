import React from 'react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const QuickProfileAccess = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleQuickAccess = () => {
    navigate('/account/profile');
  };

  return (
    <Button 
      onClick={handleQuickAccess}
      variant="outline" 
      className="fixed bottom-20 md:bottom-4 right-4 z-50 shadow-lg"
    >
      <User className="h-4 w-4 mr-2" />
      {user ? 'My Profile' : 'Quick Profile Access'}
    </Button>
  );
};

export default QuickProfileAccess;