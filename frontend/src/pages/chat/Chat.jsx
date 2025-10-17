import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase/client.js';
import { getMessages as getMessagesApi, sendMessage as sendMessageApi } from '../../services/chats.js';
import { getAuth } from '../../store/authStore.js';

export default function Chat() {
  const { bookingId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const endRef = useRef(null);
  const auth = getAuth();

  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      try {
        const data = await getMessagesApi(bookingId);
        setMessages(Array.isArray(data) ? data : []);
        setError('');
      } catch (err) {
        setError('Failed to load messages');
        console.error('Load messages error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    // Set up polling to refresh messages
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [bookingId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || !auth?.user?.id) return;

    const messageText = input;
    setInput('');

    try {
      await sendMessageApi({
        booking_id: bookingId,
        message: messageText
      });

      // Reload messages after sending
      const data = await getMessagesApi(bookingId);
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to send message');
      console.error('Send message error:', err);
    }
  };

  if (loading) return (
    <main className="page">
      <div className="mx-auto max-w-2xl card h-[70vh] flex items-center justify-center">
        <p className="text-gray-600">Loading conversation...</p>
      </div>
    </main>
  );

  return (
    <main className="page">
      <div className="mx-auto max-w-2xl card h-[70vh] flex flex-col">
        <div className="card-body border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Chat - Booking #{bookingId}</h2>
        </div>
        <div className="card-body flex-1 overflow-y-auto space-y-3">
          {messages.length === 0 && (
            <p className="text-center text-gray-500 text-sm">No messages yet. Start the conversation!</p>
          )}
          {messages.map((m, i) => {
            const isOwn = m.sender_id === auth?.user?.id;
            return (
              <div key={i} className={`max-w-[75%] rounded-lg px-4 py-2 ${isOwn ? 'ml-auto bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                <p className="text-sm">{m.message || m.text}</p>
                <p className="mt-1 text-[11px] opacity-70">{m.sender_name || m.senderName || 'Unknown'}</p>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>
        {error && (
          <div className="border-t border-gray-200 px-4 py-3 bg-red-50">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        <div className="border-t border-gray-200 p-4 flex gap-2">
          <input
            className="input flex-1"
            placeholder="Type a message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            disabled={!auth?.user?.id}
          />
          <button
            className="btn-primary"
            onClick={send}
            disabled={!input.trim() || !auth?.user?.id}
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
