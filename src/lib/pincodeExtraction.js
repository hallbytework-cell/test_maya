/**
 * Utility to extract pincode/postal code from coordinates using reverse geocoding
 * Uses OpenStreetMap Nominatim API (free, no API key required)
 */

/**
 * Extract pincode from latitude and longitude
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {Promise<string>} - The extracted pincode
 */
export async function extractPincodeFromCoordinates(latitude, longitude) {
  try {
    // Use OpenStreetMap Nominatim API for reverse geocoding
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'PlantEcommerce-LocationFinder'
      }
    });

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract postal code from the address
    if (data.address) {
      // Try different possible postal code fields
      const postalCode = 
        data.address.postcode || 
        data.address.postal_code || 
        data.address.zip_code ||
        null;

      if (postalCode) {
        // Return only numeric part (for Indian pincodes which are 6 digits)
        const numericPostalCode = postalCode.replace(/\D/g, '');
        
        if (numericPostalCode.length === 6) {
          console.log('✅ Pincode extracted from coordinates:', {
            latitude,
            longitude,
            pincode: numericPostalCode,
            area: data.address.city || data.address.town || data.address.village || 'Unknown'
          });
          return numericPostalCode;
        } else if (numericPostalCode.length > 0) {
          // If we have a postal code but not 6 digits, still return it
          console.warn('⚠️ Postal code found but not 6 digits:', numericPostalCode, 'Returning as is');
          return numericPostalCode.substring(0, 6);
        }
      }
    }

    console.warn('⚠️ No postal code found in geocoding response:', data.address);
    throw new Error('Postal code not found in location data');
  } catch (error) {
    console.error('❌ Error extracting pincode:', error.message);
    throw error;
  }
}

/**
 * Get detailed location info including pincode
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {Promise<object>} - Location details including pincode, city, area
 */
export async function getLocationDetails(latitude, longitude) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'PlantEcommerce-LocationFinder'
      }
    });

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.address) {
      const postalCode = 
        data.address.postcode || 
        data.address.postal_code || 
        data.address.zip_code ||
        '';

      const numericPostalCode = postalCode.replace(/\D/g, '').substring(0, 6);

      return {
        pincode: numericPostalCode || '',
        city: data.address.city || data.address.town || data.address.village || '',
        state: data.address.state || '',
        country: data.address.country || '',
        displayName: data.display_name || '',
        latitude,
        longitude
      };
    }

    throw new Error('Address data not found');
  } catch (error) {
    console.error('❌ Error getting location details:', error.message);
    throw error;
  }
}
