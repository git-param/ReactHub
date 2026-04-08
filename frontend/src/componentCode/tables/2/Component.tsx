const rows = [
  { name: "Aurora Labs", plan: "Pro", status: "Active", seats: 12 },
  { name: "Northwind", plan: "Starter", status: "Pending", seats: 4 },
  { name: "Pixel Forge", plan: "Enterprise", status: "Active", seats: 28 },
  { name: "Blue Ridge", plan: "Pro", status: "Paused", seats: 9 },
]

const badgeStyles: Record<string, string> = {
  Active: "bg-emerald-500/15 text-emerald-300",
  Pending: "bg-amber-500/15 text-amber-300",
  Paused: "bg-slate-500/20 text-slate-300",
}

export default function DataTable() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0f172a] text-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <p className="text-sm font-semibold">Team Access</p>
          <p className="text-xs text-slate-400">Manage workspace members and billing plans.</p>
        </div>
        <button className="rounded-full bg-cyan-400 px-3 py-1 text-xs font-semibold text-slate-950">
          Invite
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-slate-400">
            <tr>
              <th className="px-5 py-3 font-medium">Workspace</th>
              <th className="px-5 py-3 font-medium">Plan</th>
              <th className="px-5 py-3 font-medium">Seats</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className="border-t border-white/5">
                <td className="px-5 py-4 font-medium">{row.name}</td>
                <td className="px-5 py-4 text-slate-300">{row.plan}</td>
                <td className="px-5 py-4 text-slate-300">{row.seats}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${badgeStyles[row.status]}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
