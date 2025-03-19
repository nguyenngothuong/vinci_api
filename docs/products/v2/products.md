# API Sản Phẩm V2

## Thông tin chung
- **Endpoint**: `https://n8n.nguyenngothuong.com/webhook/vinci-product-v2-190325`
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
  "cleaned_data": [
    {
      "product_id": "recvvuQUPC",
      "sku": "KMK_1202",
      "name": "Quần Kidmac M",
      "product_name": "Quần Kidmac M", 
      "product_code": "KM1202",
      "category": "Tã quần",
      "product_line": "Kidmac",
      "size": "M",
      "unit": "Kiện",
      "pieces_per_unit": 300,
      "quantity_per_unit": 300,
      "status": "Đang bán",
      "type": "Hàng bán",
      "is_for_sale": true,
      "created_at": 1733559498000,
      "sub_product_id": "recv8EymCw",
      "parent_product_id": null
    }
  ],
  "count": 51
}
```

## Các trường dữ liệu quan trọng

### Thông tin cơ bản
- **product_id**: ID sản phẩm
- **sku**: Mã SKU sản phẩm
- **name**: Tên sản phẩm
- **product_name**: Tên sản phẩm (trường tương thích)
- **product_code**: Mã sản phẩm nội bộ
- **category**: Danh mục sản phẩm (Tã quần, Tã dán, Khăn ướt, v.v.)
- **product_line**: Dòng sản phẩm (Kidmac, BabyLove, v.v.)
- **size**: Kích thước (S, M, L, XL, v.v.)

### Thông tin đóng gói
- **unit**: Đơn vị tính (Kiện, Thùng, Bao, v.v.)
- **pieces_per_unit**: Số lượng sản phẩm trong một đơn vị
- **quantity_per_unit**: Số lượng sản phẩm trong một đơn vị (trường tương thích)

### Thông tin khác
- **status**: Trạng thái sản phẩm (Đang bán, Ngừng bán, Hết hàng, v.v.)
- **type**: Loại hàng (Hàng bán, Hàng mẫu, v.v.)
- **is_for_sale**: Cờ đánh dấu sản phẩm có phải để bán hay không
- **created_at**: Ngày tạo (timestamp)
- **sub_product_id**: ID của sản phẩm con (null nếu không phải là sản phẩm cha)
- **parent_product_id**: ID của sản phẩm cha (null nếu không phải là sản phẩm con)

## Ví dụ

### Request để lấy sản phẩm có trạng thái "Đang bán"
```python
import requests
import json
from requests.auth import HTTPBasicAuth

url = "https://n8n.nguyenngothuong.com/webhook/vinci-product-v2-190325"
auth = HTTPBasicAuth('[USERNAME]', '[PASSWORD]')

payload = {
  "data": {
    "filter_conditions": [{
      "field_name": "Trạng thái",
      "operator": "is",
      "value": ["Đang bán"]
    }],
    "filter_conjunction": "and",
    "sorting_conditions": [
      {
        "field_name": "Ngày tạo",
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

### Request để lấy sản phẩm theo khoảng thời gian
```python
import requests
import json
from requests.auth import HTTPBasicAuth

url = "https://n8n.nguyenngothuong.com/webhook/vinci-product-v2-190325"
auth = HTTPBasicAuth('[USERNAME]', '[PASSWORD]')

# Timestamp cho ngày 01/07/2025 00:00:00 GMT+7
start_date = 1738281600000

# Timestamp cho ngày 31/07/2025 23:59:59 GMT+7
end_date = 1740960000000

payload = {
  "data": {
    "filter_conditions": [
      {
        "field_name": "Ngày tạo",
        "operator": "isGreater",
        "value": ["ExactDate", start_date]
      },
      {
        "field_name": "Ngày tạo",
        "operator": "isLess",
        "value": ["ExactDate", end_date]
      }
    ],
    "filter_conjunction": "and",
    "sorting_conditions": [
      {
        "field_name": "Ngày tạo",
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
6. Khi gửi request chứa tiếng Việt, cần đảm bảo sử dụng UTF-8 encoding 