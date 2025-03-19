# API Đơn Hàng V2

## Thông tin chung
- **Endpoint**: `https://n8n.nguyenngothuong.com/webhook/vinci-order-v2-190325`
- **Phương thức**: POST
- **Xác thực**: Basic Authentication

## Cấu trúc Request

### Body
```json
{
  "data": {
    "filter_conditions": [
      {
        "field_name": "Tên trường",
        "operator": "is",
        "value": ["Giá trị"]
      }
    ],
    "filter_conjunction": "and",
    "sorting_conditions": [
      {
        "field_name": "Tên trường",
        "order": "desc"
      }
    ]
  },
  "headers": [
    {
      "header_key": "Content-Type",
      "value": "application/json"
    }
  ],
  "status": 200
}
```

### Các tham số trong Body
1. **filter_conditions** (bắt buộc): Mảng các điều kiện lọc
   - field_name: Tên trường cần lọc
   - operator: Toán tử so sánh (hỗ trợ: "is", "contains", "starts_with", "ends_with", "is_not", "is_empty", "is_not_empty", "isGreater", "isLess")
   - value: Mảng giá trị cần so sánh

2. **filter_conjunction** (tùy chọn): Phép kết hợp các điều kiện
   - Giá trị: "and" hoặc "or"
   - Mặc định: "and"

3. **sorting_conditions** (tùy chọn): Mảng các điều kiện sắp xếp
   - field_name: Tên trường cần sắp xếp
   - order: Thứ tự sắp xếp ("asc" hoặc "desc")

## Cấu trúc Response

```json
{
  "success": true,
  "message": "Đã xử lý 48 đơn hàng với 297 chi tiết đơn hàng",
  "data": [
    {
      "order_id": "477-C Phúc NA",
      "invoice_number": "477",
      "order_code": "DH477",
      "customer_name": "C Phúc NA",
      "phone": "0971456656",
      "address": "Nghệ An",
      "warehouse_address": "Số 60, K3, thị trấn Hưng Nguyên, tỉnh Nghệ An",
      "export_date": "03/02/2025",
      "status": "Xuất kho",
      "region": "Trung",
      "carrier_id": ["recuEKSQPi4MAQ"],
      "carrier_name": "Hải Mạnh",
      "export_document_link": "https://storage.googleapis.com/html2pdf-129831293812-4/PG-495-A Trọng ĐN-20250219-1739960595001-vinci-group.pdf",
      "order_details": [
        {
          "product_id": "recmVEazL4",
          "product_name": "Dán Kidmac S",
          "size": "S",
          "category": "Tã dán",
          "product_line": "Diapers",
          "unit": "Kiện",
          "unit_price": 690000,
          "quantity": 0,
          "total_amount": 0,
          "pieces_per_unit": 300,
          "total_pieces": 0,
          "display_code": "Dán Kidmac S: "
        }
      ]
    }
  ],
  "metadata": {
    "total_orders": 48,
    "orders_with_details": 47,
    "total_details": 297,
    "timestamp": "2025-03-19T19:42:10.406Z"
  }
}
```

## Các trường dữ liệu quan trọng

### Thông tin đơn hàng
- **order_id**: Mã định danh đơn hàng
- **invoice_number**: Mã phiếu
- **order_code**: Mã đơn hàng
- **customer_name**: Tên khách hàng
- **phone**: Số điện thoại
- **address**: Địa chỉ giao hàng
- **warehouse_address**: Địa chỉ kho
- **export_date**: Ngày xuất đơn (DD/MM/YYYY)
- **status**: Trạng thái đơn hàng
  - Nhận đơn: BP Sales tạo đơn trên Lark
  - Đồng bộ: Hệ thống đẩy đơn từ Lark sang WMS
  - Xử lý: Kho soạn hàng, xử lý bắn kiện qua PDA bốc xếp lên xe 
  - Xuất kho: Kho scan hoàn thành trên PDA
  - Đã hủy: Trạng thái hủy đơn
