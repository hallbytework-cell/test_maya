import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const TestProfileButton = () => {
  const navigate = useNavigate();

  return (
    <Button 
      onClick={() => navigate('/account/profile')}
      className="fixed top-20 left-4 z-50 bg-red-500 hover:bg-red-600 text-white"
    >
      TEST PROFILE PAGE
    </Button>
  );
};

export default TestProfileButton;