import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
    // For the people who read robots.txt: hi.
    return { rules: { userAgent: "*", allow: "/", disallow: "/my-sleep-schedule" }, sitemap: `${SITE_URL}/sitemap.xml` };
}
