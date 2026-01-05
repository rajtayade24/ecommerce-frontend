import { api } from "./api";


// GET /products
//   ?search=
//   &category=dry-fruits
//   &isOrganic=true
//   &isFeatured=true
//   &sort=new
//   &page=2
//   &size=10
// Get categories with pagination
export const getProducts = async (page = 0, size = 1, filter = {}) => {
  const params = { page, size, };

  if (filter.search) params.search = filter.search;
  if (filter.category) params.category = filter.category;
  if (filter.isOrganic !== null && filter.isOrganic !== undefined) params.isOrganic = filter.isOrganic;
  if (filter.isFeatured !== null && filter.isFeatured !== undefined) params.isFeatured = filter.isFeatured;
  if (filter.sort) params.sort = filter.sort;

  try {
    // const response = await api.get(`/products?page=${page}&size=${size}&isOrganic=${isOrganic}`, { param: { page, size } }); console.log("products", response);
    const response = await api.get("/products", { params: params }); console.log("\n\nproducts: ", response);
    // Backend should return: { content: [...], number, totalPages, totalElements, size }
    return response.data;
  } catch (err) {
    const error = err.response?.data?.message || err.response?.data || err.message || "getproduct failed";
    throw new Error(error);
  };
}

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`); console.log(response.data);
    return response.data;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.message ||
      "Errror to get product";
    throw new Error(message);
  }
}

export const getCategories = async (page = 0, size = 2) => {
  try {  /// expects query params inside config.params
    const response = await api.get("/categories", {
      params: { page, size }      // <- correct place for query params
    });
    console.log("categories", response);
    return response.data;
  } catch (err) {
    const error = err.response?.data?.message || err.response?.data || err.message || "getCategories failed";
    throw new Error(error);
  }
};

export const getAllCategories = async () => {
  try {
    const response = await api.get("/categories/all"); console.log("all categories", response);
    return response.data;
  } catch (err) {
    const error = err.response?.data?.message || err.response?.data || err.message || "getCategories failed"; console.log(error);
    throw new Error(error);
  }
}


export const addToCart = async (dto) => {
  try {
    console.log(dto);
    const response = await api.post("/carts", dto);
    console.log(response.data);

    return response.data; // return ONLY the CartItemDto
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.message ||
      "Add to cart failed";

    throw new Error(message);  // IMPORTANT
  }
};
export const getCarts = async (page = 0, size = 10) => {
  try {
    const response = await api.get("/carts", { params: { page, size } }); console.log("cart", response);
    return response.data;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.message ||
      " getcart failed";

    throw new Error(message);  // IMPORTANT
  }
};

export const removeFromCart = async (id) => {
  try {
    const res = await api.delete(`/carts/${id}`);
    return res.data;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.message ||
      "remove to cart failed";

    throw new Error(message);  // IMPORTANT
  }
};

export const updateCartQuantity = async (id, quantity) => {
  const res = await api.put(`/carts/${id}`, { quantity }); console.log("update cart: ", res);
  return res.data;
}
export const clearCart = async () => {
  const res = await api.delete(`/carts/clear`); console.log("clear cart: ", res);
  return res.data;
}

export const getAllCarts = async () => {
  try {
    const response = await api.get("/carts/count"); console.log("carts", response);
    return response.data;
  } catch (err) {
    const error =
      err.response?.data?.message ||
      err.message ||
      "getproduct failed";
    throw new Error(error);  // IMPORTANT
  }
};

export const getCartItems = async (items) => {
  console.log(items);
  const response = await api.post("/orders/preview", { items }); console.log("orders preview: ", response);
  return response.data;
}

export const postOrder = async (orderRequest) => {
  try {
    console.log(orderRequest);
    const response = await api.post("/orders", orderRequest); console.log("post order", response);
    return response.data
  }
  catch (err) {
    const error =
      err.response?.data?.message ||
      err.message ||
      "getproduct failed";

    throw new Error(error);  // IMPORTANT
  }
}

export const verifyPayment = (sessionId) => {
  return api
    .get(`/orders/verify`, {
      params: { sessionId },
    })
    .then(res => res.data);
};


export const getOrders = async (pageParam, PAGE_SIZE) => {
  const params = {
    page: pageParam,
    size: PAGE_SIZE,
  }
  try {
    const response = await api.get("/orders", { params: params }); console.log("get order", response);
    return response.data
  }
  catch (err) {
    const error =
      err.response?.data?.message ||
      err.message ||
      "getproduct failed";

    throw new Error(error);  // IMPORTANT
  }
}

export const cancelOrder = async (orderId) => {
  // I used POST so we can keep REST idempotent semantics on server side.
  const res = await api.post(`/orders/${orderId}/cancel`);
  return res.data;
};

export const getSearchSuggestions = async (q, limit = 6) => {
  if (!q?.trim()) return [];

  const res = await api.get("/search/suggestions", { params: { q, limit } });
  return res.data; // string[]
};
