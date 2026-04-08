export const code = `
import { useState } from "react";

const items = [
  { title: "Can I customize the styles?", content: "Yes. The layout uses plain classes and can be adapted quickly." },
  { title: "Does it support multiple sections?", content: "Each item is self-contained, so you can render any number of panels." },
  { title: "Can I keep one open by default?", content: "Set the initial state to the section you want expanded." },
];

export default function Accordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="w-full max-w-xl space-y-3 rounded-3xl border border-white/10 bg-[#111827] p-4 text-white shadow-2xl">
      {items.map((item, index) => (
        <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5">
          <button
            className="flex w-full items-center justify-between px-4 py-3 text-left"
            onClick={() => setOpenIndex((value) => (value === index ? null : index))}
          >
            <span className="font-medium">{item.title}</span>
            <span className="text-cyan-300">{openIndex === index ? "−" : "+"}</span>
          </button>
          {openIndex === index && <p className="px-4 pb-4 text-sm leading-6 text-slate-300">{item.content}</p>}
        </div>
      ))}
    </div>
  );
}
`;

export const usageCode = `
import Accordion from "./Component";

export default function Example() {
  return <Accordion />;
}
`;
