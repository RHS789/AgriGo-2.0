import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="page text-center">
      <h1 className="text-2xl font-semibold mb-2">Page not found</h1>
      <Link to="/" className="btn-primary">Go Home</Link>
    </main>
  );
}
