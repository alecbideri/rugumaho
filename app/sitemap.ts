import { MetadataRoute } from "next";
import { getPosts } from "../lib/mockData";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  
  const postUrls = posts.map((post) => ({
    url: `https://rugumaho.com/posts/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryUrls = ["motherhood", "travel", "wellbeing", "lifestyle"].map((cat) => ({
    url: `https://rugumaho.com/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: "https://rugumaho.com",
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: "https://rugumaho.com/about",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: "https://rugumaho.com/contact",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    ...postUrls,
    ...categoryUrls,
  ];
}
