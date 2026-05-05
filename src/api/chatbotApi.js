import axiosClient from "./axiosClient";



import axios from "axios";

export const sendChatbot = async ({ message, image }) => {
  const formData = new FormData();

  if (message) {
    formData.append("message", message);
  }

  if (image) {
    formData.append("image", image);
  }

  const response = await axios.post(
    `${process.env.REACT_APP_API_URL}/chatbot`, // đổi theo backend của bạn
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
// export const sendChatbot = async ({ message, image }) => {

//   try {

//     const formData = new FormData();

//     if (message) formData.append("message", message);
//     if (image) formData.append("image", image);

//     // console.log("📤 Chatbot request:");
//     // console.log("Message:", message);
//     // console.log("Image:", image);

//     const res = await axiosClient.post("/chatbot", formData, {
//       headers: {
//         "Content-Type": "multipart/form-data"
//       }
//     });

//     // console.log("📥 Chatbot response:", res);

//     return res;   // axiosClient đã return data

//   } catch (error) {

//     console.error("❌ Chatbot API error:", error);

//     return {
//       success: false,
//       reply: "Spa đang gặp lỗi hệ thống."
//     };

//   }

// };

// export const askAI = async (message) => {
//   const res = await axiosClient.post("/api/chatbot", { message });
//   return res.data.reply;
// };