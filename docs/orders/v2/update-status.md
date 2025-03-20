# API Cập Nhật Trạng Thái Đơn Hàng V2

API này cho phép cập nhật trạng thái của nhiều đơn hàng cùng một lúc.

## Endpoint

```
POST https://open.larksuite.com/anycross/trigger/callback/d760c381-d3e8-452e-9fcb-0b9ed930095a
```

## Xác thực

Basic Authentication

## Request

### Body

```json
{
  "orders": [
    {
      "order_code": "DH123",
      "status": "Đã giao"
    },
    {
      "order_code": "DH124",
      "status": "Xuất kho"
    }
  ]
}
```

### Tham số

| Tên | Loại | Bắt buộc | Mô tả |
|-----|------|----------|-------|
| orders | Array | Có | Mảng các đơn hàng cần cập nhật |
| orders[].order_code | String | Có | Mã đơn hàng (phải bắt đầu bằng "DH") |
| orders[].status | String | Có | Trạng thái mới của đơn hàng |

### Giá trị hợp lệ cho trạng thái (status)

- `Nhận đơn`: Đơn hàng mới được tạo
- `Xử lý`: Đơn hàng đang được xử lý
- `Xuất kho`: Đơn hàng đã xuất kho
- `Đang giao`: Đơn hàng đang được giao
- `Đã giao`: Đơn hàng đã giao thành công
- `Đã huỷ`: Đơn hàng đã bị hủy

## Response

### Thành công

```json
{
  "success": true,
  "message": "Đã chuẩn bị 2 records để cập nhật",
  "data": {
    "records": [
      {
        "record_id": "recuEm77GzbLQD",
        "fields": {
          "Trạng thái đơn": "Đã giao"
        }
      },
      {
        "record_id": "recuEmi44tuWma",
        "fields": {
          "Trạng thái đơn": "Xuất kho"
        }
      }
    ],
    "status_changes": [
      {
        "order_code": "DH123",
        "record_id": "recuEm77GzbLQD",
        "previous_status": "Xử lý",
        "new_status": "Đã giao"
      },
      {
        "order_code": "DH124",
        "record_id": "recuEmi44tuWma",
        "previous_status": "Nhận đơn",
        "new_status": "Xuất kho"
      }
    ]
  },
  "stats": {
    "total": 2,
    "matched": 2,
    "unmatched": 0
  },
  "errors": []
}
```

### Một phần đơn hàng không tìm thấy

```json
{
  "success": true,
  "message": "Đã chuẩn bị 1 records để cập nhật",
  "data": {
    "records": [
      {
        "record_id": "recuEm77GzbLQD",
        "fields": {
          "Trạng thái đơn": "Đã giao"
        }
      }
    ],
    "status_changes": [
      {
        "order_code": "DH123",
        "record_id": "recuEm77GzbLQD",
        "previous_status": "Xử lý",
        "new_status": "Đã giao"
      }
    ]
  },
  "stats": {
    "total": 2,
    "matched": 1,
    "unmatched": 1
  },
  "errors": [
    "Không tìm thấy đơn hàng có mã: DH999"
  ]
}
```

### Lỗi

```json
{
  "success": false,
  "message": "Dữ liệu không hợp lệ",
  "data": {},
  "errors": [
    "orders[0]: status không hợp lệ. Các giá trị hợp lệ: Nhận đơn, Xử lý, Đã giao, Đã huỷ, Đang giao, Xuất kho"
  ]
}
```

## Giới hạn

- Tối đa 100 đơn hàng mỗi request
- Nội bộ API sẽ tự động chia thành các batch, mỗi batch tối đa 50 đơn hàng để đảm bảo hiệu suất

## Ghi chú

- API này sẽ kiểm tra và xác thực dữ liệu đầu vào trước khi thực hiện cập nhật
- Nếu một đơn hàng không tìm thấy, API vẫn sẽ cập nhật các đơn hàng khác thành công
- Kết quả trả về sẽ bao gồm danh sách các đơn hàng đã cập nhật và chi tiết thay đổi trạng thái
- Nếu không tìm thấy đơn hàng nào phù hợp, API sẽ trả về lỗi 