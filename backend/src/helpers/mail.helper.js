import { getClient } from '../config/mail.config.js';

// Hàm gửi email xác nhận đơn hàng
export const sendEmailReceipt = async function (order) {
  const mailClient = getClient(); 

  try {
    const { data, error } = await mailClient.emails.send({
      from: 'Food Delivery <onboarding@resend.dev>', // Hoặc domain bạn xác minh
      to: [order.user.email],
      subject: `Order ${order.id} is being processed`,
      html: getReceiptHtml(order), // GIỮ NGUYÊN NỘI DUNG
    });

    if (error) {
      console.error('Resend email error:', error);
    } else {
      console.log('Resend email sent successfully:', data);
    }
  } catch (err) {
    console.error('Unexpected Resend error:', err);
  }
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