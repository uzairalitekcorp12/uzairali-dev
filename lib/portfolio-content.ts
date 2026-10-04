import "server-only";
import { cache } from "react";
import type { PortfolioContent } from "@/data/portfolio";
import { getAdminData } from "@/lib/admin-storage";
import { defaultPortfolioContent, normalizePortfolioContent } from "@/lib/portfolio-content-shared";

export { defaultPortfolioContent, normalizePortfolioContent } from "@/lib/portfolio-content-shared";

export const getPortfolioContent = cache(async (): Promise<PortfolioContent> => {
  try {
    const stored = await getAdminData();
    return normalizePortfolioContent(stored.portfolioContent) ?? defaultPortfolioContent();
  } catch {
    return defaultPortfolioContent();
  }
});
