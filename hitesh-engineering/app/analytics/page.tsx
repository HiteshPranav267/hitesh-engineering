import type { Metadata } from "next";
import AnalyticsPage from "./AnalyticsPage";

export const metadata: Metadata = {
    title: "Analytics | Hitesh Pranav Reddy",
    description:
        "Real-time site analytics and performance metrics for hitesh-pranav.vercel.app. Transparency and data-driven engineering.",
};

export default function Page() {
    return <AnalyticsPage />;
}
