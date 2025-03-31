import { getClient } from '../config/mail.config.js';

// Hàm gửi email xác nhận đơn hàng
export const sendEmailReceipt = function (order) {
  const mailClient = getClient(); // Lấy client từ cấu hình Mailgun

  mailClient.messages
    .create('sandbox80bf0ab584cb42dbbf5cf0e9a249e188.mailgun.org', {
      from: 'orders@fooddelivery.com', // Địa chỉ email gửi đi
      to: order.user.email, // Địa chỉ email của người nhận (khách hàng)
      subject: `Order ${order.id} is being processed`, // Tiêu đề email
      html: getReceiptHtml(order), // Nội dung email được tạo từ đơn hàng
    })
    .then(msg => console.log(msg)) // In ra thông báo thành công
    .catch(err => console.log(err)); // In ra lỗi nếu có
};

// Hàm tạo nội dung email HTML dựa trên đơn hàng
const getReceiptHtml = function (order) {
  return `
  <html>
    <head>
      <style>
      table {
        border-collapse: collapse;
        max-width: 35rem;
        width: 100%;
      }
      th, td {
        text-align: left;
        padding: 8px;
      }
      th {
        border-bottom: 1px solid #dddddd;
      }
      </style>
    </head>
    <body>
      <h1>Order Payment Confirmation</h1>
      <p>Dear ${order.name},</p>
      <p>Thank you for choosing us! Your order has been successfully paid and is now being processed.</p>
      <p><strong>Tracking ID:</strong> ${order.id}</p>
      <p><strong>Order Date:</strong> ${order.createdAt
        .toISOString()
        .replace('T', ' ')
        .substr(0, 16)}</p>

      <h2>Order Details</h2>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Unit Price</th>
            <th>Quantity</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
        ${order.items
          .map(
            item => `
            <tr>
              <td>${item.food.name}</td>
              <td>$${item.food.price}</td>
              <td>${item.quantity}</td>    
              <td>$${item.price.toFixed(2)}</td>
            </tr>
            `
          )
          .join('\n')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3"><strong>Total:</strong></td>
            <td>$${order.totalPrice}</td>
          </tr>
        </tfoot>
      </table>

      <p><strong>Shipping Address:</strong> ${order.address}</p>
    </body>
  </html>
  `;
};