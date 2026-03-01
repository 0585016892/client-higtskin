import React, { useState, useEffect, useCallback } from "react";
import { 
  Typography, Row, Col, Card, Tag, Button, Input, 
  Select, Pagination, message, ConfigProvider, Empty, Space, Slider, Divider, Skeleton 
} from "antd";
import { Clock, ChevronRight, Search, Filter, Loader2, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import serviceApi from "../api/serviceApi";
import { Link } from "react-router-dom";
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
};

export default function Services() {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [sortOrder, setSortOrder] = useState("DESC");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 6;

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        keyword: keyword,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        order: sortOrder,
        sortBy: "price"
      };
      const response = await serviceApi.getAll(params); 
      setServices(response.data || []);
      setTotalItems(response.total || 0);
    } catch (error) {
      message.error("Lỗi kết nối API!");
    } finally {
      setTimeout(() => setLoading(false), 400);
    }
  }, [currentPage, sortOrder, priceRange, keyword]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Hàm xử lý ảnh lỗi hoặc không có ảnh
  const handleImage = (item) => {
    return item.image || item.img || "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=500";
  };

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#eb2f96', borderRadius: 20 } }}>
      <div style={{ paddingTop: 140, paddingBottom: 80, background: "#f8f9fa", minHeight: '100vh' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 20px' }}>
          <Row gutter={[40, 40]}>
            
            {/* SIDEBAR FILTER */}
            <Col xs={24} lg={6}>
              <Card style={{ borderRadius: 24, border: 'none', position: 'sticky', top: 120 }}>
                <Space style={{ marginBottom: 20 }}><Filter size={20} color="#eb2f96" /><Title level={4} style={{ margin: 0 }}>Lọc</Title></Space>
                <Input 
                  placeholder="Tìm kiếm..." 
                  prefix={<Search size={16} />} 
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onPressEnter={() => setCurrentPage(1)}
                  style={{ marginBottom: 20, height: 45, borderRadius: 12 }}
                />
                <Divider />
                <Text strong>Giá: {priceRange[0].toLocaleString()}đ</Text>
                <Slider range min={0} max={5000000} step={100000} value={priceRange} onChange={setPriceRange} onAfterChange={() => setCurrentPage(1)} />
                <Button block icon={<RotateCcw size={16} />} onClick={() => { setKeyword(""); setPriceRange([0, 5000000]); setCurrentPage(1); }} style={{ marginTop: 20 }}>Làm mới</Button>
              </Card>
            </Col>

            {/* MAIN CONTENT */}
            <Col xs={24} lg={18}>
              <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={3} style={{ margin: 0 }}>{totalItems} Liệu trình</Title>
                <Select defaultValue="DESC" style={{ width: 180 }} onChange={setSortOrder}>
                  <Option value="DESC">Giá: Cao đến thấp</Option>
                  <Option value="ASC">Giá: Thấp đến cao</Option>
                </Select>
              </div>

              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Row gutter={[24, 24]}>
                      {[...Array(pageSize)].map((_, i) => (
                        <Col xs={24} md={12} key={i}><Card style={{ borderRadius: 24 }}><Skeleton active avatar paragraph={{ rows: 3 }} /></Card></Col>
                      ))}
                    </Row>
                  </motion.div>
                ) : services.length > 0 ? (
                  <motion.div key="content" variants={containerVariants} initial="hidden" animate="visible">
                    <Row gutter={[24, 24]}>
                      {services.map((item) => (
                        <Col xs={24} md={12} key={item.id}>
                          <motion.div variants={itemVariants} whileHover={{ y: -8 }}>
                            <Card hoverable style={{ borderRadius: 24, border: 'none', overflow: 'hidden' }} bodyStyle={{ padding: 0 }}>
                              <Row>
                                <Col span={10}>
                                  <div style={{ height: '100%', minHeight: 180, overflow: 'hidden' }}>
                                    <img 
                                      src={handleImage(item)} 
                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                      alt={item.name}
                                      className="service-card-img"
                                    />
                                  </div>
                                </Col>
                                <Col span={14} style={{ padding: 20 }}>
                                  <Title level={4} style={{ fontSize: 17 }} ellipsis>{item.name}</Title>
                                  <Space><Clock size={14} color="#eb2f96" /><Text type="secondary">{item.duration || 60}m</Text></Space>
                                  <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ margin: '10px 0' }}>{item.description || "Liệu trình cao cấp tại HighSkin."}</Paragraph>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text strong style={{ fontSize: 19, color: '#eb2f96' }}>{Number(item.price).toLocaleString()}₫</Text>
                                    <Link to={`/services/${item.id}`}>
                                    <Button 
                                        type="primary" 
                                        shape="circle" 
                                        icon={<ChevronRight size={18} />} 
                                    />
                                    </Link>
                                  </div>
                                </Col>
                              </Row>
                            </Card>
                          </motion.div>
                        </Col>
                      ))}
                    </Row>

                    {/* PHÂN TRANG - Đã đưa ra ngoài mảng map nhưng vẫn nằm trong AnimatePresence content */}
                    <div style={{ textAlign: 'center', marginTop: 50 }}>
                      <Pagination 
                        current={currentPage} 
                        total={totalItems} 
                        pageSize={pageSize}
                        onChange={(page) => setCurrentPage(page)}
                        showSizeChanger={false}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Empty description="Không có dịch vụ nào!" /></motion.div>
                )}
              </AnimatePresence>
            </Col>
          </Row>
        </div>
      </div>
      <style>{`
        .service-card-img { transition: transform 0.5s ease; }
        .ant-card:hover .service-card-img { transform: scale(1.1); }
      `}</style>
    </ConfigProvider>
  );
}