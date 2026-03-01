import React, { useEffect } from "react";
import { Button, Typography, Row, Col, Card, Space, Avatar, Divider, Statistic } from "antd";
import { Sparkles, ArrowRight, ShieldCheck, Crown, Medal, Quote ,User} from "lucide-react";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import serviceApi from "../api/serviceApi"; // Import đây
const { Title, Text, Paragraph } = Typography;

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);

  return (
    <div style={{ background: "#fff", overflowX: "hidden" }}>
      
      {/* SECTION 1: HERO - THE LUXURY ENTRANCE */}
      <section style={styles.heroSection}>
        <Row align="middle" style={styles.container}>
          <Col xs={24} lg={12}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <Space style={{ marginBottom: 16 }}>
                <Crown size={20} color="#eb2f96" />
                <Text strong style={{ color: "#eb2f96", letterSpacing: 4, textTransform: "uppercase" }}>
                  The Epitome of Beauty
                </Text>
              </Space>
              <Title style={styles.heroTitle}>
                Nâng Tầm Nhan Sắc <br />
                <span style={{ color: "#eb2f96", fontStyle: "italic", fontWeight: 300 }}>Chuẩn Thượng Lưu</span>
              </Title>
              <Paragraph style={styles.heroSubtitle}>
                Chúng tôi không chỉ chăm sóc da, chúng tôi kiến tạo một phiên bản 
                hoàn hảo nhất của chính bạn bằng công nghệ tương lai.
              </Paragraph>
              <Space size="large">
                <Button type="primary" size="large" style={styles.btnPrimary}>
                  ĐẶT LỊCH QUÝ TỘC <ArrowRight size={18} style={{ marginLeft: 8 }} />
                </Button>
                <Button size="large" style={styles.btnSecondary}>
                  KHÁM PHÁ LIỆU TRÌNH
                </Button>
              </Space>
            </motion.div>
          </Col>
          <Col xs={0} lg={12} style={{ textAlign: "right", position: "relative" }}>
             <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5 }}
            >
              <div style={styles.imageFloatBadge}>
                <Medal color="#eb2f96" size={32} />
                <Text strong>Top 1 Clinic 2026</Text>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=1000&q=80" 
                alt="Spa Luxury" 
                style={styles.heroImage}
              />
            </motion.div>
          </Col>
        </Row>
      </section>

      {/* SECTION 2: STATS - SỰ TIN TƯỞNG TUYỆT ĐỐI */}
      <section style={styles.statsSection} data-aos="fade-up">
        <Row style={styles.container} gutter={[40, 40]}>
          {[
            { label: "Khách hàng hài lòng", value: "15000", suffix: "+" },
            { label: "Công nghệ đạt chuẩn FDA", value: "25", suffix: "+" },
            { label: "Bác sĩ chuyên khoa", value: "10", suffix: "+" },
            { label: "Giải thưởng quốc tế", value: "05", suffix: "" }
          ].map((stat, i) => (
            <Col xs={12} md={6} key={i} style={{ textAlign: "center" }}>
              <Statistic 
                title={<Text style={{ color: "#8c8c8c" }}>{stat.label}</Text>} 
                value={stat.value} 
                suffix={stat.suffix}
                valueStyle={{ color: "#eb2f96", fontWeight: 700, fontSize: "32px" }} 
              />
            </Col>
          ))}
        </Row>
      </section>

      {/* SECTION 3: FEATURES - TẠI SAO CHỌN HIGHSKIN */}
      <section style={{ padding: "120px 0" }}>
        <div style={{ textAlign: "center", marginBottom: 80 }} data-aos="fade-up">
          <Title level={2} style={{ fontSize: "36px" }}>Giá Trị Độc Bản</Title>
          <div style={styles.underline}></div>
        </div>

        <Row style={styles.container} gutter={[60, 60]} align="middle">
          <Col xs={24} md={12} data-aos="fade-right">
            <img 
              src="https://images.unsplash.com/photo-1519415510236-8557bada8b0a?auto=format&fit=crop&w=800&q=80" 
              alt="Technology" 
              style={{ width: "100%", borderRadius: "40px", boxShadow: "0 30px 60px rgba(0,0,0,0.1)" }}
            />
          </Col>
          <Col xs={24} md={12} data-aos="fade-left">
            <Space direction="vertical" size={40}>
              <div style={styles.featureItem}>
                <ShieldCheck size={40} color="#eb2f96" />
                <div>
                  <Title level={4}>An Toàn Tuyệt Đối</Title>
                  <Text type="secondary">Sử dụng 100% dược mỹ phẩm cao cấp nhập khẩu từ Thụy Sĩ và Đức.</Text>
                </div>
              </div>
              <div style={styles.featureItem}>
                <Sparkles size={40} color="#eb2f96" />
                <div>
                  <Title level={4}>Công Nghệ Đột Phá</Title>
                  <Text type="secondary">Cập nhật những xu hướng làm đẹp không xâm lấn mới nhất thế giới.</Text>
                </div>
              </div>
              <div style={styles.featureItem}>
                <User size={40} color="#eb2f96" />
                <div>
                  <Title level={4}>Cá Nhân Hóa Trị Liệu</Title>
                  <Text type="secondary">Phác đồ riêng biệt được bác sĩ thiết kế dựa trên cấu trúc da mỗi người.</Text>
                </div>
              </div>
            </Space>
          </Col>
        </Row>
      </section>

      {/* SECTION 4: TESTIMONIALS - CẢM NHẬN KHÁCH HÀNG */}
      <section style={{ padding: "100px 0", background: "#1a1a1a", color: "#fff" }}>
        <div style={styles.container}>
          <div style={{ textAlign: "center", marginBottom: 80 }} data-aos="zoom-in">
             <Quote size={48} color="#eb2f96" style={{ marginBottom: 20 }} />
             <Title level={2} style={{ color: "#fff" }}>Khách Hàng Nói Gì Về Chúng Tôi</Title>
          </div>
          <Row gutter={[30, 30]}>
            {[
              { name: "Minh Anh", job: "Doanh nhân", text: "Trải nghiệm tại HighSkin thực sự khác biệt. Không gian tinh tế và hiệu quả thấy rõ sau buổi đầu." },
              { name: "Lê Thảo", job: "Người mẫu", text: "Tôi hoàn toàn tin tưởng giao phó làn da của mình cho các chuyên gia tại đây trước mỗi show diễn." },
              { name: "Hương Giang", job: "Bác sĩ", text: "Công nghệ ở đây rất hiện đại, quy trình vô khuẩn chuẩn y khoa khiến tôi cực kỳ yên tâm." }
            ].map((item, i) => (
              <Col xs={24} md={8} key={i} data-aos="flip-left" data-aos-delay={i * 200}>
                <Card style={styles.testiCard} bordered={false}>
                  <Text style={{ fontStyle: "italic", fontSize: 16 }}>"{item.text}"</Text>
                  <Divider style={{ background: "#333" }} />
                  <Space>
                    <Avatar size="large" src={`https://i.pravatar.cc/100?img=${i+10}`} />
                    <div>
                      <Text strong style={{ color: "#fff", display: "block" }}>{item.name}</Text>
                      <Text style={{ color: "#eb2f96", fontSize: 12 }}>{item.job}</Text>
                    </div>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* SECTION 5: CTA - THE FINALE */}
      <section style={styles.ctaSection} data-aos="zoom-out">
        <div style={{ textAlign: "center", maxWidth: 700 }}>
          <Title level={2} style={{ color: "#fff", fontSize: "42px" }}>Sẵn Sàng Cho Sự Thay Đổi?</Title>
          <Paragraph style={{ color: "rgba(255,255,255,0.7)", fontSize: 18 }}>
            Đừng bỏ lỡ cơ hội sở hữu làn da không tì vết. Đặt lịch tư vấn miễn phí ngay hôm nay.
          </Paragraph>
          <Button size="large" style={styles.btnCta}>BẮT ĐẦU HÀNH TRÌNH</Button>
        </div>
      </section>

    </div>
  );
}

