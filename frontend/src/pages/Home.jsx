import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="page">
      <section className="mx-auto max-w-5xl py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Welcome to AgriGo-2.0</h1>
        <p className="text-gray-600 text-lg mb-8 max-w-2xl">A clean, modern platform to manage resources, bookings, and chat in agriculture. Simple, fast, and ready to grow with you.</p>
        <Link to="/register" className="btn-accent-green text-white text-base px-6 py-3">Get Started</Link>
      </section>
    </main>
  );
}
