const ChatInput = ({ value, onChange, onSubmit, disabled }) => (
  <form onSubmit={onSubmit} className="flex gap-3">
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Ask for resume tips, role guidance, or skill advice..."
      className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500"
    />
    <button
      type="submit"
      disabled={disabled}
      className="rounded-2xl bg-ink px-5 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      Send
    </button>
  </form>
);

export default ChatInput;
