import React from 'react';

// Thiết lập giá trị mặc định cho props 'options' nếu không được truyền vào
DateTime.defaultProps = {
  options: {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  },
};

export default function DateTime({
  date,
  options: { weekday, year, month, day, hour, minute, second },
}) {
  var currentLocale = new Intl.DateTimeFormat().resolvedOptions().locale;

  // Hàm định dạng ngày dựa trên locale và các tùy chọn
  const getDate = () =>
    new Intl.DateTimeFormat(currentLocale, {
      year,
      month,
      weekday,
      day,
      hour,
      minute,
      second,
    }).format(Date.parse(date));
     // Hiển thị ngày đã định dạng
  return <>{getDate()}</>;
}
