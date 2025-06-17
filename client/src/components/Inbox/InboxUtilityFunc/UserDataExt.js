import { FetchWithAuth } from '../../FetchWithAuth/FetchWithAuth';


export const getUserDetails = async (userId) => {
  try {
    const res = await FetchWithAuth('http://localhost:12345/api/users/me');
    if (!res.ok) throw new Error('User not found');
    const userData = await res.json();
    return userData;
  } catch (e) {
    console.error('Failed to get user details:', e);
    return null;
  }
};