export default function SkeletonLoader() {
  return (
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111827] p-5 text-white shadow-2xl">
      <div className="animate-pulse space-y-4">
        <div className="h-40 rounded-2xl bg-white/10" />
        <div className="h-4 w-2/3 rounded-full bg-white/10" />
        <div className="h-4 w-full rounded-full bg-white/10" />
        <div className="h-4 w-4/5 rounded-full bg-white/10" />
        <div className="flex gap-3">
          <div className="h-10 flex-1 rounded-2xl bg-white/10" />
          <div className="h-10 flex-1 rounded-2xl bg-white/10" />
        </div>
      </div>
    </div>
  )
}
