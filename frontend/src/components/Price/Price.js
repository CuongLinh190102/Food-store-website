import React from 'react';

// Component này được sử dụng để hiển thị giá tiền với định dạng tiền tệ
export default function Price({ price, locale, currency }) {
  const formatPrice = () =>
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(price);

  return <span>{formatPrice()}</span>;
}

Price.defaultProps = {
  locale: 'en-US',
  currency: 'USD',
};
