import React, { useState, useEffect } from 'react';

interface TokenGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function TokenGate({ children, fallback }: TokenGateProps) {
  const [isUnlocked, setIsUnlocked] = useState(true); // Default to public
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Check if Unlock Protocol is configured
    const unlockNetwork = process.env.NEXT_PUBLIC_UNLOCK_NETWORK;
    const lockAddress = process.env.NEXT_PUBLIC_UNLOCK_LOCK_ADDRESS;

    if (!unlockNetwork || !lockAddress) {
      // No token gating configured, show content
      setIsUnlocked(true);
      return;
    }

    // TODO: Implement Unlock Protocol check
    // This would connect wallet and verify token ownership
    setIsChecking(true);
    // For now, default to unlocked (public)
    setIsUnlocked(true);
    setIsChecking(false);
  }, []);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!isUnlocked && fallback) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

