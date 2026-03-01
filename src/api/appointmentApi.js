import axiosClient from "./axiosClient";

const appointmentApi = {
  create: (data) => {
    return axiosClient.post("/appointments", data); // Đường dẫn khớp với router.post("/")
  },
};

export default appointmentApi;