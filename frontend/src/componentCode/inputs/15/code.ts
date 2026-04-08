export const code = `
import { useState } from "react";

export default function ToggleSwitch() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="flex items-center justify-between gap-6 rounded-3xl border border-white/10 bg-[#111827] p-6 text-white shadow-2xl">
      <div>
        <p className="font-semibold">Smart sync</p>
        <p className="text-sm text-slate-400">Keep local changes mirrored across devices.</p>
      </div>
      <button
        type="button"
        aria-pressed={enabled}
        onClick={() => setEnabled((value) => !value)}
        className={\`flex h-8 w-14 items-center rounded-full p-1 transition \${enabled ? "bg-cyan-400" : "bg-slate-600"}\`}
      >
        <span
          className={\`h-6 w-6 rounded-full bg-white transition \${enabled ? "translate-x-6" : "translate-x-0"}\`}
        />
      </button>
    </div>
  );
}
`;

export const usageCode = `
import ToggleSwitch from "./Component";

export default function Example() {
  return <ToggleSwitch />;
}
`;
