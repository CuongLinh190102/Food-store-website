import classes from './inputContainer.module.css';

// Input Container được sử dụng để bao bọc các phần tử đầu vào bằng nhãn và màu nền
export default function InputContainer({ label, bgColor, children }) {
  return (
    <div className={classes.container} style={{ backgroundColor: bgColor }}>
      <label className={classes.label}>{label}</label>
      <div className={classes.content}>{children}</div>
    </div>
  );
}
