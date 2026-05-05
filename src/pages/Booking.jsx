import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Row,
  Col,
  Card,
  Tag,
  message,
  Skeleton,
  Pagination,
  ConfigProvider,
  Button,
  Badge,
  Space
} from "antd";
import { 
  ArrowRightOutlined, 
  HeartOutlined,
  StarOutlined, 
  CrownOutlined,
  FilterOutlined
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import productApi from "../api/productApi";

const WEB_URL = process.env.REACT_APP_WEB_URL;
const { Title, Text, Paragraph } = Typography;

const CATEGORY_MAP = {
  1: { label: "Massage Thư Giãn", color: "#87d068" },
  2: { label: "Massage Trị Liệu", color: "#f50" },
  3: { label: "Chăm Sóc Cơ", color: "#722ed1" },
  4: { label: "Phục Hồi", color: "#fa8c16" },
  5: { label: "Kéo Giãn", color: "#13c2c2" },
  6: { label: "Bấm Huyệt", color: "#faad14" },
  7: { label: "Office Care", color: "#1890ff" },
  8: { label: "Liệu Trình VIP", color: "#eb2f96" },
};

export default function ProductShowcase() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 8;

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await productApi.getProducts({
        page: currentPage,
        limit: pageSize,
        status: 1
      });
      
      // Xử lý dữ liệu từ API
      const responseData = res.data.data || res.data;
      setProducts(Array.isArray(responseData) ? responseData : []);
      setTotal(res.data.total || responseData.length);
      
    } catch (err) {
      message.error("Không thể tải danh sách sản phẩm!");
    } finally {
      // Delay nhẹ để hiệu ứng Skeleton mượt mà
      setTimeout(() => setLoading(false), 600);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#eb2f96", borderRadius: 16 } }}>
      <div className="product-page-container">
        
        {/* HEADER SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="header-section"
        >
          <Badge count={<CrownOutlined style={{ color: '#faad14' }} />} offset={[10, 0]}>
            <Title level={1} className="main-title">
              Sản phẩm <span className="gradient-text">HighSkin</span>
            </Title>
          </Badge>
          <br />
          <Text className="sub-title">
            Dòng sản phẩm chuyên dụng phục vụ liệu trình tại Spa. Tinh túy từ thiên nhiên cho làn da rạng rỡ.
          </Text>
          
          {/* <div className="filter-bar">
            <Space size="middle">
              <FilterOutlined /> <Text strong>Bộ lọc nhanh:</Text>
              <Tag className="filter-tag active">Tất cả</Tag>
              <Tag className="filter-tag">Bán chạy</Tag>
              <Tag className="filter-tag">Mới về</Tag>
            </Space>
          </div> */}
        </motion.div>

        {/* LIST SECTION */}
        <AnimatePresence mode="wait">
          {loading ? (
            <Row gutter={[32, 40]}>
              {[...Array(pageSize)].map((_, i) => (
                <Col xs={24} sm={12} lg={6} key={i}>
                  <Card bordered={false} className="skeleton-card">
                    <Skeleton.Image active style={{ width: '100%', height: 240 }} />
                    <Skeleton active paragraph={{ rows: 2 }} />
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <Row gutter={[32, 40]}>
                {products.map((product) => {
                  const category = CATEGORY_MAP[product.category_id];

                  return (
                    <Col xs={24} sm={12} lg={6} key={product.id}>
                      <motion.div variants={itemVariants} whileHover={{ y: -10 }}>
                        <Card
                          hoverable
                          className="premium-product-card"
                          cover={
                            <div className="image-container">
                              <img
                                alt={product.name}
                                src={product.image ? `${WEB_URL}${product.image}` : "https://images.unsplash.com/photo-1570172619382-2fa189c44766?q=80&w=500"}
                                className="main-image"
                              />
                              <div className="hover-actions">
                                <Button shape="circle" icon={<HeartOutlined />} className="action-btn" />
                                <Button shape="circle" icon={<StarOutlined />} className="action-btn" />
                              </div>
                              {product.price > 1000000 && <div className="luxury-tag">Luxury</div>}
                            </div>
                          }
                        >
                          <div className="card-content">
                            <Tag color={category?.color || "#eb2f96"} className="category-tag">
                              {category?.label || "HighSkin Care"}
                            </Tag>
                            
                            <Title level={4} className="product-name">
                              {product.name}
                            </Title>

                            <Paragraph type="secondary" ellipsis={{ rows: 2 }} className="product-desc">
                              {product.description || "Thành phần tự nhiên kết hợp công nghệ độc quyền giúp nuôi dưỡng sâu từ bên trong."}
                            </Paragraph>

                            <div className="card-footer">
                              <div className="price-box">
                                <span className="price-symbol">₫</span>
                                <span className="price-value">{Number(product.price || 0).toLocaleString()}</span>
                              </div>
                              {/* <Button 
                                type="primary" 
                                shape="circle" 
                                icon={<ArrowRightOutlined />} 
                                className="buy-button"
                              /> */}
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    </Col>
                  );
                })}
              </Row>

              {/* PAGINATION */}
              <div className="pagination-wrapper">
                <Pagination
                  current={currentPage}
                  total={total}
                  pageSize={pageSize}
                  onChange={(page) => setCurrentPage(page)}
                  showSizeChanger={false}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <style>{`
          .product-page-container {
            padding: 120px 8% 80px;
            background: #fdfdfd;
            min-height: 100vh;
          }

          /* Header Styles */
          .header-section { text-align: center; margin-bottom: 60px; }
          .main-title { font-size: 3.5rem !important; font-weight: 800 !important; margin: 0; }
          .gradient-text {
            background: linear-gradient(45deg, #eb2f96, #722ed1);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .sub-title { color: #8c8c8c; font-size: 1.1rem; max-width: 650px; display: inline-block; margin-top: 15px; }
          
          .filter-bar { margin-top: 30px; }
          .filter-tag { 
            padding: 4px 16px; border-radius: 20px; cursor: pointer; 
            border: 1px solid #f0f0f0; background: white; transition: 0.3s;
          }
          .filter-tag.active { background: #eb2f96; color: white; border-color: #eb2f96; }

          /* Card Styles */
          .premium-product-card {
            border-radius: 24px !important;
            overflow: hidden;
            border: none !important;
            box-shadow: 0 10px 30px rgba(0,0,0,0.04) !important;
            transition: all 0.4s ease;
          }
          .premium-product-card:hover {
            box-shadow: 0 20px 40px rgba(235, 47, 150, 0.1) !important;
          }

          .image-container { position: relative; height: 280px; overflow: hidden; }
          .main-image { width: 100%; height: 100%; object-fit: cover; transition: 0.6s; }
          .premium-product-card:hover .main-image { transform: scale(1.1); }

          .hover-actions {
            position: absolute; top: 15px; right: -50px;
            display: flex; flex-direction: column; gap: 10px;
            transition: 0.4s;
          }
          .premium-product-card:hover .hover-actions { right: 15px; }
          .action-btn { background: rgba(255,255,255,0.9) !important; border: none !important; color: #eb2f96; }

          .luxury-tag {
            position: absolute; bottom: 15px; left: 15px;
            background: rgba(0,0,0,0.6); backdrop-filter: blur(5px);
            color: white; padding: 4px 12px; border-radius: 10px; font-size: 11px;
          }

          .card-content { padding: 5px 0; }
          .category-tag { border-radius: 6px; font-size: 11px; margin-bottom: 12px; border: none; }
          .product-name { font-size: 1.15rem !important; font-weight: 700 !important; margin-bottom: 8px !important; height: 50px; overflow: hidden; }
          .product-desc { font-size: 13px; color: #8c8c8c; margin-bottom: 20px !important; height: 40px; }

          .card-footer { display: flex; justify-content: space-between; align-items: center; }
          .price-box { color: #eb2f96; }
          .price-symbol { font-size: 14px; font-weight: 600; margin-right: 2px; }
          .price-value { font-size: 22px; font-weight: 800; }
          
          .buy-button { 
            width: 45px !important; height: 45px !important; 
            box-shadow: 0 6px 15px rgba(235, 47, 150, 0.3) !important;
          }

          .pagination-wrapper { margin-top: 80px; text-align: center; }

          /* Skeleton */
          .skeleton-card { border-radius: 24px; }
        `}</style>
      </div>
    </ConfigProvider>
  );
}