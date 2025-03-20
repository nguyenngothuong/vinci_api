/**
 * Prepare Batch Update
 * --------------------------------
 * Chuẩn bị dữ liệu cho việc cập nhật hàng loạt trạng thái đơn hàng
 *
 * Input: 
 * - Dữ liệu từ search_records: thông tin về các bản ghi đã tìm được
 * - Dữ liệu từ webhook2 hoặc validate_batch_update: thông tin orders cần cập nhật trạng thái
 * 
 * Output: Object chứa records để thực hiện batch update
 */

// Lấy tất cả input từ các node trước đó
const searchRecordsData = $input.all();
const webhookData = $('webhook2').first().json || {};

// Log để debug
console.log('STEP 1: Thu thập dữ liệu đầu vào');
console.log('Search Records Data length:', searchRecordsData.length);
console.log('Webhook Data:', JSON.stringify(webhookData).slice(0, 200) + '...');

// =========================================================================
// STEP 2: Tổng hợp và làm sạch records từ searchRecordsData
// =========================================================================
console.log('\nSTEP 2: Tổng hợp và làm sạch records');

// Tổng hợp tất cả các records từ searchRecordsData
let rawRecords = [];
searchRecordsData.forEach((item, index) => {
  if (item.json && item.json.code === 0 && item.json.data && Array.isArray(item.json.data.items)) {
    console.log(`Response ${index + 1}: Tìm thấy ${item.json.data.items.length} records`);
    rawRecords = rawRecords.concat(item.json.data.items);
  }
});

console.log(`Tổng số raw records: ${rawRecords.length}`);

// Hàm trích xuất giá trị text từ cấu trúc phức tạp của Larkbase
function extractTextValue(field) {
  if (!field) return null;
  
  // Nếu là cấu trúc {type: 1, value: [{text: "...", type: "text"}]}
  if (field && field.type === 1 && Array.isArray(field.value) && field.value.length > 0 && field.value[0].text) {
    return field.value[0].text;
  }
  
  // Nếu đã là string đơn giản
  if (typeof field === 'string') {
    return field;
  }
  
  return null;
}

// Làm sạch records để dễ xử lý
function cleanRecords(rawRecords) {
  const cleanedRecords = [];
  
  rawRecords.forEach((record, index) => {
    if (!record || !record.fields) return;
    
    const orderCodeField = record.fields.order_code;
    const orderCode = extractTextValue(orderCodeField);
    const recordId = record.record_id;
    const currentStatus = record.fields["Trạng thái đơn"];
    
    if (orderCode && recordId) {
      cleanedRecords.push({
        order_code: orderCode,
        record_id: recordId,
        current_status: currentStatus
      });
      
      console.log(`Record ${index + 1}: ${orderCode} -> ${recordId} (${currentStatus || 'không có status'})`);
    } else {
      console.log(`Record ${index + 1}: Không tìm thấy order_code hoặc record_id, fields:`, JSON.stringify(record.fields));
    }
  });
  
  return cleanedRecords;
}

// Làm sạch records
const cleanedRecords = cleanRecords(rawRecords);
console.log(`Số records đã làm sạch: ${cleanedRecords.length}`);

// Tạo map để tìm kiếm nhanh theo order_code
const orderCodeMap = {};
cleanedRecords.forEach(record => {
  orderCodeMap[record.order_code] = {
    record_id: record.record_id,
    current_status: record.current_status
  };
});

console.log('Order Code Map:', JSON.stringify(orderCodeMap));

// =========================================================================
// STEP 3: Xử lý danh sách orders cần cập nhật từ Webhook
// =========================================================================
console.log('\nSTEP 3: Xử lý danh sách orders cần cập nhật');

// Lấy danh sách orders cần cập nhật từ Webhook hoặc validate_batch_update
// Kiểm tra nhiều cấu trúc phổ biến 
let ordersToUpdate = [];

if (webhookData.body && Array.isArray(webhookData.body.orders)) {
  // Cấu trúc webhook.body.orders
  ordersToUpdate = webhookData.body.orders;
  console.log('Lấy orders từ webhook.body.orders');
} else if (webhookData.body && webhookData.body.data && Array.isArray(webhookData.body.data.orders)) {
  // Cấu trúc webhook.body.data.orders
  ordersToUpdate = webhookData.body.data.orders;
  console.log('Lấy orders từ webhook.body.data.orders');
} else if (webhookData.orders && Array.isArray(webhookData.orders)) {
  // Cấu trúc webhook.orders
  ordersToUpdate = webhookData.orders;
  console.log('Lấy orders từ webhook.orders');
} else {
  console.log('Không tìm thấy cấu trúc orders, thử tìm trực tiếp:', JSON.stringify(webhookData));
  
  // Cố gắng tìm kiếm trực tiếp trong webhook data
  for (const key in webhookData) {
    if (typeof webhookData[key] === 'object' && webhookData[key] !== null) {
      // Nếu là object, kiểm tra xem có chứa orders không
      if (Array.isArray(webhookData[key].orders)) {
        ordersToUpdate = webhookData[key].orders;
        console.log(`Tìm thấy orders trong webhookData.${key}.orders`);
        break;
      } else if (webhookData[key].body && Array.isArray(webhookData[key].body.orders)) {
        ordersToUpdate = webhookData[key].body.orders;
        console.log(`Tìm thấy orders trong webhookData.${key}.body.orders`);
        break;
      }
    }
  }
}

