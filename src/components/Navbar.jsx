import React, { useState, useEffect ,useCallback} from "react";
import { Button, Space, Typography,message } from "antd";
import { Menu as MenuIcon, User } from "lucide-react";
import { Link } from "react-router-dom";
import settingApi from "../api/settingApi";

const { Text } = Typography;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
    const [settings, setSettings] = useState([]);
      const [loading, setLoading] = useState(true);
    const fetchServices = useCallback(async () => {
    // setLoading(true);
    try {
      const response = await settingApi.getAll(); 
      setSettings(response|| []);
    } catch (error) {
      message.error("Lỗi kết nối API!");
    } finally {
      setTimeout(() => setLoading(false), 400);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

const navStyle = {
    position: "fixed",
    top: 0,
    left: 0, // Thêm cái này để cố định vị trí chuẩn
    right: 0, // Dùng right thay cho width 100% để tự khớp khung hình
    zIndex: 1000,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: scrolled ? "12px 10%" : "20px 10%",
    background: scrolled ? "rgba(255, 255, 255, 0.9)" : "transparent",
    backdropFilter: "blur(10px)", // Để blur luôn cho xịn
    boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.03)" : "none",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    boxSizing: "border-box", // 👈 QUAN TRỌNG: Ngăn chặn tràn viền
  };
  
const name = settings?.site_name?.split(" ") || [];

return (
    <nav style={navStyle}>
      <div className="logo">
        <Link to="/" style={{ fontSize: "24px", fontWeight: "800", color: "#eb2f96", letterSpacing: "1px" }}>
         {name[0]}{" "}
        <span style={{ fontWeight: "300", color: scrolled ? "#333" : "#eb2f96" }}>
          {name[1]}
        </span>
        </Link>
      </div>

      <Space size="large" className="nav-links">
        <Link to="/"><Text strong style={{ color: scrolled ? "#333" : "#555" }}>TRANG CHỦ</Text></Link>
        <Link to="/services"><Text strong style={{ color: scrolled ? "#333" : "#555" }}>DỊCH VỤ</Text></Link>
        <Link to="/booking"><Text strong style={{ color: scrolled ? "#333" : "#555" }}>SẢN PHẨM</Text></Link>
      </Space>

      <Space>
        <Button type="text" icon={<User size={20} />} />
        <Button 
          type="primary" 
          style={{ 
            background: "#eb2f96", 
            borderColor: "#eb2f96", 
            borderRadius: "10px",
            height: "40px",
            fontWeight: "bold"
          }}
        >
          HOTLINE: 1900 XXXX
        </Button>
      </Space>
    </nav>
  );
}