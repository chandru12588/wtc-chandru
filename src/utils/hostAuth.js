// Save host + token
export const saveHost = (host, token) => {
  localStorage.setItem("host_user", JSON.stringify(host));
  localStorage.setItem("host_token", token);
};

// Get token for API headers
export const getHostToken = () => {
  return localStorage.getItem("host_token");
};

// Get full host object (your existing function)
export const getHostUser = () => {
  const data = localStorage.getItem("host_user");
  return data ? JSON.parse(data) : null;
};

// ⭐ NEW — alias used in AddListing.jsx
export const getHost = () => {
  return getHostUser(); // re-use your existing function
};

// Logout host
export const logoutHost = () => {
  localStorage.removeItem("host_user");
  localStorage.removeItem("host_token");
};
