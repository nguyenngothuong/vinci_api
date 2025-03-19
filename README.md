# Vinci API Documentation

Tài liệu API cho hệ thống Vinci.

## Cấu trúc tài liệu

- [API Đơn Hàng V2](./docs/orders/v2/orders.md)
- [API Chi Tiết Đơn Hàng V1](./docs/orders/v1/order-details.md)
- [API Đơn Hàng V1](./docs/orders/v1/orders.md)

## Thông tin chung

- Base URL: `https://open.larksuite.com/anycross/trigger/callback/[ENDPOINT_ID]`
- Phương thức: POST
- Xác thực: Basic Authentication

## Các phiên bản API

### V2
- Kết hợp API đơn hàng và chi tiết đơn hàng
- Trả về toàn bộ dữ liệu trong một lần gọi
- Không cần phân trang

### V1
- API đơn hàng và chi tiết đơn hàng riêng biệt
- Hỗ trợ phân trang
- Cần gọi nhiều lần để lấy đầy đủ dữ liệu 