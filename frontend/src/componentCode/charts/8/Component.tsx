const data = [
  { label: "Mon", value: 38 },
  { label: "Tue", value: 54 },
  { label: "Wed", value: 71 },
  { label: "Thu", value: 49 },
  { label: "Fri", value: 82 },
]

export default function BarChart() {
  const max = Math.max(...data.map((item) => item.value))

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-[#111827] p-5 text-white shadow-2xl">
      <div className="mb-5">
        <p className="text-sm font-semibold">Weekly traffic</p>
        <p className="text-xs text-slate-400">Responsive SVG chart without extra dependencies.</p>
      </div>

      <div className="flex h-52 items-end gap-4">
        {data.map((item) => (
          <div key={item.label} className="flex flex-1 flex-col items-center gap-3">
            <div className="flex h-40 w-full items-end rounded-t-2xl bg-white/5 p-1">
              <div
                className="w-full rounded-xl bg-gradient-to-t from-violet-600 to-cyan-400"
                style={{ height: `${(item.value / max) * 100}%` }}
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">{item.value}</p>
              <p className="text-xs text-slate-400">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
