export default function StatCard({ title, value }) {
  return (
    <div style={{
      background: '#fff',
      padding: 16,
      borderRadius: 8,
      boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
    }}>
      <h4>{title}</h4>
      <p style={{ fontSize: 24, fontWeight: 'bold' }}>{value}</p>
    </div>
  );
}
