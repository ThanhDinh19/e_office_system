export default function Notification({ title, message, type }) {
  return (
    <div className={`notification ${type}`}>
      <h4>{title}</h4>
      <p>{message}</p>
    </div>
  );
}