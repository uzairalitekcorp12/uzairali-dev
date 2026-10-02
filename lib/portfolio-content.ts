import "server-only";
import type { PortfolioContent } from "@/data/portfolio";
import { getAdminData } from "@/lib/admin-storage";
import { defaultPortfolioContent, normalizePortfolioContent } from "@/lib/portfolio-content-shared";

export { defaultPortfolioContent, normalizePortfolioContent } from "@/lib/portfolio-content-shared";

export async function getPortfolioContent(): Promise<PortfolioContent> {
  try {
    const stored = await getAdminData();
    return normalizePortfolioContent(stored.portfolioContent) ?? defaultPortfolioContent();
  } catch {
    return defaultPortfolioContent();
  }
}
