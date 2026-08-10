import { useEffect, useState } from 'react';
import Layout from '../components/common/Layout';
import { listJobs, createJob, deleteJob } from '../services/jobApi';
import { seedDemo, listUsers as fetchUsers, updateUserRole as apiUpdateUserRole, deleteUser as apiDeleteUser, getStats } from '../services/adminApi';

const AdminPanel = () => {
  const [jobs, setJobs] = useState([]);

  const load = async () => {
    try {
      const data = await listJobs();
      setJobs(data.jobs || data || []);
    } catch (e) {
      setJobs([]);
    }
  };

  useEffect(() => { load(); }, []);

  const seed = async () => {
    try {
      // Prefer server-side seed if available
      await seedDemo();
      alert('Server-side demo seeded');
      load();
      loadUsers();
      loadStats();
    } catch (e) {
      // fallback to client-side job creation
      try {
        await createJob({ title: 'Sample Job', company: 'Acme', location: 'Remote', jobType: 'Full-time', description: 'Sample seeded job' });
        await createJob({ title: 'Junior Developer', company: 'Acme', location: 'Remote', jobType: 'Internship', description: 'Entry level role' });
        alert('Seeded jobs (fallback)');
        load();
      } catch (err) {
        alert('Seed failed');
      }
    }
  };

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);

  const loadUsers = async () => {
    try {
      const res = await fetchUsers();
      setUsers(res.data || []);
    } catch (e) { setUsers([]); }
  };

  const loadStats = async () => {
    try {
      const res = await getStats();
      setStats(res.data || null);
    } catch (e) { setStats(null); }
  };

  useEffect(() => { loadUsers(); loadStats(); }, []);

  const remove = async (id) => {
    if (!confirm('Delete job?')) return;
    try { await deleteJob(id); load(); } catch(e) { alert('Delete failed'); }
  };

  return (
    <Layout title="Admin Panel" subtitle="Administrative tools and demo data">
      <div className="grid gap-6">
        <div className="rounded-3xl border border-white/70 bg-white p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-slate-900">Demo Data</h3>
          <div className="mt-4 flex gap-3">
            <button onClick={seed} className="rounded-md bg-blue-600 px-4 py-2 text-white">Seed demo jobs</button>
            <button onClick={load} className="rounded-md bg-slate-100 px-4 py-2">Refresh</button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/70 bg-white p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-slate-900">Jobs</h3>
          <div className="mt-4 space-y-3">
            {jobs.map(j => (
              <div key={j._id} className="flex items-center justify-between rounded p-3 border"> 
                <div>
                  <div className="font-medium">{j.title}</div>
                  <div className="text-sm text-slate-500">{j.company}</div>
                </div>
                <div>
                  <button onClick={() => remove(j._id)} className="rounded-md bg-red-600 px-3 py-1 text-white">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/70 bg-white p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-slate-900">Users</h3>
          <div className="mt-4 space-y-3">
            {users.map(u => (
              <div key={u._id} className="flex items-center justify-between rounded p-3 border"> 
                <div>
                  <div className="font-medium">{u.name} <span className="text-sm text-slate-500">({u.email})</span></div>
                  <div className="text-sm text-slate-500">Role: {u.role}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={async () => { if (!confirm('Change role?')) return; const newRole = u.role === 'student' ? 'recruiter' : 'student'; await apiUpdateUserRole(u._id, newRole); loadUsers(); }} className="rounded-md bg-blue-600 px-3 py-1 text-white">Toggle Role</button>
                  <button onClick={async () => { if (!confirm('Delete user?')) return; await apiDeleteUser(u._id); loadUsers(); }} className="rounded-md bg-red-600 px-3 py-1 text-white">Delete</button>
                </div>
              </div>
            ))}
            {users.length === 0 && <div className="text-sm text-slate-500">No users found</div>}
          </div>
        </div>

        <div className="rounded-3xl border border-white/70 bg-white p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-slate-900">Site Stats</h3>
          <div className="mt-4">
            {stats ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded">Users: <strong>{stats.userCount}</strong></div>
                <div className="p-3 border rounded">Jobs: <strong>{stats.jobCount}</strong></div>
                <div className="p-3 border rounded">Resumes: <strong>{stats.resumeCount}</strong></div>
                <div className="p-3 border rounded">Applications: <strong>{stats.applicationCount}</strong></div>
              </div>
            ) : (
              <div className="text-sm text-slate-500">Stats unavailable</div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPanel;
