import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Typography, Row, Col, Tag, Button, Space, Divider, Skeleton, 
  message, ConfigProvider, Modal, Form, DatePicker, Select, Input, Badge
} from "antd";
import { 
  Clock, ChevronLeft, Calendar, ShieldCheck, Sparkles, User, 
  Phone, Mail, Zap, MessageCircle 
} from "lucide-react";
import { motion } from "framer-motion";
import serviceApi from "../api/serviceApi";
import appointmentApi from "../api/appointmentApi"; 
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState(null);

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isConsultOpen, setIsConsultOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [form] = Form.useForm();
  const [consultForm] = Form.useForm();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const response = await serviceApi.getById(id);
        setService(response.data || response);
      } catch (error) {
        message.error("Không tìm thấy thông tin dịch vụ!");
        navigate("/services");
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchDetail();
  }, [id, navigate]);

  const handleBooking = async (values) => {
    try {
      setSubmitting(true);
      const data = {
        ...values,
        service_id: id,
        appointment_time: values.appointment_time.format("YYYY-MM-DD HH:mm:ss"),
        type: 'booking',
      };
      await appointmentApi.create(data);
      message.success("Đặt lịch thành công! HighSkin sẽ liên hệ bạn sớm nhất.");
      setIsBookingOpen(false);
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.message || "Có lỗi xảy ra khi đặt lịch");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConsultation = async (values) => {
    try {
      setSubmitting(true);
      const data = { ...values, service_id: id, type: 'consultation' };
    //   await appointmentApi.create(data); 
      message.success("Yêu cầu đã gửi! Chuyên gia sẽ gọi cho bạn trong ít phút.");
      setIsConsultOpen(false);
      consultForm.resetFields();
    } catch (error) {
      message.error("Gửi yêu cầu thất bại");
    } finally { setSubmitting(false); }
  };

  if (loading) {
    return <div style={{ padding: "150px 10%" }}><Skeleton active avatar paragraph={{ rows: 10 }} /></div>;
  }

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#eb2f96', borderRadius: 12 } }}>
      <div style={{ paddingTop: 120, paddingBottom: 80, background: "#fff", minHeight: "100vh" }}>
        
        {/* Widget liên hệ nhanh */}
        {/* <div style={{ position: 'fixed', right: 25, bottom: 30, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Badge count="Hot">
                <Button type="primary" shape="circle" size="large" style={{ width: 60, height: 60, background: '#1da1f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }} icon={<MessageCircle size={24} />} onClick={() => window.open('https://zalo.me/your_zalo')} />
            </Badge>
            <Button type="primary" shape="circle" size="large" style={{ width: 60, height: 60, background: '#52c41a', display: 'flex', alignItems: 'center', justifyContent: 'center' }} icon={<Phone size={24} />} onClick={() => window.location.href = 'tel:0336041807'} />
        </div> */}

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <Space direction="vertical" style={{ marginBottom: 30 }}>
            <Button type="text" icon={<ChevronLeft size={18} />} onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', padding: 0 }}>
              Quay lại danh sách
            </Button>
          </Space>

          <Row gutter={[60, 40]}>
            <Col xs={24} md={12}>
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} style={{ position: 'sticky', top: 120 }}>
                <div style={{ borderRadius: 32, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                  <img src={service?.image || "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=800"} alt={service?.name} style={{ width: '100%', height: '500px', objectFit: 'cover' }} />
                </div>
              </motion.div>
            </Col>

            <Col xs={24} md={12}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Tag color="magenta" style={{ marginBottom: 15 }}>DỊCH VỤ NỔI BẬT</Tag>
                <Title level={1} style={{ fontSize: 40, fontWeight: 800, margin: '0 0 20px 0' }}>{service?.name}</Title>

                <Space size={30} style={{ marginBottom: 30 }}>
                  <div style={{ textAlign: 'center' }}>
                    <Clock size={20} color="#eb2f96" />
                    <div style={{ marginTop: 5 }}><Text type="secondary">Thời gian</Text></div>
                    <Text strong>{service?.duration || 60} phút</Text>
                  </div>
                  <Divider type="vertical" style={{ height: 40 }} />
                  <div style={{ textAlign: 'center' }}>
                    <ShieldCheck size={20} color="#eb2f96" />
                    <div style={{ marginTop: 5 }}><Text type="secondary">Cam kết</Text></div>
                    <Text strong>Chuẩn Y Khoa</Text>
                  </div>
                </Space>

                <div style={{ background: '#fff5f9', padding: '24px', borderRadius: 24, marginBottom: 30 }}>
                  <Text type="secondary">Giá liệu trình</Text>
                  <Title level={2} style={{ color: '#eb2f96', margin: 0, fontWeight: 800 }}>{Number(service?.price).toLocaleString()}₫</Title>
                </div>

                <Title level={4}>Mô tả liệu trình</Title>
                <Paragraph style={{ fontSize: 16, lineHeight: '1.8', color: '#595959' }}>{service?.description}</Paragraph>

                <Divider />

                <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
                  <Button 
                    type="primary" size="large" icon={<Calendar size={20} />} 
                    style={{ height: 60, borderRadius: 16, flex: 1, fontWeight: 600 }}
                    onClick={() => setIsBookingOpen(true)}
                  >
                    ĐẶT LỊCH NGAY
                  </Button>
                  <Button 
                    size="large" icon={<Sparkles size={20} color="#eb2f96" />} 
                    style={{ height: 60, borderRadius: 16, flex: 1, fontWeight: 600, color: '#eb2f96', borderColor: '#eb2f96' }}
                    onClick={() => setIsConsultOpen(true)}
                  >
                    TƯ VẤN MIỄN PHÍ
                  </Button>
                </div>
              </motion.div>
            </Col>
          </Row>
        </div>

        {/* --- MODAL ĐẶT LỊCH --- */}
        <Modal
          title={<Title level={3} style={{ margin: 0 }}>Thông tin đặt lịch</Title>}
          open={isBookingOpen}
          onCancel={() => setIsBookingOpen(false)}
          footer={null}
          centered
          width={650}
        >
          <Form form={form} layout="vertical" onFinish={handleBooking} style={{ marginTop: 20 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="full_name" label="Họ và tên" rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}>
                  <Input prefix={<User size={16} color="#bfbfbf" />} placeholder="Nguyễn Văn A" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: "Vui lòng nhập SĐT" }]}>
                  <Input prefix={<Phone size={16} color="#bfbfbf" />} placeholder="09xxxxxxx" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="email" label="Email (Không bắt buộc)">
              <Input prefix={<Mail size={16} color="#bfbfbf" />} placeholder="example@gmail.com" />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="skin_type" label="Loại da">
                  <Select placeholder="Chọn loại da">
                    <Option value="Da dầu">Da dầu</Option>
                    <Option value="Da khô">Da khô</Option>
                    <Option value="Da hỗn hợp">Da hỗn hợp</Option>
                    <Option value="Da nhạy cảm">Da nhạy cảm</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="appointment_time" label="Chọn ngày & giờ" rules={[{ required: true, message: "Vui lòng chọn giờ" }]}>
                  <DatePicker 
                    showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }}
                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="skin_issue" label="Tình trạng da hiện tại">
              <TextArea rows={2} placeholder="Mô tả tình trạng da của bạn..." />
            </Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={submitting} style={{ height: 50, borderRadius: 12, marginTop: 10, fontWeight: 700 }}>
              XÁC NHẬN ĐẶT LỊCH NGAY
            </Button>
          </Form>
        </Modal>

        {/* --- MODAL TƯ VẤN --- */}
        <Modal 
          title={null} 
          open={isConsultOpen} 
          onCancel={() => setIsConsultOpen(false)} 
          footer={null} 
          centered 
          width={450} 
          styles={{ body: { padding: 0 } }}
        >
            <div style={{ background: 'linear-gradient(135deg, #eb2f96 0%, #722ed1 100%)', padding: '30px', textAlign: 'center', borderRadius: '12px 12px 0 0' }}>
                <Zap size={40} color="#fff" style={{ margin: '0 auto 10px' }} />
                <Title level={3} style={{ color: '#fff', margin: 0 }}>Bác Sĩ Tư Vấn</Title>
                <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Bạn có thắc mắc về dịch vụ "{service?.name}"?</Text>
            </div>
            <div style={{ padding: '30px' }}>
                <Form form={consultForm} layout="vertical" onFinish={handleConsultation}>
                    <Form.Item name="phone" label="Số điện thoại của bạn" rules={[{ required: true, message: 'Nhập SĐT để bác sĩ gọi lại' }]}>
                        <Input size="large" prefix={<Phone size={16} />} placeholder="09xxxxxxxx" />
                    </Form.Item>
                    <Form.Item name="skin_issue" label="Vấn đề bạn đang gặp phải?">
                        <TextArea rows={4} placeholder="Ví dụ: Da tôi bị mụn ẩn nhiều, có dùng được liệu trình này không?" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block size="large" loading={submitting} style={{ height: 50, borderRadius: 12, fontWeight: 700 }}>GỬI YÊU CẦU NGAY</Button>
                    <div style={{ textAlign: 'center', marginTop: 15 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>Bác sĩ sẽ liên hệ tư vấn hoàn toàn miễn phí</Text>
                    </div>
                </Form>
            </div>
        </Modal>
      </div>
    </ConfigProvider>
  );
}