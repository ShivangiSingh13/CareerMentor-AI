import Modal from '../common/Modal';

const MilestoneModal = ({ open, onClose, week, index, onMarkComplete }) => {
  if (!week) return null;
  return (
    <Modal open={open} title={`Week ${index + 1}: ${week.title}`} onClose={onClose}>
      <div>
        <div className="text-sm text-slate-600">Topics</div>
        <ul className="mt-2 list-disc list-inside text-sm text-slate-700">
          {(week.topics || []).map((t, i) => <li key={i}>{t}</li>)}
        </ul>

        {week.resources?.length ? (
          <div className="mt-4">
            <div className="text-sm text-slate-600">Resources</div>
            <ul className="mt-2 text-sm text-blue-700">
              {week.resources.map((r, i) => <li key={i}><a href={r} target="_blank" rel="noreferrer">{r}</a></li>)}
            </ul>
          </div>
        ) : null}

        <div className="mt-4 flex justify-end">
          {!week.completed && <button onClick={() => onMarkComplete(index)} className="rounded-md bg-blue-600 px-4 py-2 text-white">Mark complete</button>}
        </div>
      </div>
    </Modal>
  );
};

export default MilestoneModal;
