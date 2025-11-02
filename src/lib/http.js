const API_URL = import.meta.env.VITE_API_URL;

export async function fetcher(url, options = {}) {
  const {
    method = 'GET',
    headers: customHeaders = {},
    body,
    ...remainingProps
  } = options;

  const tokenData = JSON.parse(localStorage.getItem('token') ?? '{}');

  const token = tokenData?.state?.token;

  const fetchUrl = `${API_URL}/${url}`;

  const config = {
    method,
    headers: {
      'Content-Type': customHeaders['Content-Type'] ?? 'application/json',
      Authorization: `Bearer ${token}`,

      ...customHeaders,
    },
    ...remainingProps,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(fetchUrl, config);

  if (!response.ok) {
    const text = (await response.text()) || 'Ha ocurrido un error';
    throw new Error(text);
  }

  return await response.json();
}
