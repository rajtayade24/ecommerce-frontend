import { api } from "@/service/api";
import { extractError } from "@/utils/extractError";

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
    throw new Error(extractError(err, "postCategory failed"));
  }
};

export const deleteCategory = async (id) => {
  try {
    const res = await api.delete(`/admin/categories/${id}`);
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "delete category failed"));
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
    throw new Error(extractError(err, "postproduct failed"));
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
    throw new Error(extractError(err, "update product failed"));
  }
};

export const deleteProduct = async (id) => {
  try {
    const res = await api.delete(`/admin/products/${id}`);
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "deleteproduct failed"));
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
    throw new Error(extractError(err, "getproduct failed"));
  }
}

export const getOrderById = async (id) => {
  try {
    const response = await api.get(`/admin/orders/${id}`); console.log("get order with id ", id, ": ", response);
    return response.data
  }
  catch (err) {
    throw new Error(extractError(err, "getproduct failed"));
  }
}

export const markOrderComplete = async (id) => {
  try {
    const response = await api.post(`/admin/orders/${id}/complete`); console.log("get order with id ", id, ": ", response);
    return response.data
  }
  catch (err) {
    throw new Error(extractError(err, "mark order complete"));
  }
}

export const cancelOrder = async (id) => {
  try {
    const response = await api.post(`/admin/orders/${id}/cancel`); console.log("get order with id ", id, ": ", response);
    return response.data
  }
  catch (err) {
    throw new Error(extractError(err, "cancel order failed"));
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
    throw new Error(extractError(err, "Operation not allowed"));
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


export const getAllFeedback = async (params) => {
  try {
    const res = await api.get("/feedbacks", { params });
    return res.data; // Page<FeedbackResponse>
  } catch (err) {
    throw new Error(extractError(err, "Failed to load feedbacks"));
  }
};

export const updateFeedbackStatus = async (id, status) => {
  try {
    const res = await api.patch(`/feedbacks/${id}/status`, null, {
      params: { status },
    });
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Failed to update status"));
  }
};

export const deleteFeedback = async (id) => {
  try {
    await api.delete(`/feedbacks/${id}`);
  } catch (err) {
    throw new Error(extractError(err, "Failed to delete feedback"));
  }
};