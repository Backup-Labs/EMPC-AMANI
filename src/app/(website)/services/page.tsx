import { getSiteContent } from "@/lib/cms/settings";
import { ServicesClient } from "./ServicesClient";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const siteContent = await getSiteContent();
  return <ServicesClient services={siteContent.services} intro={siteContent.services_intro} />;
}
