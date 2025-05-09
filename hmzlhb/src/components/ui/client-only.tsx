'use client';

import React, { useState, useEffect } from 'react';

// This component will only render its children on the client side
export default function ClientOnly({ children, fallback = null }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Return fallback (null by default) when not on client
  if (!isClient) {
    return fallback;
  }

  // Otherwise, return children
  return <>{children}</>;
}