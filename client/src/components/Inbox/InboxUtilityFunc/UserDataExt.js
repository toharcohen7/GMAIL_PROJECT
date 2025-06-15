export const getUserDetails = async (userId) => {
  try {
    const res = await fetch(`http://localhost:12345/api/users/${userId}`);
    if (!res.ok) throw new Error('User not found');
    const userData = await res.json();
    return userData;
  } catch (e) {
    console.error('Failed to get user details:', e);
    return null;
  }
};