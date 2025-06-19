import { FetchWithAuth } from '../../FetchWithAuth/FetchWithAuth';
import { buildApiUrl } from '../../../config/api';

export const getUserDetails = async (userId) => {
  try {
    const res = await FetchWithAuth(buildApiUrl(`/api/users/${userId}`));
    if (!res.ok) throw new Error('User not found');
    const userData = await res.json();
    return userData;
  } catch (e) {
    console.error('Failed to get user details:', e);
    return null;
  }
};