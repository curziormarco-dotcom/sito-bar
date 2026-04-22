"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavLinkProps = {
  href: string;
  children: ReactNode;
  inverted?: boolean;
  className?: string;
};

export function NavLink({ href, children, inverted = false, className = "" }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const toneClass = isActive
    ? inverted
      ? "font-semibold text-white"
      : "font-semibold text-amber-600"
    : inverted
      ? "text-white/72 hover:text-white"
      : "text-neutral-600 hover:text-neutral-900";

  return (
    <Link
      href={href}
      className={`${toneClass} ${className}`.trim()}
    >
      {children}
    </Link>
  );
}
