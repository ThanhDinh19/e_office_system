import { useState, useEffect } from 'react';
import './ProjectManagement.css';
import AddProjectWizard from './projects/AddProjectWizard/AddProjectWizard';
import { getProjects, deleteProject } from '../../services/project.service';
import { Trash2, Edit } from 'lucide-react';


export default function ProjectManagement() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All projects');
    const [openAddProject, setOpenAddProject] = useState(false);
    const [projects, setProjects] = useState([]);
    const [editingProject, setEditingProject] = useState(null);

    const fetchProjects = async () => {
        const data = await getProjects();
        setProjects(data);
    }

    useEffect(() => {
        fetchProjects();
    }, [])


    const filters = [
        'All projects',
        'Completed',
        'High Priority',
        'Open projects',
        'Upcoming'
    ];

    const isDeadlinePassed = (endDate) => {
        if (!endDate) return false;

        const deadline = new Date(endDate);
        const today = new Date();

        today.setHours(0, 0, 0, 0);
        deadline.setHours(0, 0, 0, 0);

        return deadline < today;
    };

    const handleDeleteProject = async (id) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this project?\nThis action cannot be undone.'
        );

        if (!confirmed) return;

        try {
            await deleteProject(id);

            // Cách 1 (nhanh & mượt): remove khỏi state
            setProjects(prev => prev.filter(p => p.id !== id));

            // Cách 2 (nếu backend có logic phức tạp):
            // await fetchProjects();

        } catch (err) {
            console.error(err);
            alert('Delete project failed');
        }
    };



    return (

        <>
            <div className="project-management">
                {/* Header */}
                <div className="pm-header">
                    <h1 className="pm-title">Projects</h1>
                    <div className="pm-actions">
                        <button className="pm-btn pm-btn-secondary">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M7 2v5M2 7h5M14 2l-5 5M14 14l-5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            Manage labels
                        </button>
                        <button className="pm-btn pm-btn-secondary">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 3v10M3 8l5-5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Import projects
                        </button>
                        <button className="pm-btn pm-btn-primary" onClick={() => setOpenAddProject(true)}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M8 5v6M5 8h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            Add project
                        </button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="pm-toolbar">
                    <div className="pm-toolbar-left">
                        <button className="pm-icon-btn">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <rect x="2" y="2" width="14" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M2 6h14M6 2v4M12 2v4" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                        </button>

                        <button className="pm-filter-btn">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            Filters
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <button className="pm-icon-btn">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M9 4v10M4 9h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>

                        <div className="pm-tabs">
                            {filters.map((filter) => (
                                <button
                                    key={filter}
                                    className={`pm-tab ${activeFilter === filter ? 'active' : ''}`}
                                    onClick={() => setActiveFilter(filter)}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pm-toolbar-right">
                        <button className="pm-btn pm-btn-text">Excel</button>
                        <button className="pm-btn pm-btn-text">Print</button>
                        <div className="pm-search">
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pm-search-input"
                            />
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="pm-table-container">
                    <table className="pm-table">
                        <thead>
                            <tr>
                                <th className="pm-th pm-th-id">ID</th>
                                <th className="pm-th pm-th-title">Title</th>
                                <th className="pm-th">Client</th>
                                <th className="pm-th pm-th-sort">
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M7 3v8M4 8l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </th>
                                <th className="pm-th">Price</th>
                                <th className="pm-th">Start date</th>
                                <th className="pm-th">Deadline</th>
                                {/* <th className="pm-th">Progress</th> */}
                                <th className="pm-th">Status</th>
                                <th className="pm-th pm-th-actions">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M3 8h10M8 3v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr key={project.id} className="pm-row">
                                    <td className="pm-td pm-td-id">{project.id}</td>

                                    {/* TITLE */}
                                    <td className="pm-td pm-td-title">
                                        <div className="pm-title-cell">
                                            <div className="pm-project-title">{project.name}</div>

                                            {project.labels && (
                                                <span className={`pm-label pm-label-${project.labels.replace(' ', '-').toLowerCase()}`}>
                                                    {project.labels}
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* CLIENT = project_type */}
                                    <td className="pm-td pm-td-client">
                                        {project.project_type || '-'}
                                    </td>

                                    <td className="pm-td"></td>

                                    {/* PRICE */}
                                    <td className="pm-td pm-td-price">
                                        {project.price ? Number(project.price).toLocaleString() : '-'}
                                    </td>

                                    {/* START DATE */}
                                    <td className="pm-td pm-td-date">
                                        {project.start_date}
                                    </td>

                                    {/* DEADLINE = end_date */}
                                    <td
                                        className={`pm-td pm-td-date ${isDeadlinePassed(project.end_date) ? 'pm-td-overdue' : ''
                                            }`}
                                    >
                                        {project.end_date}
                                    </td>

                                    

                                    {/* STATUS (chưa có trong DB) */}
                                    <td className="pm-td pm-td-status">
                                        -
                                    </td>

                                    <td className="pm-td pm-td-actions">
                                        <div className="pm-row-actions">

                                            <button
                                                className="pm-action-btn pm-action-edit"
                                                onClick={() => {
                                                    setEditingProject(project);
                                                    setOpenAddProject(true);
                                                }}
                                            >
                                                <Edit size={16} />
                                            </button>

                                            <button
                                                className="pm-action-btn pm-action-delete"
                                                onClick={() => handleDeleteProject(project.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddProjectWizard
                open={openAddProject}
                project={editingProject}
                onClose={() => {
                    setOpenAddProject(false);
                    setEditingProject(null);
                }}
                onSuccess={() => {
                    setOpenAddProject(false);
                    setEditingProject(null);
                    fetchProjects();
                }}
            />
        </>
    );
}