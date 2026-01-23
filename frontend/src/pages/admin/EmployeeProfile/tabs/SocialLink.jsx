
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEmployeeById, updateSocialLinks } from "../../../../services/employee.service";
import { useNotification } from '../../../../context/NotificationContext';
import { EditableRow } from '../../../../components/widgets/EditableRow';
import './SocialLink.css';

export default function SocialLink() {
    const { id } = useParams();
    const [socialLinks, setSocialLinks] = useState([]);

    const [errors, setErrors] = useState({});
    // const { showNotification } = useNotification();

    useEffect(() => {
        const fetchEmployeeSocialLink = async () => {
            if (!id) return;

            const emp = await getEmployeeById(id);



            setSocialLinks(emp.SocialLinks || []);
        };

        fetchEmployeeSocialLink();
    }, [id]);

    const handleSave = async () => {
        try {
            await updateSocialLinks(id, socialLinks);
            console.log(socialLinks);
        } catch (err) {
            alert('Error saving job info');
        }
    }

    const getUrlByPlatform = (platform) => {
        return socialLinks.find(
            l => l.platform.toLowerCase() === platform
        )?.url || '';
    };

    const handleSocialChange = (platform, url) => {
        setSocialLinks(prev => {
            const exist = prev.find(l => l.platform === platform);

            if (exist) {
                return prev.map(l =>
                    l.platform === platform ? { ...l, url } : l
                );
            }

            return [...prev, { platform, url }];
        });
    };


    const SOCIAL_PLATFORMS = [
        { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/' },
        { key: 'twitter', label: 'Twitter', placeholder: 'https://twitter.com/' },
        { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/' },
        { key: 'whatsapp', label: 'WhatsApp', placeholder: 'https://wa.me/' },
        { key: 'digg', label: 'Digg', placeholder: 'https://digg.com/' },
        { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/' },
        { key: 'pinterest', label: 'Pinterest', placeholder: 'https://pinterest.com/' },
        { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/' },
        { key: 'github', label: 'GitHub', placeholder: 'https://github.com/' },
        { key: 'tumblr', label: 'Tumblr', placeholder: 'https://tumblr.com/' },
        { key: 'vine', label: 'Vine', placeholder: 'https://vine.co/' },
    ];

    return (
        <div>
            <div className="social-link-card">
                <h3>Social Links</h3>

                {SOCIAL_PLATFORMS.map(p => (
                    <EditableRow
                        key={p.key}
                        label={p.label}
                        value={getUrlByPlatform(p.key)}
                        onChange={v => handleSocialChange(p.key, v)}
                        placeholder={p.placeholder}
                    />
                ))}
            </div>
            <div className="save-bar">
                <button className="btn primary" onClick={handleSave}>Save</button>
            </div>
        </div>
    );
}