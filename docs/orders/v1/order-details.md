# API Chi Tiết Đơn Hàng V1

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
        "order_detail_id": "recXXXXXX",
        "product": {
          "product_id": "recuCypvZunOik",
          "product_name": "Quần Kidmac M",
          "category": "Tã quần",
          "product_line": "Diapers",
          "size": "M",
          "unit": "Kiện",
          "pieces_per_unit": 300
        },
        "quantity": 10,
        "unit_price": 720000,
        "total_amount": 7200000,
        "total_pieces": 3000,
        "customer": {
          "customer_name": "Phương Anh",
          "region": "Bắc"
        },
        "status": "Nhận đơn",
        "export_date": 1740934800000,
        "export_month": "2025/03",
        "invoice_number": "497",
        "display_code": "Quần Kidmac M: 10"
      }
    ]
  }
}
```

## Các trường dữ liệu quan trọng

### Thông tin chi tiết đơn hàng
- **order_detail_id**: ID chi tiết đơn hàng
- **product**: Thông tin sản phẩm
  - product_id: ID sản phẩm
  - product_name: Tên sản phẩm
  - category: Danh mục
  - product_line: Dòng sản phẩm
  - size: Kích thước
  - unit: Đơn vị tính
  - pieces_per_unit: Số lượng sản phẩm trong một đơn vị
- **quantity**: Số lượng đặt hàng
- **unit_price**: Đơn giá
- **total_amount**: Tổng tiền
- **total_pieces**: Tổng số sản phẩm
- **customer**: Thông tin khách hàng
  - customer_name: Tên khách hàng
  - region: Khu vực
- **status**: Trạng thái
- **export_date**: Ngày xuất hàng (timestamp)
- **export_month**: Tháng xuất hàng (YYYY/MM)
- **invoice_number**: Số hoá đơn
- **display_code**: Mã hiển thị

## Ví dụ

### Request để lấy chi tiết đơn hàng có trạng thái "Nhận đơn"
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

### Request để lấy chi tiết đơn hàng theo khoảng thời gian
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