const series = [
  { label: "Q1", value: 28 },
  { label: "Q2", value: 44 },
  { label: "Q3", value: 37 },
  { label: "Q4", value: 61 },
]

export default function MiniRevenueChart() {
  const max = Math.max(...series.map((item) => item.value))

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-[#111827] p-5 text-white shadow-2xl">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold">Revenue growth</p>
          <p className="text-xs text-slate-400">Quarterly summary</p>
        </div>
        <p className="text-2xl font-semibold">$61k</p>
      </div>

      <div className="mt-6 flex h-40 items-end gap-4">
        {series.map((item) => (
          <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-28 w-full items-end rounded-2xl bg-white/5 p-1">
              <div
                className="w-full rounded-xl bg-gradient-to-t from-fuchsia-600 to-violet-400"
                style={{ height: `${(item.value / max) * 100}%` }}
              />
            </div>
            <span className="text-xs text-slate-400">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
