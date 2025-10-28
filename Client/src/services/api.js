export const fetchComplaints = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/complaints`);
  if (!response.ok) throw new Error('Failed to fetch complaints');
  return response.json();
};

export const fetchAnalytics = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/analytics`);
  if (!response.ok) throw new Error('Failed to fetch analytics');
  return response.json();
};
