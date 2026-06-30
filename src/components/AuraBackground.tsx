import { useGame } from "@/lib/store";

/** Slow-moving luminous aura meshes behind the app, themed. */
export function AuraBackground() {
  const animations = useGame((s) => s.animations);
  const blobs = [
    { v: "--aura-1", top: "-10%", left: "-8%", size: "55vmax", dur: 26 },
    { v: "--aura-2", top: "30%", left: "55%", size: "48vmax", dur: 32 },
    { v: "--aura-3", top: "60%", left: "-12%", size: "50vmax", dur: 29 },
    { v: "--aura-4", top: "-5%", left: "60%", size: "42vmax", dur: 35 },
    { v: "--aura-5", top: "55%", left: "40%", size: "46vmax", dur: 30 },
  ];
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {blobs.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle at 50% 50%, var(${b.v}), transparent 62%)`,
            opacity: 0.55,
            filter: "blur(40px)",
            animation: animations ? `drift ${b.dur}s ease-in-out infinite` : "none",
          }}
        />
      ))}
      <div className="absolute inset-0 backdrop-blur-[60px]" />
    </div>
  );
}
