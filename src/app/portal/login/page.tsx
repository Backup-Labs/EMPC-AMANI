import React, { Suspense } from "react";
import PortalLoginContent from "./PortalLoginContent";

export default function PortalLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <PortalLoginContent />
    </Suspense>
  );
}
