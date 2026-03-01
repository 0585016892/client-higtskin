import axiosClient from "./axiosClient";

const serviceApi = {
  // Nhận vào object params (chứa page, limit, keyword, minPrice, maxPrice...)
  getAll: (params) => {
    const url = "/services";
    return axiosClient.get(url, { params }); 
    // Axios sẽ tự động convert {page: 1, keyword: 'mụn'} thành /services?page=1&keyword=mụn
  },

  getById: (id) => {
    const url = `/services/${id}`;
    return axiosClient.get(url);
  }
};

export default serviceApi;