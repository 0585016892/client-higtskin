import React, { useState, useEffect, useCallback } from "react";
import { Typography, Row, Col, Card, Tag, Button, Space, message, Skeleton, Pagination, ConfigProvider } from "antd";
import { Clock, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link,useNavigate } from "react-router-dom"; // 👈 Thêm cái này để chuyển trang
import serviceApi from "../api/serviceApi";
const { Title, Text, Paragraph } = Typography;

export default function Booking() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Khởi tạo ở đây
  const [services, setServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 6;

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: pageSize,
        status: 1 
      };
      const response = await serviceApi.getAll(params);
      setServices(response.data || []);
      setTotalItems(response.total || 0);
    } catch (error) {
      message.error("Không thể tải danh sách dịch vụ!");
    } finally {
      setTimeout(() => setLoading(false), 400);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleBookingClick = (e, service) => {
    // Ngăn chặn sự kiện nổi bọt để không bị nhảy trang khi nhấn nút Đặt lịch
    e.stopPropagation();
    e.preventDefault();
    message.success(`Đã chọn: ${service.name}. Vui lòng điền thông tin.`);
    navigate(`/services/${service.id}`);
  };

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#eb2f96' } }}>
      <div style={{ padding: "140px 10% 80px", background: "#fcfcfc", minHeight: "100vh" }}>
        
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <Title level={1} style={{ fontWeight: 800, letterSpacing: "-1px" }}>
              Menu <span style={{ color: "#eb2f96" }}>Dịch Vụ</span>
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              Lựa chọn liệu trình phù hợp để chăm sóc bản thân tốt hơn
            </Text>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <Row gutter={[32, 32]}>
              {[...Array(pageSize)].map((_, i) => (
                <Col xs={24} sm={12} lg={8} key={i}>
                  <Card style={{ borderRadius: 24 }}><Skeleton active paragraph={{ rows: 3 }} /></Card>
                </Col>
              ))}
            </Row>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Row gutter={[32, 32]}>
                {services.map((service) => (
                  <Col xs={24} sm={12} lg={8} key={service.id}>
                    {/* Bọc toàn bộ Card bằng Link để nhấn đâu cũng chuyển trang */}
                    <Link to={`/services/${service.id}`} style={{ textDecoration: 'none' }}>
                      <motion.div whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 300 }}>
                        <Card
                          hoverable
                          cover={
                            <div style={{ position: "relative", overflow: "hidden", height: 240 }}>
                              <img
                                alt={service.name}
                                src={service.image || "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=500"}
                                style={{ height: "100%", width: "100%", objectFit: "cover" }}
                              />
                              <Tag 
                                color="magenta" 
                                style={{ position: "absolute", top: 15, right: 10, borderRadius: 8 }}
                              >
                                {service.price > 1000000 ? "Premium" : "Basic"}
                              </Tag>
                            </div>
                          }
                          style={{ borderRadius: 24, overflow: "hidden", border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}
                        >
                          <div style={{ marginBottom: 15 }}>
                            <Title level={4} style={{ margin: 0, fontSize: 18 }}>{service.name}</Title>
                            <Space style={{ marginTop: 8 }}>
                              <Clock size={14} color="#bfbfbf" />
                              <Text type="secondary" style={{ fontSize: 13 }}>{service.duration || 60} phút</Text>
                            </Space>
                          </div>
                          
                          <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ height: 44 }}>
                            {service.description || "Chưa có mô tả chi tiết."}
                          </Paragraph>

                          <div style={{ 
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            marginTop: 20, paddingTop: 15, borderTop: "1px solid #f5f5f5"
                          }}>
                            <Text strong style={{ fontSize: 20, color: "#eb2f96" }}>
                              {Number(service.price).toLocaleString()}₫
                            </Text>
                            
                            {/* Nút đặt lịch - Dùng e.stopPropagation để không bị nhảy trang chi tiết khi nhấn nút này */}
                            <Button 
                              type="primary" 
                              icon={<CheckCircle2 size={16} />}
                              onClick={(e) => handleBookingClick(e, service)}
                              style={{ borderRadius: 12, background: "#000", border: "none", height: 40 }}
                            >
                              ĐẶT LỊCH
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    </Link>
                  </Col>
                ))}
              </Row>

              <div style={{ textAlign: "center", marginTop: 60 }}>
                <Pagination 
                  current={currentPage} 
                  total={totalItems} 
                  pageSize={pageSize}
                  onChange={(page) => setCurrentPage(page)}
                  showSizeChanger={false}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ConfigProvider>
  );
}