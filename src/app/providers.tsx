// app/providers.tsx

"use client";

import { ReactNode } from "react";
import { TemplateProvider } from "@/components/template/template-context";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <TemplateProvider>{children}</TemplateProvider>;
}
