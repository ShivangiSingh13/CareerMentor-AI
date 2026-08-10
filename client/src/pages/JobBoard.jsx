import { useEffect, useState } from 'react';
import { listJobs } from '../services/jobApi';
import { applyToJob, listMyApplications } from '../services/applicationApi';
import Modal from '../components/common/Modal';
import { useToast } from '../components/common/ToastProvider';

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyModal, setApplyModal] = useState({ open: false, job: null });
  const [coverNote, setCoverNote] = useState('');
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const jobsRes = await listJobs();
      // handle flexible response shapes
      setJobs(jobsRes.jobs || jobsRes || []);
    } catch (e) {
      setJobs([]);
    }
    try {
      const appsRes = await listMyApplications();
      setApplications(appsRes.applications || appsRes || []);
    } catch (e) {
      setApplications([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openApply = (job) => {
    setApplyModal({ open: true, job });
    setCoverNote('');
  };

  const submitApply = async () => {
    try {
      await applyToJob({ jobId: applyModal.job._id, coverNote });
      toast.add('Application submitted');
      setApplyModal({ open: false, job: null });
      load();
    } catch (err) {
      toast.add(err.response?.data?.message || 'Failed to apply');
    }
  };

  if (loading) return <div className="p-6">Loading jobs...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Job Board</h2>
      <div className="grid gap-4">
        {jobs.length === 0 ? <div>No jobs found</div> : jobs.map((job) => {
          const applied = applications.find((a) => a.job === job._id || a.job?._id === job._id);
          return (
            <div key={job._id} className="rounded-2xl border border-white/70 bg-white p-4 shadow-soft">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <div className="text-sm text-slate-600">{job.company} • {job.location} • {job.jobType}</div>
                </div>
                <div className="text-sm text-slate-500">{job.postedAt ? new Date(job.postedAt).toLocaleDateString() : null}</div>
              </div>
              <p className="mt-3 text-sm text-slate-700">{job.description}</p>
              <div className="mt-4 flex items-center gap-3">
                <button disabled={!!applied} onClick={() => openApply(job)} className={`rounded-md px-4 py-2 text-sm ${applied ? 'bg-slate-100 text-slate-500' : 'bg-blue-600 text-white'}`}>
                  {applied ? `Applied (${applied.status || 'pending'})` : 'Apply'}
                </button>
                <a href={job.applyUrl || '#'} target="_blank" rel="noreferrer" className="text-sm text-blue-600">View listing</a>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={applyModal.open} title={applyModal.job?.title ?? 'Apply'} onClose={() => setApplyModal({ open: false, job: null })}>
        <div>
          <p className="text-sm text-slate-600">Write a short cover note (optional)</p>
          <textarea value={coverNote} onChange={(e) => setCoverNote(e.target.value)} rows={4} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2" />
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setApplyModal({ open: false, job: null })} className="rounded-md bg-slate-100 px-4 py-2 text-sm">Cancel</button>
            <button onClick={submitApply} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">Submit Application</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default JobBoard;
