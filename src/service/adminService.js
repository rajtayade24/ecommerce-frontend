import { api } from "./api";

// Create or update category
export const postCategory = async (category, image) => {
  try {
    const formData = new FormData();
    formData.append("category", new Blob([JSON.stringify(category)], { type: "application/json" }));
    if (image) formData.append("image", image);

    const response = await api.post("/admin/categories", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return { data: response.data, error: null };
  } catch (err) {
    const error =
      err.response?.data?.message ||
      err.response?.data ||
      err.message ||
      "postCategory failed";
    throw new Error(error)
  }
};

export const deleteCategory = async (id) => {
  try {
    const res = await api.delete(`/admin/categories/${id}`);
    return res.data;
  } catch (err) {
    const error = err.response?.data?.message || err.response?.data || err.message || "deleteCategory failed";
    throw new Error(error);
  }
};

export const postProduct = async (product, images) => {
  try {
    console.log("product post request", product, images);
    const formData = new FormData();
    formData.append("product", new Blob([JSON.stringify(product)], { type: "application/json" }));

    images.forEach((img) => {
      if (img.file) formData.append("images", img.file);
    });

    const response = await api.post("/admin/products",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    ); console.log(response);

    return { data: response.data, error: null };
  } catch (err) {
    const error = err.response?.data?.message || err.response?.data || err.message || "postproduct failed";
    throw new Error(error);
  }
};

export const updateProduct = async (id, product, images) => {
  try {
    console.log("product update request", id, product, images);
    const formData = new FormData();
    formData.append("product", new Blob([JSON.stringify(product)], { type: "application/json" }));
    images.forEach((img) => {
      if (img.file) formData.append("images", img.file);
    });

    const response = await api.put(`/admin/products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }); console.log(response);

    return { data: response.data, error: null };
  } catch (err) {
    const error = err.response?.data?.message || err.response?.data || err.message || "update product failed";
    throw new Error(error);
  }
};

export const deleteProduct = async (id) => {
  try {
    const res = await api.delete(`/admin/products/${id}`);
    return res.data;
  } catch (err) {
    const error = err.response?.data?.message || err.response?.data || err.message || "deleteproduct failed";
    return { data: null, error };
  }
};

export const getAllOrders = async (page, size, filter) => {
  const params = { page: page, size: size };
  if (filter.search != undefined) { params["search"] = filter.search }
  if (filter.status != undefined && filter.status !== null) { params["status"] = filter.status }

  try {
    const response = await api.get(`/admin/orders`, { params }); console.log("get All order", response);
    return response.data
  }
  catch (err) {
    const error = err.response?.data?.message || err.message || "getproduct failed";
    throw new Error(error);  // IMPORTANT
  }
}

export const getOrderById = async (id) => {
  try {
    const response = await api.get(`/admin/orders/${id}`); console.log("get order with id ", id, ": ", response);
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

export const markOrderComplete = async (id) => {
  try {
    const response = await api.post(`/admin/orders/${id}/complete`); console.log("get order with id ", id, ": ", response);
    return response.data
  }
  catch (err) {
    const error = err.response?.data?.message || err.message || err; throw new Error(error);
  }
}

export const cancelOrder = async (id) => {
  try {
    const response = await api.post(`/admin/orders/${id}/cancel`); console.log("get order with id ", id, ": ", response);
    return response.data
  }
  catch (err) {
    const error = err.response?.data?.message || err.message || err; throw new Error(error);
  }
}
export const getUsers = async (page = 0, size = 8, filters = {}) => {
  const params = { page, size };
  if (filters.search !== undefined && filters.search !== "") params.search = filters.search;
  if (filters.active !== undefined && filters.active !== null) params.active = filters.active;

  const res = await api.get("/admin/users", { params });
  return res.data;
};
export const getUserById = async (id) => {
  const res = await api.get(`/admin/users/${id}`);
  return res.data;
};

export const setUserActive = async (userId, active) => {
  try {
    const res = await api.patch(`/admin/users/${userId}`, { active });
    return res.data;
  } catch (err) {
    const message = err?.response?.data?.message || err?.response?.data || "Operation not allowed";
    throw new Error(message);
  }
};

export const getRevenue = async () => {
  const res = await api.get(`/admin/revenue`); console.log("revenue count ", res);
  return res.data;
}
export const getAllUsersCount = async () => {
  const res = await api.get(`/admin/users/count`); console.log("users count ", res);
  return res.data;
}
export const getAllOrdersCount = async () => {
  const res = await api.get(`/admin/orders/count`); console.log("order count ", res);
  return res.data;
}
export const getAllProductsCount = async () => {
  const res = await api.get(`/admin/products/count`); console.log("products count ", res);
  return res.data;
}
export const getAllCategoriesCount = async () => {
  const res = await api.get(`/admin/categories/count`); console.log("categories count ", res);
  return res.data;
}
