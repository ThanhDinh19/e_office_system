import StatCard from '../../components/widgets/StatCard';

export default function HRDashboard() {
  return (
    <>
      <h2>Dashboard Nhân sự (HR)</h2>

      {/* === ROW 1: STAT CARDS === */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
        }}
      >
        <StatCard title="Tổng nhân viên" value={120} />
        <StatCard title="Nhân viên mới (tháng)" value={5} />
        <StatCard title="HĐ sắp hết hạn" value={8} />
        <StatCard title="Đơn nghỉ chờ duyệt" value={12} />
      </div>

      {/* === ROW 2 === */}
      <div
        style={{
          marginTop: 24,
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: 16,
        }}
      >
        {/* Biểu đồ biến động nhân sự */}
        <div
          style={{
            background: '#fff',
            padding: 16,
            borderRadius: 8,
          }}
        >
          <h4>Biến động nhân sự</h4>
          <p style={{ color: '#6b7280' }}>
            (Vào / Ra theo tháng – sẽ gắn chart)
          </p>
          <div
            style={{
              height: 200,
              background: '#f3f4f6',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Chart Placeholder
          </div>
        </div>

        {/* Hợp đồng sắp hết hạn */}
        <div
          style={{
            background: '#fff',
            padding: 16,
            borderRadius: 8,
          }}
        >
          <h4>Hợp đồng sắp hết hạn</h4>
          <ul style={{ paddingLeft: 16 }}>
            <li>Nguyễn Văn A – 25 ngày</li>
            <li>Trần Thị B – 40 ngày</li>
            <li>Lê Văn C – 45 ngày</li>
          </ul>
        </div>
      </div>

      {/* === ROW 3 === */}
      <div
        style={{
          marginTop: 24,
          background: '#fff',
          padding: 16,
          borderRadius: 8,
        }}
      >
        <h4>Đơn nghỉ chờ HR duyệt</h4>

        <table width="100%" cellPadding={8}>
          <thead>
            <tr style={{ textAlign: 'left' }}>
              <th>Nhân viên</th>
              <th>Loại phép</th>
              <th>Từ ngày</th>
              <th>Đến ngày</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Nguyễn Văn A</td>
              <td>Nghỉ phép năm</td>
              <td>12/02</td>
              <td>14/02</td>
              <td>
                <span style={{ color: 'orange' }}>Chờ duyệt</span>
              </td>
            </tr>
            <tr>
              <td>Trần Thị B</td>
              <td>Nghỉ không lương</td>
              <td>20/02</td>
              <td>21/02</td>
              <td>
                <span style={{ color: 'orange' }}>Chờ duyệt</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
