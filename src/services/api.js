// src/services/api.js
const BASE = process.env.REACT_APP_API_URL || "";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}/api${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const api = {
  getProducts: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/products${q ? "?" + q : ""}`);
  },
  getProduct: (id) => request(`/products/${id}`),
  getCategories: () => request("/categories"),
  placeOrder: (order) =>
    request("/orders", { method: "POST", body: JSON.stringify(order) }),
};
