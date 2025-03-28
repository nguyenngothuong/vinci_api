# API Đơn Hàng V1

## Thông tin chung
- **Endpoint**: `https://open.larksuite.com/anycross/trigger/callback/[ENDPOINT_ID]`
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

### Query Parameters
- **page_size** (tùy chọn): Số lượng kết quả trả về mỗi trang
  - Giá trị mặc định: 50
  - Giá trị tối đa: 500
- **page_identifier** (tùy chọn): Token để lấy trang tiếp theo
  - Giá trị ban đầu: null
  - Các request tiếp theo: sử dụng giá trị page_token từ response trước đó

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
  "msg": "success",
  "data": {
    "page_token": "cGFnZVRva2VuOjUw",
    "total": 2,
    "has_more": true,
    "items": [
      {
        "order_id": "xxx-xxx",
        "invoice_number": "123",
        "order_code": "DH123",
        "export_date": "01/03/2025",
        "status": "Nhận đơn",
        "region": "Bắc",
        "customer_group": "ĐL",
        
        "recipient": {
          "name": "Nguyễn Văn A",
          "phone": "0123456789",
          "address": "123 Đường ABC, Quận XYZ, TP HCM"
        },
        
        "products": {
          "packages_quantity": 10,
          "items_quantity": 300,
          "bags_quantity": 5,
          "gift_quantity": 2,
          "description": "Quần Kidmac M x 5, Dán Kidmac S x 5"
        },
        
        "payment": {
          "total_amount": 5000000,
          "paid_amount": 3000000,
          "debt_amount": 2000000,
          "cod_amount": 2000000
        },
        
        "shipping": {
          "shipping_fee": 200000,
          "fee_per_package": 20000,
          "shipping_payment_status": "Chưa thanh toán"
        }
      }
    ]
  }
}
```

## Các trường dữ liệu quan trọng

### Thông tin đơn hàng
- **order_id**: Mã định danh đơn hàng
- **invoice_number**: Mã phiếu
- **order_code**: Mã đơn hàng
- **export_date**: Ngày xuất đơn (DD/MM/YYYY)
- **status**: Trạng thái đơn hàng
  - Nhận đơn: BP Sales tạo đơn trên Lark
  - Đồng bộ: Hệ thống đẩy đơn từ Lark sang WMS
  - Xử lý: Kho soạn hàng, xử lý bắn kiện qua PDA bốc xếp lên xe 
  - Xuất kho: Kho scan hoàn thành trên PDA
  - Đã hủy: Trạng thái hủy đơn
- **region**: Khu vực
- **customer_group**: Nhóm khách hàng

### Thông tin người nhận
- **recipient.name**: Tên người nhận
- **recipient.phone**: Số điện thoại
- **recipient.address**: Địa chỉ giao hàng

### Thông tin hàng hóa
- **products.packages_quantity**: Số lượng kiện
- **products.items_quantity**: Số lượng cái
- **products.bags_quantity**: Số lượng túi
- **products.gift_quantity**: Số lượng tặng
- **products.description**: Mô tả chi tiết hàng hóa

### Thông tin thanh toán
- **payment.total_amount**: Tổng tiền đơn hàng
- **payment.paid_amount**: Số tiền đã thanh toán
- **payment.debt_amount**: Số tiền còn nợ
- **payment.cod_amount**: Số tiền thu hộ

### Thông tin vận chuyển
- **shipping.shipping_fee**: Phí vận chuyển
- **shipping.fee_per_package**: Giá vận chuyển trên mỗi kiện
- **shipping.shipping_payment_status**: Trạng thái thanh toán vận chuyển

## Ví dụ

### Request để lấy đơn hàng có trạng thái "Nhận đơn"
```python
import requests
import json
from requests.auth import HTTPBasicAuth

url = "https://open.larksuite.com/anycross/trigger/callback/[ENDPOINT_ID]"
auth = HTTPBasicAuth('[USERNAME]', '[PASSWORD]')

# Query parameters
query_params = {
    "page_size": 50,
    "page_identifier": None
}

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
  params=query_params,
  timeout=30
)

print(json.dumps(response.json(), indent=2, ensure_ascii=False))
```

### Request để lấy đơn hàng theo khoảng thời gian
```python
import requests
import json
from requests.auth import HTTPBasicAuth

url = "https://open.larksuite.com/anycross/trigger/callback/[ENDPOINT_ID]"
auth = HTTPBasicAuth('[USERNAME]', '[PASSWORD]')

# Query parameters
query_params = {
    "page_size": 50,
    "page_identifier": None
}

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
  params=query_params,
  timeout=30
)

print(json.dumps(response.json(), indent=2, ensure_ascii=False))
```

### Phân trang
```python
# Lấy page_token từ response trước
page_token = response.json()["data"]["page_token"]

# Nếu page_token không phải null, tiếp tục lấy trang tiếp theo
if page_token:
    query_params["page_identifier"] = page_token
    next_page_response = requests.post(
        url,
        auth=auth,
        json=payload,
        params=query_params,
        timeout=30
    )
```

## Lưu ý
1. API có thể mất thời gian phản hồi, nên cần đặt timeout đủ lớn (30 giây)
2. Nên xử lý lỗi và retry trong trường hợp mạng không ổn định
3. Dữ liệu trả về có thể rất lớn, cần xử lý phân trang hợp lý
4. Các trường dữ liệu có thể thay đổi tùy theo cấu hình hệ thống
5. Tham số page_size và page_identifier nên được truyền qua query parameters
6. Khi làm việc với trường ngày tháng, sử dụng timestamp dạng milliseconds (Unix epoch time) 