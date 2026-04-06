import axiosClient from "./axiosClient";

const settingApi = {
  // Nhận vào object params (chứa page, limit, keyword, minPrice, maxPrice...)
  getAll: (params) => {
    const url = "/settings";
    return axiosClient.get(url, { params }); 
    // Axios sẽ tự động convert {page: 1, keyword: 'mụn'} thành /settings?page=1&keyword=mụn
  },
};

export default settingApi;