export async function FetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('token');

  if (!token) {
    redirectToSignIn();
    return null;
  }


  const userId = getUserIdFromToken(token);
  if (!userId) {
    redirectToSignIn();
    return null;
  }

  const isValid = await validateTokenWithServer(token);
  if (!isValid) {
    redirectToSignIn();
    return null;
  }

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'user-id': userId.toString()
  };

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem('token');
    redirectToSignIn();
    return null;
  }

  return res;
}

function getUserIdFromToken(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.id; 
  } catch (err) {
    console.error('Failed to decode token:', err);
    return null;
  }
}

async function validateTokenWithServer(token) {
  try {
    const res = await fetch('http://localhost:12345/api/users/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.ok;
  } catch (err) {
    console.error('Token validation failed:', err);
    return false;
  }
}

function redirectToSignIn() {
  localStorage.removeItem('token');
  window.location.href = '/signin';
}
