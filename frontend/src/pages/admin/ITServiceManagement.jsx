import { useState, useEffect } from 'react';
import './ITServiceManagement.css';
import { addITService, getITServices, editITService, deleteITService } from '../../services/ITService.service';


export default function ITServiceManagement() {
  const [services, setServices] = useState([
    {
      id: 1,
      code: 'NET_001',
      name: 'Cài đặt mạng LAN',
      service_group: 'Mạng & Internet',
      description: 'Thiết lập và cấu hình mạng nội bộ cho văn phòng',
      target_object: 'All',
      is_active: true,
      created_at: '2024-01-15'
    },
    {
      id: 2,
      code: 'SYS_001',
      name: 'Cài đặt Windows',
      service_group: 'Hệ điều hành',
      description: 'Cài đặt và cấu hình Windows 10/11',
      target_object: 'User',
      is_active: true,
      created_at: '2024-01-16'
    },
    {
      id: 3,
      code: 'SEC_001',
      name: 'Bảo mật hệ thống',
      service_group: 'Bảo mật',
      description: 'Kiểm tra và nâng cấp bảo mật',
      target_object: 'IT',
      is_active: true,
      created_at: '2024-01-17'
    }
  ]);

  const [serviceGroups, setServiceGroups] = useState([
    'Mạng & Internet',
    'Hệ điều hành',
    'Bảo mật',
    'Phần mềm',
    'Phần cứng'
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentService, setCurrentService] = useState(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [filterGroup, setFilterGroup] = useState('All');
  const [filterTarget, setFilterTarget] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [itservices, setITService] = useState([]);

  const fetchITServices = async () => {
    const data = await getITServices();
    setITService(data);
  }

  useEffect(() => {
    fetchITServices();
  }, []);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    service_group: '',
    description: '',
    target_object: 'User',
    is_active: true
  });

  const targetObjects = ['User', 'IT', 'Admin', 'System', 'All'];

  // Generate code automatically
  const generateCode = (group) => {
    const groupPrefixes = {
      'Mạng & Internet': 'NET',
      'Hệ điều hành': 'SYS',
      'Bảo mật': 'SEC',
      'Phần mềm': 'APP',
      'Phần cứng': 'HW'
    };
    const prefix = groupPrefixes[group] || 'SRV';
    const existing = itservices.filter(s => s.code.startsWith(prefix));
    const nextNum = String(existing.length + 1).padStart(3, '0');
    return `${prefix}_${nextNum}`;
  };

  // Add history entry
  const addHistory = (action, serviceName, details) => {
    const entry = {
      id: Date.now(),
      action,
      serviceName,
      details,
      timestamp: new Date().toLocaleString('vi-VN')
    };
    setHistory(prev => [entry, ...prev].slice(0, 50)); // Keep last 50 entries
  };

  const handleOpenModal = (mode, service = null) => {
    setModalMode(mode);
    if (mode === 'edit' && service) {
      setCurrentService(service);
      setFormData(service);
    } else {
      setFormData({
        code: '',
        name: '',
        service_group: serviceGroups[0] || '',
        description: '',
        target_object: 'User',
        is_active: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentService(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (modalMode === 'add') {
      const newService = {
        ...formData,
        code: formData.code || generateCode(formData.service_group),
        // created_at: new Date().toISOString().split('T')[0]
      };
      // setServices([...services, newService]);
      addHistory('Thêm mới', newService.name, `Mã: ${newService.code}, Nhóm: ${newService.service_group}`);

      const added = await addITService(newService);
      
      if(added?.success === true){
        await fetchITServices();
      }
      else if(added?.success === false){
        alert('Failed to add');
      }

    } else {
      const oldService = itservices.find(s => s.id === currentService.id);
      const changes = [];

      if (!formData.code || !formData.name || !formData.service_group || !formData.target_object) {
        alert('Fill full information');
        return;
      }

      const edit = await editITService(oldService.id, formData);

      if(edit?.success === true){
        alert('Update successfull');
        await fetchITServices();
      }
      else{
        alert('Update failed');
        return;
      }

      if (oldService.description !== formData.description) {
        changes.push(`Mô tả: "${oldService.description}" → "${formData.description}"`);
      }
      if (oldService.service_group !== formData.service_group) {
        changes.push(`Nhóm: "${oldService.service_group}" → "${formData.service_group}"`);
      }
      if (oldService.target_object !== formData.target_object) {
        changes.push(`Đối tượng: "${oldService.target_object}" → "${formData.target_object}"`);
      }
      setServices(services.map(s =>
        s.id === currentService.id ? { ...formData, id: s.id, created_at: s.created_at } : s
      ));

      if (changes.length > 0) {
        addHistory('Cập nhật', formData.name, changes.join('; '));
      }
    }
    handleCloseModal();
  };

  const handleDelete = async (service) => {
    if (window.confirm(`Bạn có chắc muốn xóa dịch vụ "${service.name}"?`)) {
      const id = service.id;
      const deleted = await deleteITService(id);
      if(deleted?.success === true){
        await fetchITServices();
      }
      else{
        alert('delete failed')
      }
      await addHistory('Xóa', service.name, `Mã: ${service.code}`);
    }
  };

  const handleToggleActive = (service) => {
    setServices(services.map(s =>
      s.id === service.id ? { ...s, is_active: !s.is_active } : s
    ));
    addHistory(
      service.is_active ? 'Vô hiệu hóa' : 'Kích hoạt',
      service.name,
      `Trạng thái: ${service.is_active ? 'Active → Inactive' : 'Inactive → Active'}`
    );
  };

  const handleAddGroup = () => {
    if (newGroupName.trim() && !serviceGroups.includes(newGroupName.trim())) {
      setServiceGroups([...serviceGroups, newGroupName.trim()]);
      addHistory('Thêm nhóm', newGroupName.trim(), 'Nhóm dịch vụ mới');
      setNewGroupName('');
      setShowGroupModal(false);
    }
  };

  const filteredServices = itservices.filter(service => {
    const matchGroup = filterGroup === 'All' || service.service_group === filterGroup;
    const matchTarget = filterTarget === 'All' || service.target_object === filterTarget;
    const matchSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchGroup && matchTarget && matchSearch;
  });

  const stats = {
    total: services.length,
    active: services.filter(s => s.is_active).length,
    byGroup: serviceGroups.map(group => ({
      name: group,
      count: services.filter(s => s.service_group === group).length
    }))
  };

  return (
    <div className="container">
      <header className="header">
        <h1>🖥️ Quản lý Dịch vụ IT</h1>
        <div className="header-actions">
          <button type="button" className="btn btn-outline" onClick={() => setShowHistory(!showHistory)}>
            📋 Lịch sử thay đổi
          </button>
          <button type="button" className="btn btn-outline" onClick={() => handleOpenModal('add')}>
            ➕ Dịch vụ mới
          </button>
        </div>
      </header>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Tổng dịch vụ</div>
        </div>
        <div className="stat-card active">
          <div className="stat-value">{stats.active}</div>
          <div className="stat-label">Đang hoạt động</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{serviceGroups.length}</div>
          <div className="stat-label">Nhóm dịch vụ</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Tìm kiếm theo tên, mã, mô tả..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="filter-select"
          value={filterGroup}
          onChange={(e) => setFilterGroup(e.target.value)}
        >
          <option value="All">Tất cả nhóm</option>
          {serviceGroups.map(group => (
            <option key={group} value={group}>{group}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={filterTarget}
          onChange={(e) => setFilterTarget(e.target.value)}
        >
          <option value="All">Tất cả đối tượng</option>
          {targetObjects.map(target => (
            <option key={target} value={target}>{target}</option>
          ))}
        </select>

        <button className="btn btn-outline" onClick={() => setShowGroupModal(true)}>
          ➕ Nhóm mới
        </button>
      </div>

      {/* History Sidebar */}
      {showHistory && (
        <div className="history-sidebar">
          <div className="history-header">
            <h3>📜 Lịch sử thay đổi</h3>
            <button onClick={() => setShowHistory(false)}>✕</button>
          </div>
          <div className="history-content">
            {history.length === 0 ? (
              <p className="no-history">Chưa có thay đổi nào</p>
            ) : (
              history.map(entry => (
                <div key={entry.id} className="history-item">
                  <div className="history-action">{entry.action}</div>
                  <div className="history-service">{entry.serviceName}</div>
                  <div className="history-details">{entry.details}</div>
                  <div className="history-time">{entry.timestamp}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Services Table */}
      <div className="table-container">
        <table className="services-table">
          <thead>
            <tr>
              <th>Mã dịch vụ</th>
              <th>Tên dịch vụ</th>
              <th>Nhóm dịch vụ</th>
              <th>Mô tả</th>
              <th>Đối tượng</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">Không tìm thấy dịch vụ nào</td>
              </tr>
            ) : (
              filteredServices.map(service => (
                <tr key={service.id} className={!service.is_active ? 'inactive-row' : ''}>
                  <td><span className="code-badge">{service.code}</span></td>
                  <td><strong>{service.name}</strong></td>
                  <td><span className="group-tag">{service.service_group}</span></td>
                  <td className="description-cell">{service.description}</td>
                  <td><span className={`target-badge target-${service.target_object.toLowerCase()}`}>
                    {service.target_object}
                  </span></td>
                  <td>
                    <button
                      className={`status-toggle ${service.is_active ? 'active' : 'inactive'}`}
                      onClick={() => handleToggleActive(service)}
                    >
                      {service.is_active ? '✓ Active' : '✕ Inactive'}
                    </button>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon edit"
                        onClick={() => handleOpenModal('edit', service)}
                        title="Chỉnh sửa"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon delete"
                        onClick={() => handleDelete(service)}
                        title="Xóa"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Service Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalMode === 'add' ? '➕ Thêm dịch vụ mới' : '✏️ Chỉnh sửa dịch vụ'}</h2>
              <button className="close-btn" onClick={handleCloseModal}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Mã dịch vụ</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="Tự động tạo nếu để trống"
                  />
                </div>

                <div className="form-group">
                  <label>Tên dịch vụ *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Nhóm dịch vụ *</label>
                  <select
                    value={formData.service_group}
                    onChange={(e) => setFormData({ ...formData, service_group: e.target.value })}
                    required
                  >
                    <option value="">-- Chọn nhóm --</option>
                    {serviceGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Đối tượng sử dụng *</label>
                  <select
                    value={formData.target_object}
                    onChange={(e) => setFormData({ ...formData, target_object: e.target.value })}
                    required
                  >
                    {targetObjects.map(target => (
                      <option key={target} value={target}>{target}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Mô tả</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    placeholder="Nhập mô tả chi tiết về dịch vụ..."
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    Kích hoạt dịch vụ
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={handleCloseModal}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-outline">
                  {modalMode === 'add' ? 'Thêm mới' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Group Modal */}
      {showGroupModal && (
        <div className="modal-overlay" onClick={() => setShowGroupModal(false)}>
          <div className="modal small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>➕ Thêm nhóm dịch vụ mới</h2>
              <button className="close-btn" onClick={() => setShowGroupModal(false)}>✕</button>
            </div>

            <div className="form-group">
              <label>Tên nhóm *</label>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Nhập tên nhóm dịch vụ..."
                autoFocus
              />
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowGroupModal(false)}>
                Hủy
              </button>
              <button className="btn btn-primary" onClick={handleAddGroup}>
                Thêm nhóm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
