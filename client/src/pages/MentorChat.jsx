import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/common/Layout';
import MentorChips from '../components/mentor-chat/MentorChips';
import ChatInput from '../components/mentor-chat/ChatInput';
import ChatMessage from '../components/mentor-chat/ChatMessage';
import { getMentorHistory, sendMentorMessage } from '../services/mentorService';

const MentorChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const prefillHandled = useRef(false);
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getMentorHistory();
        setMessages(data.messages || []);
      } catch (_) {
        setMessages([]);
      }
    };
    loadHistory();
    // handle prefill prompt from navigation state
    if (location?.state?.prefillPrompt && !prefillHandled.current) {
      setInput(location.state.prefillPrompt);
      // auto-send the prompt to start the conversation
      (async () => {
        prefillHandled.current = true;
        const prompt = location.state.prefillPrompt;
        setLoading(true);
        setMessages((current) => [...current, { role: 'user', content: prompt, timestamp: new Date().toISOString() }] );
        try {
          const data = await sendMentorMessage(prompt);
          setMessages(data.messages || []);
        } catch (error) {
          setMessages((current) => [...current, { role: 'assistant', content: error.response?.data?.message || 'Failed to send message', timestamp: new Date().toISOString() }]);
        } finally {
          setLoading(false);
          setInput('');
        }
      })();
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);
    setMessages((current) => [...current, { role: 'user', content: userMessage, timestamp: new Date().toISOString() }]);

    try {
      const data = await sendMentorMessage(userMessage);
      setMessages(data.messages || []);
    } catch (error) {
      setMessages((current) => [...current, { role: 'assistant', content: error.response?.data?.message || 'Failed to send message', timestamp: new Date().toISOString() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="AI Career Mentor" subtitle="Keep one ongoing student conversation with the mentor assistant.">
      <div className="rounded-3xl border border-white/70 bg-white p-6 shadow-soft">
        <div className="mb-4">
          <MentorChips />
        </div>
        <div className="flex h-[60vh] flex-col gap-4 overflow-hidden">
          <div className="flex-1 space-y-3 overflow-y-auto rounded-3xl bg-slate-50 p-4">
            {messages.length === 0 ? <p className="text-sm text-slate-500">No messages yet. Start the conversation.</p> : null}
            {messages.map((message, index) => (
              <ChatMessage key={`${message.timestamp || index}-${index}`} message={message} />
            ))}
          </div>
          <ChatInput value={input} onChange={setInput} onSubmit={handleSubmit} disabled={loading} />
        </div>
      </div>
    </Layout>
  );
};

export default MentorChat;
