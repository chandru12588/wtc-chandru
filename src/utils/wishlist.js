// Save wishlist to localStorage
export const saveWishlist = (list) => {
  localStorage.setItem("wishlist", JSON.stringify(list));
};

// Load wishlist
export const loadWishlist = () => {
  const data = localStorage.getItem("wishlist");
  return data ? JSON.parse(data) : [];
};
