import { useState } from "react"

export default function ModalDialog() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-[260px] w-full items-center justify-center rounded-2xl bg-slate-950 p-6 text-white">
      <button
        className="rounded-full bg-pink-500 px-5 py-2.5 text-sm font-semibold shadow-lg shadow-pink-500/30"
        onClick={() => setOpen(true)}
      >
        Open modal
      </button>

      {open && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 p-6">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Publish changes</h3>
              <button className="text-slate-400" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
            <p className="text-sm leading-6 text-slate-300">
              This modal supports actions, dismiss, and a clear content area for confirmations.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button className="rounded-full border border-white/10 px-4 py-2 text-sm" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950" onClick={() => setOpen(false)}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
