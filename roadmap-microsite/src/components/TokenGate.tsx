"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

const PAYWALL_SCRIPT_SRC =
  "https://paywall.unlock-protocol.com/static/unlock.latest.min.js";

declare global {
  interface Window {
    unlockProtocol?: {
      loadCheckoutModal: (config: unknown) => void;
    };
  }
}

interface TokenGateProps {
  gatingEnabled: boolean;
  children: ReactNode;
  preview: ReactNode;
}

export function TokenGate({ gatingEnabled, children, preview }: TokenGateProps) {
  const [status, setStatus] = useState<"locked" | "unlocked">("locked");
  const [scriptReady, setScriptReady] = useState(() => {
    if (typeof window === "undefined") return false;
    return Boolean(document.querySelector(`script[src="${PAYWALL_SCRIPT_SRC}"]`));
  });
  const unlockConfig = useMemo(() => buildUnlockConfig(), []);

  useEffect(() => {
    if (!gatingEnabled || scriptReady) return;
    const script = document.createElement("script");
    script.src = PAYWALL_SCRIPT_SRC;
    script.async = true;
    script.onload = () => setScriptReady(true);
    script.onerror = () => setScriptReady(false);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [gatingEnabled, scriptReady]);

  useEffect(() => {
    if (!gatingEnabled) return;

    const handler = (event: MessageEvent) => {
      const payload = event.data as { type?: string; state?: string };
      if (payload?.type === "unlockProtocol.status") {
        setStatus(payload.state === "unlocked" ? "unlocked" : "locked");
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [gatingEnabled]);

  const handleUnlock = () => {
    if (!gatingEnabled) return;
    if (window.unlockProtocol && unlockConfig) {
      window.unlockProtocol.loadCheckoutModal(unlockConfig);
    } else {
      console.warn("Unlock paywall not ready - falling back to preview state");
    }
  };

  if (!gatingEnabled || status === "unlocked") {
    return <>{children}</>;
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="opacity-60">{preview}</div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#04050a]/60 via-[#04050a]/80 to-[#04050a]" />
      <div className="relative z-10 mt-5 flex flex-col items-start gap-3 rounded-2xl border border-white/20 bg-black/50 p-4 text-white">
        <p className="text-sm uppercase tracking-[0.3em] text-white/70">
          Token Holder View
        </p>
        <p className="text-lg font-semibold">
          Connect a wallet with the Unlock lock configured to reveal the full roadmap.
        </p>
        <button
          type="button"
          disabled={!scriptReady || !unlockConfig}
          onClick={handleUnlock}
          className="inline-flex items-center gap-2 rounded-full bg-white/90 px-5 py-2 text-sm font-semibold text-black transition hover:bg-white disabled:cursor-not-allowed disabled:bg-white/40"
        >
          {scriptReady ? "Unlock full roadmap" : "Loading Unlock..."}
        </button>
        {!unlockConfig && (
          <p className="text-xs text-white/60">
            Add Unlock config via NEXT_PUBLIC_UNLOCK_* variables to enable gating.
          </p>
        )}
      </div>
    </div>
  );
}

function buildUnlockConfig() {
  const raw = process.env.NEXT_PUBLIC_UNLOCK_PAYWALL_CONFIG;
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (error) {
      console.warn("Unable to parse NEXT_PUBLIC_UNLOCK_PAYWALL_CONFIG", error);
    }
  }

  const lock = process.env.NEXT_PUBLIC_UNLOCK_LOCK_ADDRESS;
  if (!lock) {
    return null;
  }

  const network = Number(process.env.NEXT_PUBLIC_UNLOCK_NETWORK || 1);
  return {
    title: "BearifiedCo Roadmap Access",
    pessimistic: true,
    locks: {
      [lock]: {
        network,
      },
    },
  };
}
