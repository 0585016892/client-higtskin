import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3008/api", // Địa chỉ Backend của mày
  headers: {
    "Content-Type": "application/json",
  },
});

// Xử lý dữ liệu trước khi gửi đi hoặc sau khi nhận về
axiosClient.interceptors.response.use(
  (response) => {
    // Nếu có dữ liệu trả về, chỉ lấy phần data
    return response.data;
  },
  (error) => {
    // Xử lý lỗi tập trung (ví dụ: hiện thông báo lỗi)
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;