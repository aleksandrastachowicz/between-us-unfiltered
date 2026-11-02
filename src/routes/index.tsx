import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { BetweenUsApp } from "@/components/BetweenUsApp";
import { SHARE_META } from "@/lib/shareMeta";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: SHARE_META,
  }),
  component: Index,
});

function Index() {
  return (
    <ClientOnly fallback={<div style={{ minHeight: "100dvh", background: "#F2BCCB" }} />}>
      <BetweenUsApp />
    </ClientOnly>
  );
}
