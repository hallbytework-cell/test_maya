// Proxy all API requests to the backend using native fetch
export default async (req, res) => {
  try {
    const { path = [] } = req.query;
    const pathname = path.join('/');
    
    // Build the backend URL
    const backendUrl = 'https://mayavriksh.in/api';
    const queryParams = new URLSearchParams();
    
    // Add all query params except 'path'
    Object.entries(req.query).forEach(([key, value]) => {
      if (key !== 'path') {
        queryParams.append(key, value);
      }
    });

    const url = `${backendUrl}/${pathname}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

    // Build fetch options
    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
        'User-Agent': req.headers['user-agent'] || 'MayaVriksh-Proxy',
      },
    };

    // Forward auth and cookie headers
    if (req.headers.authorization) {
      fetchOptions.headers.authorization = req.headers.authorization;
    }
    if (req.headers.cookie) {
      fetchOptions.headers.cookie = req.headers.cookie;
    }

    // Include body for POST/PUT/PATCH
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    // Make the request
    const response = await fetch(url, fetchOptions);
    const data = await response.json();

    // Set response headers
    res.setHeader('Content-Type', 'application/json');
    if (response.headers.get('set-cookie')) {
      res.setHeader('set-cookie', response.headers.get('set-cookie'));
    }

    // Forward the response
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({
      error: 'Proxy error',
      message: error.message,
    });
  }
};
