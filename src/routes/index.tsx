import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { BetweenUsApp } from "@/components/BetweenUsApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Between Us — Intimate Conversation Card Game" },
      {
        name: "description",
        content:
          "Between Us is an intimate, relationship-driven conversation card game for couples and close connections. Draw, flip and connect.",
      },
      { property: "og:title", content: "Between Us — Intimate Conversation Card Game" },
      {
        property: "og:description",
        content:
          "A premium dual-language conversation game for couples and close connections.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <ClientOnly fallback={<div style={{ minHeight: "100dvh", background: "#fcf7fb" }} />}>
      <BetweenUsApp />
    </ClientOnly>
  );
}
