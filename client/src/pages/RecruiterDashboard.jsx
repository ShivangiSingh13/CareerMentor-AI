import { useEffect, useState } from 'react';
import { createJob, listMyPostedJobs, updateJob } from '../services/jobApi';
import { listApplicantsForJob, updateApplicationStatus } from '../services/applicationApi';

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ title: '', company: '', location: '', jobType: 'Full-time', description: '' });
  const [selectedApplicants, setSelectedApplicants] = useState([]);

  const load = async () => {
    const res = await listMyPostedJobs();
    setJobs(res.data || []);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createJob(form);
      alert('Job created');
      setForm({ title: '', company: '', location: '', jobType: 'Full-time', description: '' });
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create job');
    }
  };

  const viewApplicants = async (jobId) => {
    try {
      const res = await listApplicantsForJob(jobId);
      setSelectedApplicants(res.data || []);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to load applicants');
    }
  };

  const changeStatus = async (appId, status) => {
    try {
      await updateApplicationStatus(appId, status);
      alert('Status updated');
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Recruiter Dashboard</h2>
      <div className="mb-6">
        <h3 className="font-semibold">Post New Job</h3>
        <form onSubmit={handleCreate} className="space-y-2">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full rounded border px-2 py-1" />
          <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company" className="w-full rounded border px-2 py-1" />
          <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location" className="w-full rounded border px-2 py-1" />
          <select value={form.jobType} onChange={(e) => setForm({ ...form, jobType: e.target.value })} className="w-full rounded border px-2 py-1">
            <option>Full-time</option>
            <option>Internship</option>
            <option>Part-time</option>
          </select>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="w-full rounded border px-2 py-1" />
          <button type="submit" className="rounded bg-blue-600 px-3 py-1 text-white">Post Job</button>
        </form>
      </div>

      <div>
        <h3 className="font-semibold">My Posted Jobs</h3>
        <div className="grid gap-3 mt-2">
          {jobs.map((job) => (
            <div key={job._id} className="rounded border p-3">
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">{job.title} — {job.company}</div>
                  <div className="text-sm text-slate-600">{job.location} • {job.jobType}</div>
                </div>
                <div>
                  <button onClick={() => viewApplicants(job._id)} className="rounded bg-indigo-600 px-2 py-1 text-white">View Applicants</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedApplicants.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold">Applicants</h3>
          <div className="grid gap-2 mt-2">
            {selectedApplicants.map((app) => (
              <div key={app._id} className="rounded border p-2">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{app.studentId?.name} ({app.studentId?.email})</div>
                    <div className="text-sm">Status: {app.status}</div>
                  </div>
                  <div className="flex gap-2">
                    <select value={app.status} onChange={(e) => changeStatus(app._id, e.target.value)} className="rounded border px-2 py-1">
                      <option value="applied">applied</option>
                      <option value="shortlisted">shortlisted</option>
                      <option value="rejected">rejected</option>
                      <option value="selected">selected</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
