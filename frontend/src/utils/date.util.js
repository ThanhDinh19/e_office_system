
export const formatDateTime = (isoString) => {
  if (!isoString) return '-';

  const d = new Date(isoString);

  return d.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
