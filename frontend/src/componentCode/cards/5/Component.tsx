export default function GradientCard() {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-[28px] border border-white/15 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.35),_transparent_38%),linear-gradient(135deg,_#1d4ed8,_#7c3aed_55%,_#0f172a)] p-6 text-white shadow-2xl">
      <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/70">Featured</p>
      <h3 className="mt-4 text-2xl font-semibold">Gradient Card</h3>
      <p className="mt-3 text-sm leading-6 text-slate-100/80">
        A reusable highlight card with a layered glow, clear heading hierarchy, and action area.
      </p>
      <button className="mt-6 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">
        Learn more
      </button>
    </div>
  )
}
