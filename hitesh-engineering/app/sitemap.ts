import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    // Use your real domain here once hosted
    const baseUrl = 'https://hitesh-pranav.vercel.app'

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
        // Add other static routes here
        {
            url: `${baseUrl}/notes`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
    ]
}
