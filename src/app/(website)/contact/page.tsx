import React, { Suspense } from "react";
import ContactContent from "./ContactContent";

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ContactContent />
    </Suspense>
  );
}
