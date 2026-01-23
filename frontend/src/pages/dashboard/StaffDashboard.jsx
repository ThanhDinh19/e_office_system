import StatCard from '../../components/widgets/StatCard';

export default function StaffDashboard() {
  return (
    <>
      <h2>Dashboard Cá nhân</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <StatCard title="Check-in hôm nay" value="08:32" />
        <StatCard title="Check-out gần nhất" value="17:45" />
        <StatCard title="Phép còn lại" value="5 ngày" />
      </div>

      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div style={{ background: '#fff', padding: 16, borderRadius: 8 }}>
          <h4>To-do cá nhân</h4>
          <ul>
            <li>Hoàn thành báo cáo</li>
            <li>Fix bug API</li>
          </ul>
        </div>

        <div style={{ background: '#fff', padding: 16, borderRadius: 8 }}>
          <h4>Thông báo mới</h4>
          <ul>
            <li>Thông báo nghỉ lễ</li>
            <li>Cập nhật quy định mới</li>
          </ul>
        </div>
      </div>
    </>
  );
}