- **region**: Khu vực (Bắc, Trung, Nam)
- **carrier_id**: ID vận chuyển
- **carrier_name**: Tên vận chuyển
- **export_document_link**: Link đến phiếu xuất kho (PDF)

### Thông tin chi tiết đơn hàng (order_details)
- **product_id**: ID sản phẩm
- **product_name**: Tên sản phẩm
- **size**: Kích thước sản phẩm
- **category**: Danh mục sản phẩm
- **product_line**: Dòng sản phẩm
- **unit**: Đơn vị tính
- **unit_price**: Đơn giá
- **quantity**: Số lượng đặt hàng
- **total_amount**: Tổng tiền
- **pieces_per_unit**: Số lượng sản phẩm trong một đơn vị
- **total_pieces**: Tổng số sản phẩm
- **display_code**: Mã hiển thị

### Metadata
- **total_orders**: Tổng số đơn hàng
- **orders_with_details**: Số đơn hàng có chi tiết
- **total_details**: Tổng số chi tiết đơn hàng
- **timestamp**: Thời gian xử lý

## Ví dụ

### Request để lấy đơn hàng có trạng thái "Nhận đơn"
```python
import requests
import json
from requests.auth import HTTPBasicAuth

url = "https://n8n.nguyenngothuong.com/webhook/vinci-order-v2-190325"
auth = HTTPBasicAuth('[USERNAME]', '[PASSWORD]')

payload = {
  "data": {
    "filter_conditions": [{
      "field_name": "Trạng thái đơn",
      "operator": "is",
      "value": ["Nhận đơn"]
    }],
    "filter_conjunction": "and",
    "sorting_conditions": [
      {
        "field_name": "Ngày xuất",
        "order": "desc"
      }
    ]
  },
  "headers": [
    {
      "header_key": "Content-Type",
      "value": "application/json"
    }
  ],
  "status": 200
}

response = requests.post(
  url,
  auth=auth,
  json=payload,
  timeout=30
)

print(json.dumps(response.json(), indent=2, ensure_ascii=False))
```

### Request để lấy đơn hàng theo khoảng thời gian
```python
import requests
import json
from requests.auth import HTTPBasicAuth

url = "https://n8n.nguyenngothuong.com/webhook/vinci-order-v2-190325"
auth = HTTPBasicAuth('[USERNAME]', '[PASSWORD]')

# Timestamp cho ngày 01/07/2025 00:00:00 GMT+7
start_date = 1738281600000

# Timestamp cho ngày 31/07/2025 23:59:59 GMT+7
end_date = 1740960000000

payload = {
  "data": {
    "filter_conditions": [
      {
        "field_name": "Ngày xuất",
        "operator": "isGreater",
        "value": ["ExactDate", start_date]
      },
      {
        "field_name": "Ngày xuất",
        "operator": "isLess",
        "value": ["ExactDate", end_date]
      }
    ],
    "filter_conjunction": "and",
    "sorting_conditions": [
      {
        "field_name": "Ngày xuất",
        "order": "desc"
      }
    ]
  },
  "headers": [
    {
      "header_key": "Content-Type",
      "value": "application/json"
    }
  ],
  "status": 200
}

response = requests.post(
  url,
  auth=auth,
  json=payload,
  timeout=30
)

print(json.dumps(response.json(), indent=2, ensure_ascii=False))
```

## Lưu ý
1. API có thể mất thời gian phản hồi, nên cần đặt timeout đủ lớn (30 giây)
2. Nên xử lý lỗi và retry trong trường hợp mạng không ổn định
3. Dữ liệu trả về đã được xử lý và làm sạch, không cần phân trang
4. Các trường dữ liệu có thể thay đổi tùy theo cấu hình hệ thống
5. Khi làm việc với trường ngày tháng, sử dụng timestamp dạng milliseconds (Unix epoch time)
6. Trường export_document_link có thể null nếu đơn hàng chưa có phiếu xuất kho 