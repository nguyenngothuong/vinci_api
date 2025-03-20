# Vinci API Documentation

Tài liệu API cho hệ thống Vinci.

## Cấu trúc tài liệu

- [API Đơn Hàng V2](./docs/orders/v2/orders.md)
- [API Cập Nhật Trạng Thái Đơn Hàng V2](./docs/orders/v2/update-status.md)
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
- Hỗ trợ cập nhật trạng thái đơn hàng hàng loạt

### V1
- API đơn hàng và chi tiết đơn hàng riêng biệt
- Hỗ trợ phân trang
- Cần gọi nhiều lần để lấy đầy đủ dữ liệu

## Thông báo quan trọng

✅ **API Cập Nhật Trạng Thái Đơn Hàng V2 đã sẵn sàng sử dụng**
- Flow cập nhật trạng thái đơn hàng V2 đã được cải tiến và tối ưu hóa
- Hỗ trợ cập nhật hàng loạt với giới hạn tối đa 100 đơn hàng mỗi request
- Các cải tiến:
  - Xử lý batch tự động cho mỗi 50 đơn hàng
  - Trả về thông tin chi tiết về các đơn đã cập nhật và chưa cập nhật
  - Log chi tiết để dễ dàng debug
- Ngày cập nhật: 25/03/2024 