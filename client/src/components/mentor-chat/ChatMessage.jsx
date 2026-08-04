const ChatMessage = ({ message }) => (
  <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div
      className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm shadow-sm ${
        message.role === 'user' ? 'bg-ink text-white' : 'bg-white text-slate-800'
      }`}
    >
      {message.content}
    </div>
  </div>
);

export default ChatMessage;
