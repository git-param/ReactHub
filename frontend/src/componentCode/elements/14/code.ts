export const code = `
const badges = [
  { label: "New", tone: "bg-cyan-400/15 text-cyan-300" },
  { label: "Live", tone: "bg-emerald-400/15 text-emerald-300" },
  { label: "Beta", tone: "bg-violet-400/15 text-violet-300" },
];

export default function Badge() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 rounded-3xl border border-white/10 bg-[#0f172a] p-8 text-white shadow-2xl">
      {badges.map((badge) => (
        <span key={badge.label} className={\`rounded-full px-4 py-2 text-sm font-semibold \${badge.tone}\`}>
          {badge.label}
        </span>
      ))}
    </div>
  );
}
`;

export const usageCode = `
import Badge from "./Component";

export default function Example() {
  return <Badge />;
}
`;
