import React ,{useState,useCallback,useEffect} from "react";
import { Row, Col, Typography, Space, Divider,message } from "antd";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";
import settingApi from "../api/settingApi";

const { Title, Text } = Typography;

export default function Footer() {
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

  return (
    <footer style={{ background: "#1a1a1a", padding: "80px 10% 30px", color: "#fff" }}>
      <Row gutter={[40, 40]}>
        <Col xs={24} md={8}>
          <Title level={3} style={{ color: "#eb2f96", marginBottom: 20 }}>{settings.site_name}</Title>
          <Text style={{ color: "#aaa" }}>
            Hệ thống thẩm mỹ viện hàng đầu Việt Nam, mang lại vẻ đẹp tự nhiên và sự tự tin cho hàng triệu phụ nữ.
          </Text>
          <div style={{ marginTop: 25 }}>
            <Space size="middle">
              <Facebook size={20} color="#eb2f96" />
              <Instagram size={20} color="#eb2f96" />
              <Youtube size={20} color="#eb2f96" />
            </Space>
          </div>
        </Col>

        <Col xs={24} md={8}>
          <Title level={4} style={{ color: "#fff", marginBottom: 20 }}>Dịch Vụ Chính</Title>
          <Space direction="vertical" style={{ color: "#aaa" }}>
            <Text style={{ color: "#aaa" }}>Chăm sóc da mặt</Text>
            <Text style={{ color: "#aaa" }}>Trị mụn công nghệ cao</Text>
            <Text style={{ color: "#aaa" }}>Trẻ hóa da HIFU</Text>
            <Text style={{ color: "#aaa" }}>Phun xăm thẩm mỹ</Text>
          </Space>
        </Col>

        <Col xs={24} md={8}>
          <Title level={4} style={{ color: "#fff", marginBottom: 20 }}>Liên Hệ</Title>
          <Space direction="vertical" style={{ color: "#aaa" }}>
            <Space><MapPin size={16} /> Trường Đại học Mỏ Địa chất</Space>
            <Space><Phone size={16} /> 1900 XXXX</Space>
            <Space><Mail size={16} /> contact@highskin.vn</Space>
          </Space>
        </Col>
      </Row>
      
      <Divider style={{ borderColor: "#333", margin: "50px 0 20px" }} />
      <div style={{ textAlign: "center", color: "#666", fontSize: "12px" }}>
        {settings.footer_note}
      </div>
    </footer>
  );
}