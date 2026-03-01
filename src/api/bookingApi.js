import axiosClient from "./axiosClient";

const bookingApi = {
  create: (data) => {
    const url = "/appointments";
    return axiosClient.post(url, data);
  }
};

export default bookingApi;