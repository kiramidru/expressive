export function loadCart() {
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}
