import { motion, AnimatePresence } from "motion/react";

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="fixed inset-x-0 top-1/2 z-[61] mx-auto w-[88%] max-w-xs -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
          >
            <div
              className="glass rounded-3xl p-5"
              style={{ border: "1px solid var(--border)", background: "var(--panel)" }}
            >
              <h3 className="text-base font-extrabold tracking-tight">{title}</h3>
              <p className="mt-2 text-[13px] leading-snug" style={{ color: "var(--muted-text)" }}>
                {body}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={onCancel}
                  className="flex-1 rounded-2xl py-2.5 text-sm font-bold"
                  style={{ background: "var(--panel-2)", color: "var(--text)" }}
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 rounded-2xl py-2.5 text-sm font-extrabold"
                  style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
