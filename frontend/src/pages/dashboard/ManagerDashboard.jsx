import StatCard from '../../components/widgets/StatCard';

export default function ManagerDashboard() {
  return (
    <>
      <h2>Dashboard Quản lý</h2>

      {/* Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <StatCard title="Tổng nhân sự" value={120} />
        <StatCard title="Đi làm hôm nay" value={98} />
        <StatCard title="Nghỉ phép" value={12} />
      </div>

      {/* Row 2 */}
      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div style={{ background: '#fff', padding: 16, borderRadius: 8 }}>
          <h4>Biểu đồ chấm công</h4>
          <p>(Chart sẽ gắn sau)</p>
        </div>

        <div style={{ background: '#fff', padding: 16, borderRadius: 8 }}>
          <h4>Đơn chờ duyệt</h4>
          <ul>
            <li>Nguyễn Văn A – Nghỉ phép</li>
            <li>Trần Thị B – Tăng ca</li>
          </ul>
        </div>
      </div>
    </>
  );
}
