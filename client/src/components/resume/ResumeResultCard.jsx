const ResumeResultCard = ({ resume }) => (
  <div className="rounded-3xl border border-white/70 bg-white p-6 shadow-soft">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">Latest ATS Score</p>
        <div className="mt-2 inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-3xl font-semibold text-blue-700">
          {resume?.atsScore ?? 0}
        </div>
      </div>
      <div className="text-sm text-slate-500">
        <p className="font-medium text-slate-700">File</p>
        <p>{resume?.originalFilename || 'No resume analyzed yet'}</p>
      </div>
    </div>

    <div className="mt-6 grid gap-6 md:grid-cols-2">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Missing Skills</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {(resume?.missingSkills || []).map((item) => (
            <li key={item} className="rounded-2xl bg-slate-50 px-3 py-2">{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Suggestions</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {(resume?.suggestions || []).map((item) => (
            <li key={item} className="rounded-2xl bg-slate-50 px-3 py-2">{item}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default ResumeResultCard;
