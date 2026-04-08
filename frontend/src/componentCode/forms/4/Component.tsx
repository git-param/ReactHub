import { useState } from "react"

export default function LoginForm() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    window.setTimeout(() => setLoading(false), 1200)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#111827] p-6 text-white shadow-2xl"
    >
      <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Welcome back</p>
      <h3 className="mt-2 text-2xl font-semibold">Sign in</h3>

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-2 block text-xs text-slate-400">Email</span>
          <input
            type="email"
            defaultValue="team@reacthub.dev"
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs text-slate-400">Password</span>
          <input
            type="password"
            defaultValue="password"
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none"
          />
        </label>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <label className="flex items-center gap-2">
          <input type="checkbox" defaultChecked />
          Remember me
        </label>
        <button type="button">Forgot password?</button>
      </div>

      <button
        type="submit"
        className="mt-6 w-full rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  )
}
