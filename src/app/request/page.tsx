import type { Metadata } from "next";
import { RequestWizard } from "@/components/request/RequestWizard";

export const metadata: Metadata = {
  title: "Request a flight",
  description: "Tell us the trip in four screens and get firm quotes from vetted operators.",
};

export default function RequestPage() {
  return <RequestWizard />;
}
