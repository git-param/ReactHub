import { useState } from "react"

export default function ToastNotification() {
  const [visible, setVisible] = useState(true)

  return (
    <div className="flex min-h-[260px] w-full flex-col items-start justify-end rounded-3xl bg-slate-950 p-5 text-white">
      <button
        className="mb-4 rounded-full border border-white/10 px-4 py-2 text-sm"
        onClick={() => setVisible(true)}
      >
        Trigger toast
      </button>

      {visible && (
        <div className="w-full max-w-sm rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 shadow-lg shadow-emerald-500/10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-emerald-200">Deployment complete</p>
              <p className="mt-1 text-sm text-emerald-50/80">Your latest changes are live in production.</p>
            </div>
            <button className="text-sm text-emerald-200" onClick={() => setVisible(false)}>
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
