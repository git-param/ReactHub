import { useEffect, useRef, useState } from "react"

const actions = ["Duplicate", "Rename", "Share", "Archive"]

export default function DropdownMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  }, [])

  return (
    <div ref={ref} className="relative w-full max-w-xs rounded-3xl border border-white/10 bg-[#111827] p-6 text-white shadow-2xl">
      <button className="rounded-full bg-violet-500 px-4 py-2 text-sm font-semibold" onClick={() => setOpen((value) => !value)}>
        Actions
      </button>

      {open && (
        <div className="absolute left-6 top-20 w-52 rounded-2xl border border-white/10 bg-slate-900 p-2 shadow-xl">
          {actions.map((action) => (
            <button key={action} className="block w-full rounded-xl px-3 py-2 text-left text-sm text-slate-200 hover:bg-white/5">
              {action}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
