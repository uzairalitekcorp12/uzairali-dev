import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";

export function InnerHeader({ backHref = "/", backLabel = "Home" }: { backHref?: string; backLabel?: string }) {
  return (
    <header className="inner-header">
      <Link href="/" className="site-logo"><span>UA</span><i /></Link>
      <Link href={backHref} className="inner-header-back"><ArrowLeft /> {backLabel}</Link>
      <a href="/resume?download=1" className="inner-header-resume"><Download /> Résumé</a>
    </header>
  );
}
