export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Tailwind is Working ✅
        </h1>

        <p className="text-gray-600">
          If you see rounded corners, shadows, and colors —
          Tailwind is installed correctly.
        </p>

        <button className="px-6 py-3 rounded-xl bg-[#0b0a1f] text-white font-semibold hover:bg-[#0a063d] transition">
          Test Button
        </button>
      </div>
    </div>
  );
}
