import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { collections, products } from "@/lib/data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/shop",
    "/collections",
    "/about",
    "/contact",
  ].map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/shop" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${base}/shop/${p.slug}`,
    lastModified: new Date(p.createdAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const collectionRoutes: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${base}/collections/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...collectionRoutes];
}