// Log toàn bộ webhook data nếu vẫn không tìm thấy
if (ordersToUpdate.length === 0) {
  console.log('Không tìm thấy orders trong webhook, full data:', JSON.stringify(webhookData));
  
  // Thử lấy từ Webhook raw
  const rawWebhook = $('webhook2').raw;
  if (rawWebhook) {
    console.log('Raw webhook:', JSON.stringify(rawWebhook).slice(0, 200) + '...');
    // Thử một cấu trúc khác
    if (rawWebhook.body && typeof rawWebhook.body === 'string') {
      try {
        const parsedBody = JSON.parse(rawWebhook.body);
        if (Array.isArray(parsedBody.orders)) {
          ordersToUpdate = parsedBody.orders;
          console.log('Lấy orders từ JSON.parse(rawWebhook.body).orders');
        }
      } catch (e) {
        console.log('Lỗi parse webhook body:', e.message);
      }
    }
  }
}

console.log(`Cần cập nhật ${ordersToUpdate.length} orders`);
console.log('Orders cần cập nhật:', JSON.stringify(ordersToUpdate));

// =========================================================================
// STEP 4: Chuẩn bị records để cập nhật
// =========================================================================
console.log('\nSTEP 4: Chuẩn bị records để cập nhật');

// Tạo danh sách records để cập nhật
const recordsToUpdate = [];
const statusChanges = [];
const notFoundOrders = [];

// Duyệt qua danh sách orders cần cập nhật
ordersToUpdate.forEach((order, index) => {
  const orderCode = order.order_code;
  const newStatus = order.status;
  
  if (!orderCode || !newStatus) {
    console.log(`Order ${index + 1}: Thiếu order_code hoặc status, data:`, JSON.stringify(order));
    return;
  }
  
  console.log(`Order ${index + 1}: ${orderCode} -> ${newStatus}`);
  
  if (orderCodeMap[orderCode]) {
    const recordInfo = orderCodeMap[orderCode];
    
    // Tạo record để cập nhật
    recordsToUpdate.push({
      record_id: recordInfo.record_id,
      fields: {
        "Trạng thái đơn": newStatus
      }
    });
    
    console.log(`  ✓ Tìm thấy: record_id = ${recordInfo.record_id}`);
    
    // Lưu lại thông tin thay đổi trạng thái
    if (recordInfo.current_status !== newStatus) {
      statusChanges.push({
        order_code: orderCode,
        record_id: recordInfo.record_id,
        previous_status: recordInfo.current_status,
        new_status: newStatus
      });
      console.log(`  ↻ Thay đổi trạng thái: ${recordInfo.current_status || 'N/A'} -> ${newStatus}`);
    } else {
      console.log(`  = Giữ nguyên trạng thái: ${newStatus}`);
    }
  } else {
    notFoundOrders.push(orderCode);
    console.log(`  ✗ Không tìm thấy order_code: ${orderCode}`);
  }
});

console.log(`\nKết quả xử lý:`);
console.log(`- Đã chuẩn bị ${recordsToUpdate.length} records để cập nhật`);
console.log(`- Có ${statusChanges.length} thay đổi trạng thái`);
console.log(`- Có ${notFoundOrders.length} orders không tìm thấy: ${notFoundOrders.join(', ')}`);

// Tạo kết quả trả về
const result = {
  success: recordsToUpdate.length > 0,
  message: recordsToUpdate.length > 0 
    ? `Đã chuẩn bị ${recordsToUpdate.length} records để cập nhật`
    : 'Không tìm thấy records phù hợp để cập nhật',
  data: {
    records: recordsToUpdate,
    status_changes: statusChanges,
    order_code_map: orderCodeMap // Thêm map vào kết quả để debug
  },
  stats: {
    total: ordersToUpdate.length,
    matched: recordsToUpdate.length,
    unmatched: notFoundOrders.length
  },
  errors: notFoundOrders.map(code => `Không tìm thấy đơn hàng có mã: ${code}`)
};

// Log kết quả cuối cùng
console.log('\nSTEP 5: Tạo kết quả trả về');
console.log('Success:', result.success);
console.log('Message:', result.message);
console.log('Records to update:', result.data.records.length);
console.log('Status changes:', result.data.status_changes.length);

// Trả về kết quả
return {
  json: result
};