// api/customer/tracking.js
import axios from 'axios';

export const getTrackingInfo = async ({ type, value }) => {
    const endpoint = type === 'order_id' 
        ? `/api/shiprocket/courier/track?order_id=${value}` 
        : `/api/shiprocket/courier/track/awb/${value}`;

    const response = await axios.get(endpoint);
    return response.data;
};