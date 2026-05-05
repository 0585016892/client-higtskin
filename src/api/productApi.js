import axiosClient from "./axiosClient";

// ================= GET ALL PRODUCTS =================
const getProducts = (params) => {
  return axiosClient.get("/products", { params });
};

// ================= GET PRODUCT BY ID =================
const getProductById = (id) => {
  return axiosClient.get(`/products/${id}`);
};

// ================= CREATE PRODUCT =================
const createProduct = (data) => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("price", data.price);
  formData.append("stock", data.stock ?? 0);
  formData.append("description", data.description ?? "");
  formData.append("category_id", data.category_id ?? "");

  if (data.image?.length > 0) {
    formData.append("image", data.image[0].originFileObj);
  }

  return axiosClient.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ================= UPDATE PRODUCT =================
const updateProduct = (id, data) => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("price", data.price);
  formData.append("stock", data.stock ?? 0);
  formData.append("description", data.description ?? "");
  formData.append("category_id", data.category_id ?? "");

  if (data.image?.length > 0) {
    formData.append("image", data.image[0].originFileObj);
  }

  return axiosClient.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ================= DELETE PRODUCT =================
const deleteProduct = (id) => {
  return axiosClient.delete(`/products/${id}`);
};

// ================= EXPORT =================
const productApi = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

export default productApi;