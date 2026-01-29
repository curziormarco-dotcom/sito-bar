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
          ? "text-amber-600 font-semibold"
          : "text-neutral-600 hover:text-neutral-900"
      }
    >
      {children}
    </Link>
  );
}
