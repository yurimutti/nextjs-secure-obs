const getUrlFromHost = (host: string | null, path?: `/${string}`) => {
  if (host?.includes('localhost')) {
    return `http://${host}${path}`;
  }

  return `https://${host}${path}`;
};

const getRequestUrl = async (path: `/${string}`) => {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || '3000';
    return { url: `http://localhost:${port}${path}` };
  }

  let host = null;
  let cookie;

  if (typeof window === 'undefined') {
    const { headers } = await import('next/headers');
    const headersList = await headers();
    host = headersList.get('host') || 'localhost:3000';
    cookie = headersList.get('cookie');
  }

  return {
    url: host ? getUrlFromHost(host, path) : path,
    headers: cookie ? { cookie } : undefined,
  };
};

export { getRequestUrl };