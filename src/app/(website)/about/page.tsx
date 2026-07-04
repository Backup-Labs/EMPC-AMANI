import { getSiteContent } from "@/lib/cms/settings";
import { AboutClient } from "./AboutClient";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const content = await getSiteContent();
  return <AboutClient content={content} />;
}
