import { useState, useEffect } from 'react';
import { Plus, Search, Filter, ChevronDown, Edit, } from 'lucide-react';
import './TicketPage.css';
import CreateTicketModal from '../../../components/common/CreateTicketModal';
import { createTicket, getTickets } from '../../../services/ticket.service';
import { formatDateTime } from '../../../utils/date.util';
import { getITServices } from '../../../services/ITService.service';
import { useNotification } from '../../../context/NotificationContext';
import { toast } from 'react-toastify';

export default function TicketPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [openCreate, setOpenCreate] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const user_id = user?.id;
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const { showNotification } = useNotification();

  const fetchTickets = async () => {
    const data = await getTickets();
    setTickets(data);
  }

  useEffect(() => {
    const init = async () => {
      try {
        const [servicesData, ticketsData] = await Promise.all([
          getITServices(),
          getTickets(),
        ]);
        setServices(servicesData);
        setTickets(ticketsData);
      } catch (error) {
        console.error('Init data error:', error);
      }
    };
    init();
  }, []);

  const filteredTickets = tickets.filter(
    (t) =>
      (statusFilter === 'All' || t.status === statusFilter) &&
      t.category.toLowerCase().includes(search.toLowerCase())
  );

  const noti = async () => {
    showNotification("ticket created successfully", "ticket")
  }

  return (
    <div className="ticket-page">
      <h2>Ticket View</h2>

      {/* Tabs */}
      <div className="ticket-tabs">
        {['All', 'Open', 'Processing', 'Resolved'].map((tab) => (
          <button
            key={tab}
            className={statusFilter === tab ? 'active' : ''}
            onClick={() => setStatusFilter(tab)}
          >
            {tab} <span className="count">99</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="ticket-filters">
        <button className="filter-btn" onClick={noti}>
          <Filter size={16} /> Add Filter
        </button>

        <button className="dropdown-priority">
          Priority: All <ChevronDown size={14} />
        </button>

        <button className="dropdown-status">
          Status: All <ChevronDown size={14} />
        </button>

        <div className="search-box">
          <Search size={16} />
          <input
            placeholder="Search ticket here"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button className="create-btn" disabled={loading} onClick={() => setOpenCreate(true)}>
          <Plus size={16} /> {loading ? 'Creating...' : 'Create Ticket'}
        </button>
      </div>

      {/* Table */}
      <table className="ticket-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Priority</th>
            <th>Assignee</th>
            <th>Created Date</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredTickets.map((t) => (
            <tr key={t.id}>
              <td>{t.category}</td>
              <td>
                <span className={`priority ${t.priority?.name.toLowerCase()}`}>
                  {t.priority?.name}
                </span>
              </td>
              <td>{t.assignments?.name ? t.assignments.name : '-'}</td>
              <td>{formatDateTime(t.created_at)}</td>
              <td>
                <span className={`status ${t.status.toLowerCase()}`}>
                  {t.status}
                </span>
              </td>
              <td>
                <button className="icon-btn">
                  <Edit size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination-tickets">
        <span>Showing {filteredTickets.length} tickets</span>
        <div>
          <button>Previous</button>
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
          <button>Next</button>
        </div>
      </div>

      {/* create ticket modal */}
      <CreateTicketModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        services={services}
        onSubmit={async (data) => {
          if (loading) return;

          try {
            setLoading(true);

            data.append('user_id', user_id);
            await createTicket(data);

            setOpenCreate(false);
            fetchTickets();

            toast.info("Ticket created successfully");

          } catch (err) {
            console.error('Create ticket failed:', err);
            // TODO: show toast / alert
          } finally {
            setLoading(false)
          }
        }}
      />
    </div>
  );
}
