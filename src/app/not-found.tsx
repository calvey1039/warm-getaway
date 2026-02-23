import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center px-6">
        <div className="text-6xl mb-4">🌡️</div>
        <h1 className="text-2xl font-semibold text-zinc-900 mb-2">
          Page Not Found
        </h1>
        <p className="text-zinc-500 mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <span>☀️</span>
          Back to Warm Road
        </Link>
      </div>
    </div>
  );
}
