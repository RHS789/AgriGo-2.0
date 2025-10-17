import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onChildAdded, push, serverTimestamp } from 'firebase/database';
import { db } from '../../firebase/client.js';
import { getMessages as getMessagesApi, sendMessage as sendMessageApi } from '../../services/chats.js';
import { getAuth } from '../../store/authStore.js';

export default function Chat() {
  const { bookingId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);
  const auth = getAuth();

  useEffect(() => {
    const unsub = onChildAdded(ref(db, `bookings/${bookingId}/messages`), (snap) => {
      setMessages((m) => [...m, snap.val()]);
    });
    (async () => {
      try { await getMessagesApi(bookingId); } catch {}
    })();
    return () => typeof unsub === 'function' && unsub();
  }, [bookingId]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const msg = {
      text: input,
      senderId: auth?.user?.id,
      senderName: auth?.user?.name || auth?.user?.email,
      createdAt: serverTimestamp(),
    };
    setInput('');
    try { await push(ref(db, `bookings/${bookingId}/messages`), msg); } catch {}
    try { await sendMessageApi({ booking_id: bookingId, message: input }); } catch {}
  };

  return (
    <main className="page">
      <div className="mx-auto max-w-2xl card h-[70vh] flex flex-col">
        <div className="card-body flex-1 overflow-y-auto space-y-2">
          {messages.map((m, i) => (
            <div key={i} className={`max-w-[75%] rounded-md px-3 py-2 ${m.senderId===auth?.user?.id? 'ml-auto bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
              <p className="text-sm">{m.text}</p>
              <p className="mt-1 text-[10px] opacity-70">{m.senderName || 'Unknown'}</p>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div className="border-t border-gray-200 p-3 flex gap-2">
          <input className="input" placeholder="Type a message" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=> e.key==='Enter' && send()} />
          <button className="btn-primary" onClick={send}>Send</button>
        </div>
      </div>
    </main>
  );
}
