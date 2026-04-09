import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4">
      <div className="max-w-3xl text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
          Modern Authentication <br />
          <span className="text-blue-500 text-shadow-glow">Made Simple.</span>
        </h1>
        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          A production-ready scaffold using Next.js 15, MongoDB, Mongoose, and Custom JWT Authentication. Secure, fast, and beautiful.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/register"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-500/20"
          >
            Get Started Free
          </Link>
          <Link
            href="/auth/login"
            className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all border border-slate-700 shadow-lg"
          >
            Sign In
          </Link>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {[
          { title: 'Server Actions', desc: 'Secure backend logic without API endpoints.' },
          { title: 'MongoDB & Mongoose', desc: 'Powerful data modeling and scalable storage.' },
          { title: 'JWT Auth', desc: 'Custom httpOnly cookie-based session management.' },
        ].map((feature, i) => (
          <div key={i} className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-colors">
            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
            <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
