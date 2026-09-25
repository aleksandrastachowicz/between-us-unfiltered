import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { BetweenUsApp } from "@/components/BetweenUsApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Between Us — Conversation Game for Deep Connections" },
      {
        name: "description",
        content:
          "A conversation game for deep connections. Designed for friends, couples, and anyone wanting to truly know each other.",
      },
      { property: "og:title", content: "Between Us — Conversation Game for Deep Connections" },
      {
        property: "og:description",
        content:
          "A conversation game for deep connections. Designed for friends, couples, and anyone wanting to truly know each other.",
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
