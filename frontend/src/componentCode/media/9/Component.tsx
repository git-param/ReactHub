import { useState } from "react"

const images = [
  { src: "https://placehold.co/320x220/1d4ed8/ffffff?text=Studio", label: "Studio" },
  { src: "https://placehold.co/320x220/7c3aed/ffffff?text=Dashboard", label: "Dashboard" },
  { src: "https://placehold.co/320x220/0f766e/ffffff?text=Workspace", label: "Workspace" },
]

export default function ImageGallery() {
  const [active, setActive] = useState(images[0])

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-[#0f172a] p-4 text-white shadow-2xl">
      <img src={active.src} alt={active.label} className="h-48 w-full rounded-2xl object-cover" />
      <div className="mt-4 grid grid-cols-3 gap-3">
        {images.map((image) => (
          <button
            key={image.label}
            onClick={() => setActive(image)}
            className={`overflow-hidden rounded-2xl border ${active.label === image.label ? "border-cyan-300" : "border-white/10"}`}
          >
            <img src={image.src} alt={image.label} className="h-20 w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
