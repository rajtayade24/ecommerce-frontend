import { api } from "@/service/api";
import { extractError } from "@/utils/extractError";

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
    console.log("product filter ", params);
    // const response = await api.get(`/products?page=${page}&size=${size}&isOrganic=${isOrganic}`, { param: { page, size } }); console.log("products", response);
    const response = await api.get("/products", { params: params }); console.log("\n\nproducts: ", response);
    // Backend should return: { content: [...], number, totalPages, totalElements, size }
    return response.data;
  } catch (err) {
    throw new Error(extractError(err, "getproduct failed"));
  };
}

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`); console.log(response.data);
    return response.data;
  } catch (err) {
    throw new Error(extractError(err, "Errror to get product"));
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
    throw new Error(extractError(err, "getCategories failed"));
  }
};

export const getAllCategories = async () => {
  try {
    const response = await api.get("/categories/all"); console.log("all categories", response);
    return response.data;
  } catch (err) {
    throw new Error(extractError(err, "getAllCategories failed"));
  }
}

export const getCategoryById = async (id) => {
  try {
    const response = await api.get(`/categories/${id}`); console.log("category", response);
    return response.data;
  } catch (err) {
    throw new Error(extractError(err, "getCategories failed"));
  }
}

export const addToCart = async (dto) => {
  try {
    console.log(dto);
    const response = await api.post("/carts", dto);
    console.log(response.data);

    return response.data; // return ONLY the CartItemDto
  } catch (err) {
    throw new Error(extractError(err, "Add to cart failed"));
  }
};
export const getCarts = async (page = 0, size = 10) => {
  try {
    const response = await api.get("/carts", { params: { page, size } }); console.log("cart", response);
    return response.data;
  } catch (err) {
    throw new Error(extractError(err, " getcart failed"));
  }
};

export const removeFromCart = async (id) => {
  try {
    const res = await api.delete(`/carts/${id}`);
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, " remove to cart failed"));
  }
};

export const updateCartQuantity = async (id, quantity) => {
  try {
    const res = await api.put(`/carts/${id}`, { quantity }); console.log("update cart: ", res);
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "update cart quantity failed"));
  }
}
export const clearCart = async () => {
  try {
    const res = await api.delete(`/carts/clear`); console.log("clear cart: ", res);
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "clear cart failed"));
  }
}

export const getAllCarts = async () => {
  try {
    const response = await api.get("/carts/count"); console.log("carts", response);
    return response.data;
  } catch (err) {
    throw new Error(extractError(err, "getproduct failed"));
  }
};

export const getCartItems = async (items) => {
  try {
    const response = await api.post("/orders/preview", { items }); console.log("orders preview: ", response);
    return response.data;
  } catch (err) {
    throw new Error(extractError(err, "get cart items failed"));
  }
}

export const postOrder = async (orderRequest) => {
  try {
    const response = await api.post("/orders", orderRequest); console.log("post order", response);
    return response.data
  }
  catch (err) {
    throw new Error(extractError(err, "getproduct failed"));
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
    throw new Error(extractError(err, "orders failed"));
  }
}

export const cancelOrder = async (orderId) => {
  try {
    const res = await api.post(`/orders/${orderId}/cancel`);
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "cancel orders failed"));
  }
};

export const getSearchSuggestions = async (q, limit = 6) => {
  if (!q?.trim()) return [];
  try {
    const res = await api.get("/search/suggestions", { params: { q, limit } });
    return res.data; // string[]
  } catch (err) {
    throw new Error(extractError(err, " getSearchSuggestions failed"));
  }
};

export const postFeedback = async (body) => {
  try {
    const res = await api.post("/feedbacks", body)
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "feedback failed"));
  }
};
