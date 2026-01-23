import { useState } from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileTabs from './ProfileTabs';
import GeneralInfo from './tabs/GeneralInfo';
import './EmployeeProfile.css';
import JobInfo from './tabs/JobInfo';
import AccountSetting from './tabs/AccountSetting';
import SocialLink from './tabs/SocialLink';

export default function EmployeeProfile() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="profile-page">
      <ProfileHeader />

      <ProfileTabs active={activeTab} onChange={setActiveTab} />

      <div className="profile-content">
        {activeTab === 'general' && <GeneralInfo />}
        {activeTab === 'socical_links' && <SocialLink />}
        {activeTab === 'job' && <div><JobInfo /></div>}
        {activeTab === 'account' && <div><AccountSetting /></div>}
        {activeTab === 'my_preferences' && <div>My preferences</div>}
        {activeTab === 'files' && <div>Files</div>}
        {activeTab === 'timesheets' && <div>Timesheets</div>}
        {activeTab === 'time_cards' && <div>Time cards</div>}
        {activeTab === 'leave' && <div>Leave</div>}
      </div>
    </div>  
  );
}
  