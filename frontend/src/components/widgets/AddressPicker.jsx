import { useState, useEffect, useRef } from 'react';
import locations from './location.json';

export const AddressPicker = ({ value, onChange }) => {
    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');
    const [detail, setDetail] = useState('');

    const [open, setOpen] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fullAddress = [detail, ward, district, province]
            .filter(Boolean)
            .join(', ');
        onChange?.(fullAddress);
    }, [province, district, ward, detail]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedProvince = locations.find(p => p.Name === province);
    const selectedDistrict = selectedProvince?.Districts.find(d => d.Name === district);

    const filteredProvinces = locations.filter(p =>
        p.Name.toLowerCase().includes(province.toLowerCase())
    );

    const filteredDistricts = selectedProvince
        ? selectedProvince.Districts.filter(d =>
            d.Name.toLowerCase().includes(district.toLowerCase())
        )
        : [];

    const filteredWards = selectedDistrict
        ? selectedDistrict.Wards.filter(w =>
            w.Name.toLowerCase().includes(ward.toLowerCase())
        )
        : [];

    const renderDropdown = (items, onSelect) => (
        <ul className="dropdown">
            {items.length === 0 && <li className="empty">Không có dữ liệu</li>}
            {items.slice(0, 100).map(item => (
                <li key={item.Id} onClick={() => onSelect(item.Name)}>
                    {item.Name}
                </li>
            ))}
        </ul>
    );

    return (
        <div className="address-picker" ref={dropdownRef}>
            <style>{`
        .address-picker {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 16px;
        }

        .picker {
          position: relative;
        }

        .picker.full {
          grid-column: 1 / -1;
        }

        .picker label {
          display: block;
          font-weight: 500;
          margin-bottom: 6px;
          font-size: 13px;
          font-weight: 500;
         color: #374151;
        }

        .picker input {
          width: 100%;
          padding: 10px 12px;
          font-size: 14px;
          border: 1.5px solid #d1d5db;
          border-radius: 8px;
          background: white;
          transition: all 0.2s ease;
          box-sizing: border-box;
          outline: none;
        }

        .picker input:hover:not(:disabled) {
          border-color: #9ca3af;
        }

        .picker input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .picker input:disabled {
          background: #f3f4f6;
          color: #9ca3af;
          cursor: not-allowed;
        }

        .picker input::placeholder {
          color: #9ca3af;
        }

        .dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          max-height: 240px;
          overflow-y: auto;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          list-style: none;
          margin: 0;
          padding: 4px;
          z-index: 1000;
          animation: slideDown 0.15s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown::-webkit-scrollbar {
          width: 8px;
        }

        .dropdown::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 4px;
        }

        .dropdown::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }

        .dropdown::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        .dropdown li {
          padding: 10px 12px;
          cursor: pointer;
          font-size: 14px;
          color: #1f2937;
          border-radius: 6px;
          transition: all 0.15s ease;
        }

        .dropdown li:hover {
          background: #f3f4f6;
          color: #3b82f6;
        }

        .dropdown li.empty {
          color: #9ca3af;
          cursor: default;
          text-align: center;
          padding: 16px;
        }

        .dropdown li.empty:hover {
          background: transparent;
          color: #9ca3af;
        }

        @media (max-width: 640px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

            <div className="grid">
                {/* Province */}
                <div className="picker">
                    <label>Tỉnh / Thành phố</label>
                    <input
                        value={province}
                        placeholder="Chọn tỉnh / thành"
                        onFocus={() => setOpen('province')}
                        onChange={e => {
                            setProvince(e.target.value);
                            setDistrict('');
                            setWard('');
                        }}
                    />
                    {open === 'province' &&
                        renderDropdown(filteredProvinces, name => {
                            setProvince(name);
                            setOpen(null);
                        })}
                </div>

                {/* District */}
                <div className="picker">
                    <label>Quận / Huyện</label>
                    <input
                        value={district}
                        placeholder="Chọn quận / huyện"
                        disabled={!province}
                        onFocus={() => setOpen('district')}
                        onChange={e => {
                            setDistrict(e.target.value);
                            setWard('');
                        }}
                    />
                    {open === 'district' &&
                        renderDropdown(filteredDistricts, name => {
                            setDistrict(name);
                            setOpen(null);
                        })}
                </div>

                {/* Ward */}
                <div className="picker">
                    <label>Phường / Xã</label>
                    <input
                        value={ward}
                        placeholder="Chọn phường / xã"
                        disabled={!district}
                        onFocus={() => setOpen('ward')}
                        onChange={e => setWard(e.target.value)}
                    />
                    {open === 'ward' &&
                        renderDropdown(filteredWards, name => {
                            setWard(name);
                            setOpen(null);
                        })}
                </div>
            </div>

            {/* Detail */}
            <div className="picker full">
                <label>Địa chỉ chi tiết</label>
                <input
                    placeholder="Số nhà, tên đường"
                    value={detail}
                    onChange={e => setDetail(e.target.value)}
                />
            </div>
        </div>
    );
};