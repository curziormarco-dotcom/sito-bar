"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavLinkProps = {
  href: string;
  children: ReactNode;
};

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={
        isActive
          ? "text-amber-400 font-semibold"
          : "text-white/80 hover:text-white"
      }
    >
      {children}
    </Link>
  );
}