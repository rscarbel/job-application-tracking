"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const BUTTON_STYLE_CLASSES =
  "text-white hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium";

const menuItems = [
  {
    key: "board",
    href: "/application-board/board",
    label: "Board",
    iconClass: "pi pi-fw pi-home",
  },
  {
    key: "Create-Card",
    href: "/application-board/create-card",
    label: "Create Card",
    iconClass: "pi pi-fw pi-plus",
  },
  {
    key: "table",
    href: "/application-board/table",
    label: "Table",
    iconClass: "pi pi-fw pi-table",
  },
];

export default function NavMenu() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="bg-slate-800 mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between">
        <div className="sm:ml-6 sm:flex sm:space-x-8">
          {menuItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`${BUTTON_STYLE_CLASSES} ${
                pathname === item.href ? "bg-slate-600 text-white" : ""
              }`}
            >
              <span className={item.iconClass}></span> {item.label}
            </Link>
          ))}
        </div>
        <div className="sm:mr-6 sm:flex sm:space-x-8">
          {session ? (
            <button onClick={() => signOut()} className={BUTTON_STYLE_CLASSES}>
              Sign out
              <span className="pi pi-fw pi-sign-out block"></span>
            </button>
          ) : (
            <button onClick={() => signIn()} className={BUTTON_STYLE_CLASSES}>
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
