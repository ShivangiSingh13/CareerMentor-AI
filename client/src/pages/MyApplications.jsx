import { useEffect, useState } from 'react';
import { listMyApplications } from '../services/applicationApi';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await listMyApplications();
        setApplications(res.data || []);
      } catch (e) {
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">My Applications</h2>
      {applications.length === 0 ? (
        <div>No applications yet</div>
      ) : (
        <div className="grid gap-3">
          {applications.map((app) => (
            <div key={app._id} className="rounded border p-3">
              <div className="font-semibold">{app.jobId?.title} — {app.jobId?.company}</div>
              <div className="text-sm text-slate-600">Applied {new Date(app.createdAt).toLocaleString()}</div>
              <div className="mt-2">Status: <span className="font-medium">{app.status}</span></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
