import React from 'react';
import { useParams } from 'react-router-dom';

// Existing Imports
import AirPurifyingBedroomPlants from '@/pages/seo/AirPurifyingBedroomPlants';
import LowLightIndoorPlants from '@/pages/seo/LowLightIndoorPlants';
import LuckyBambooPlants from '@/pages/seo/LuckyBambooPlants';
import BestSellers from '@/pages/seo/BestSellers';
import GiftPlants from '@/pages/seo/GiftPlants';
import AirPurifyingPlants from '@/pages/seo/AirPurifyingPlants';
import VastuPlants from '@/pages/seo/VastuPlants';

// New Imports
import NewLaunched from '@/pages/seo/NewLaunched';
import Featured from '@/pages/seo/Featured';
import Trending from '@/pages/seo/Trending';

import NotFound from '@/pages/NotFound';
import EasyCarePlants from '@/pages/seo/EasyCarePlants';
import SunLovingPlants from '@/pages/seo/SunLovingPlants';

const PlantCategoryManager = () => {
  const { plantType } = useParams();

  const componentMapping = {
    // Existing Mappings
    'air-purifying-bedroom': AirPurifyingBedroomPlants,
    'low-light-indoor': LowLightIndoorPlants,
    'lucky-bamboo': LuckyBambooPlants,
    'best-sellers': BestSellers,
    'gift-plants': GiftPlants,
    'air-purifying': AirPurifyingPlants,
    'vastu-plants': VastuPlants,
    'easy-care-plants': EasyCarePlants,
    'sun-loving-plants': SunLovingPlants,

    // New Mappings
    'new-launched': NewLaunched,
    'featured': Featured,
    'trending': Trending,
  };

  const SelectedComponent = componentMapping[plantType];

  if (!SelectedComponent) {
    return <NotFound />;
  }

  return <SelectedComponent />;
};

export default PlantCategoryManager;