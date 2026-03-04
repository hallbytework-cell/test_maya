import axios from 'axios';

// Proxy all API requests to the backend
export default async (req, res) => {
  const { path = [] } = req.query;
  const pathname = path.join('/');
  
  // Get the backend URL from environment or hardcode it
  const backendUrl = process.env.REACT_APP_API_URL || 'https://mayavriksh.in/api';
  const targetUrl = `${backendUrl}/${pathname}`;

  // Forward query string
  const queryString = Object.keys(req.query)
    .filter(key => key !== 'path')
    .reduce((acc, key) => {
      acc[key] = req.query[key];
      return acc;
    }, {});

  try {
    // Get the request method, headers, and body
    const config = {
      method: req.method,
      url: targetUrl,
      params: queryString,
      headers: {
        // Forward relevant headers but exclude host headers
        'Content-Type': req.headers['content-type'] || 'application/json',
        'User-Agent': req.headers['user-agent'],
        // Forward auth headers if present
        ...(req.headers.authorization && { authorization: req.headers.authorization }),
        ...(req.headers.cookie && { cookie: req.headers.cookie }),
      },
      // Forward body for POST/PUT/PATCH
      ...(req.method !== 'GET' && req.method !== 'HEAD' && { data: req.body }),
      // Allow cookies
      withCredentials: true,
    };

    // Make the request to the backend
    const response = await axios(config);

    // Forward response headers
    if (response.headers['set-cookie']) {
      res.setHeader('set-cookie', response.headers['set-cookie']);
    }
    if (response.headers['content-type']) {
      res.setHeader('content-type', response.headers['content-type']);
    }

    // Forward the response
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`Proxy error: ${req.method} ${targetUrl}`, error.message);
    
    // If the backend returned an error response, forward it
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      // Otherwise return a server error
      res.status(500).json({
        error: 'Proxy error',
        message: error.message,
      });
    }
  }
};