const styles = {
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 20px"
  },
  heroSection: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    background: "linear-gradient(135deg, #ffffff 0%, #fff0f6 100%)",
    paddingTop: "80px"
  },
  heroTitle: {
    fontSize: "64px",
    lineHeight: 1.2,
    marginBottom: "24px",
    fontWeight: 800,
    letterSpacing: "-2px"
  },
  heroSubtitle: {
    fontSize: "20px",
    color: "#666",
    marginBottom: "40px",
    maxWidth: "500px",
    lineHeight: 1.6
  },
  heroImage: {
    width: "100%",
    borderRadius: "100px 30px 100px 30px",
    boxShadow: "0 40px 80px rgba(235, 47, 150, 0.2)",
  },
  imageFloatBadge: {
    position: "absolute",
    top: "10%",
    left: "-10%",
    background: "#fff",
    padding: "20px 30px",
    borderRadius: "20px",
    boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 2
  },
  statsSection: {
    padding: "60px 0",
    background: "#fff",
    borderBottom: "1px solid #f0f0f0"
  },
  btnPrimary: {
    height: 60,
    padding: "0 40px",
    borderRadius: "30px",
    background: "#eb2f96",
    borderColor: "#eb2f96",
    fontSize: "17px",
    fontWeight: 700,
    boxShadow: "0 15px 30px rgba(235, 47, 150, 0.3)"
  },
  btnSecondary: {
    height: 60,
    padding: "0 40px",
    borderRadius: "30px",
    fontSize: "17px",
    fontWeight: 600
  },
  featureItem: {
    display: "flex",
    gap: "24px",
    alignItems: "flex-start"
  },
  underline: {
    width: "80px",
    height: "4px",
    background: "#eb2f96",
    margin: "20px auto",
    borderRadius: "2px"
  },
  testiCard: {
    background: "#262626",
    borderRadius: "24px",
    height: "100%",
    transition: "all 0.3s"
  },
  ctaSection: {
    padding: "120px 0",
    background: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1500&q=80')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  btnCta: {
    marginTop: "30px",
    height: "60px",
    padding: "0 60px",
    borderRadius: "30px",
    background: "#fff",
    color: "#eb2f96",
    border: "none",
    fontSize: "18px",
    fontWeight: 700,
    cursor: "pointer"
  }
};