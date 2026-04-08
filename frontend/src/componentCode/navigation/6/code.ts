export const code = `
import { useState } from "react";

const links = ["Products", "Pricing", "Resources"];

export default function ResponsiveNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-[#0f172a] p-4 text-white shadow-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold">ReactHub</p>
          <p className="text-xs text-slate-400">Design system</p>
        </div>
        <div className="hidden gap-3 md:flex">
          {links.map((link) => (
            <button key={link} className="rounded-full px-4 py-2 text-sm text-slate-300 hover:bg-white/5">
              {link}
            </button>
          ))}
        </div>
        <button className="rounded-full border border-white/10 px-3 py-2 text-sm md:hidden" onClick={() => setOpen((value) => !value)}>
          Menu
        </button>
      </div>

      {open && (
        <div className="mt-4 space-y-2 rounded-2xl border border-white/10 bg-slate-900 p-3 md:hidden">
          {links.map((link) => (
            <button key={link} className="block w-full rounded-xl px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/5">
              {link}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
`;

export const usageCode = `
import ResponsiveNavbar from "./Component";

export default function Example() {
  return <ResponsiveNavbar />;
}
`;
