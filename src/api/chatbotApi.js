import axiosClient from "./axiosClient";

export const sendChatbot = async ({ message, image }) => {

  try {

    const formData = new FormData();

    if (message) formData.append("message", message);
    if (image) formData.append("image", image);

    // console.log("📤 Chatbot request:");
    // console.log("Message:", message);
    // console.log("Image:", image);

    const res = await axiosClient.post("/chatbot", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    // console.log("📥 Chatbot response:", res);

    return res;   // axiosClient đã return data

  } catch (error) {

    console.error("❌ Chatbot API error:", error);

    return {
      success: false,
      reply: "Spa đang gặp lỗi hệ thống."
    };

  }

};