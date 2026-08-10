const axios = require('axios');

const API = process.env.API_BASE || 'http://localhost:5000/api';

const pause = (ms) => new Promise((r) => setTimeout(r, ms));

const run = async () => {
  try {
    console.log('--- E2E Test Start ---');

    // 1. Create recruiter
    const recSignup = await axios.post(`${API}/auth/signup`, {
      name: 'Test Recruiter',
      email: 'recruiter@example.com',
      password: 'password123',
      role: 'recruiter'
    }).catch((e) => e.response?.data || { error: e.message });
    console.log('recruiter signup:', recSignup.data || recSignup);

    const recLogin = await axios.post(`${API}/auth/login`, { email: 'recruiter@example.com', password: 'password123' });
    const recToken = recLogin.data.token;
    console.log('recruiter logged in');

    // 2. Recruiter creates a job
    const jobRes = await axios.post(`${API}/jobs`, {
      title: 'Junior Developer',
      company: 'Acme Co',
      location: 'Remote',
      jobType: 'Full-time',
      description: 'Entry level dev role',
      requiredSkills: ['JavaScript']
    }, { headers: { Authorization: `Bearer ${recToken}` } });
    const job = jobRes.data.data;
    console.log('job created:', job._id);

    // 3. Create student
    const stuSignup = await axios.post(`${API}/auth/signup`, {
      name: 'Test Student',
      email: 'student@example.com',
      password: 'password123',
      role: 'student'
    }).catch((e) => e.response?.data || { error: e.message });
    console.log('student signup:', stuSignup.data || stuSignup);

    const stuLogin = await axios.post(`${API}/auth/login`, { email: 'student@example.com', password: 'password123' });
    const stuToken = stuLogin.data.token;
    console.log('student logged in');

    // 4. Student applies to job
    const applyRes = await axios.post(`${API}/applications`, { jobId: job._id, coverNote: 'Excited to apply' }, { headers: { Authorization: `Bearer ${stuToken}` } });
    const application = applyRes.data.data;
    console.log('applied, application id:', application._id);

    // small pause
    await pause(500);

    // 5. Recruiter lists applicants
    const applicants = await axios.get(`${API}/applications/job/${job._id}`, { headers: { Authorization: `Bearer ${recToken}` } });
    console.log('applicants listed, count:', applicants.data.data.length);

    // 6. Recruiter updates status
    const appId = applicants.data.data[0]._id;
    const statusRes = await axios.patch(`${API}/applications/${appId}/status`, { status: 'shortlisted' }, { headers: { Authorization: `Bearer ${recToken}` } });
    console.log('status updated:', statusRes.data.data.status);

    // 7. Student checks notifications
    const notifCount = await axios.get(`${API}/notifications/unread-count`, { headers: { Authorization: `Bearer ${stuToken}` } });
    console.log('student unread count:', notifCount.data.data.count);

    const notifs = await axios.get(`${API}/notifications`, { headers: { Authorization: `Bearer ${stuToken}` } });
    console.log('student notifications:', notifs.data.data.map(n => ({ title: n.title, msg: n.message })));

    // 8. Student generates a roadmap
    const roadmapRes = await axios.post(`${API}/roadmap/generate`, { currentSkills: ['HTML, CSS'], targetRole: 'Frontend Developer' }, { headers: { Authorization: `Bearer ${stuToken}` } });
    const roadmap = roadmapRes.data.roadmap;
    console.log('roadmap generated:', roadmap._id);

    // 9. Student marks week 0 complete
    const markRes = await axios.patch(`${API}/roadmap/${roadmap._id}/weeks/0/complete`, {}, { headers: { Authorization: `Bearer ${stuToken}` } });
    console.log('marked week complete:', markRes.data.message);

    // 10. Check notifications again
    const notifs2 = await axios.get(`${API}/notifications`, { headers: { Authorization: `Bearer ${stuToken}` } });
    console.log('notifications after roadmap:', notifs2.data.data.map(n => ({ title: n.title })));

    console.log('--- E2E Test Complete ---');
  } catch (err) {
    console.error('E2E failed:', err.response?.data || err.message);
    process.exit(1);
  }
};

run();
