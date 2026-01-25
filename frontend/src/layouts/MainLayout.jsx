import Sidebar from '../components/sidebar/Sidebar';
import Navbar from '../components/navbar/Navbar';
import './MainLayout.css';

export default function MainLayout({ children }) {
  return (
    <div className="main-layout">
       <Sidebar />
      

      <div className="content-wrapper">
        <Navbar />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
