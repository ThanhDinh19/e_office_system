import './ProfileTabs.css';
const tabs = [
  { key: 'timeline', label: 'Timeline' },
  { key: 'general', label: 'General Info' },
  { key: 'socical_links', label: 'Social Links' },
  { key: 'job', label: 'Job Info' },
  { key: 'account', label: 'Account settings' },
  { key: 'my_preferences', label: 'My Preferences' },
  { key: 'files', label: 'Files' },
  { key: 'projects', label: 'Projects' },
  { key: 'timesheets', label: 'Timesheets' },
  { key: 'time_cards', label: 'Time Cards' },
  { key: 'leave', label: 'Leave' },
];

export default function ProfileTabs({ active, onChange }) {
  return (
    <div className="profile-tabs">
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={active === tab.key ? 'active' : ''}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
