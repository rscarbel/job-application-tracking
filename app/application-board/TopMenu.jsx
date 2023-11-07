"use client";

import React from "react";
import Link from "next/link";

const TopMenu = ({ activeIndex }) => {
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

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between">
          <div className="flex">
            <div className="sm:ml-6 sm:flex sm:space-x-8">
              {menuItems.map((item, index) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`text-gray-300 hover:bg-gray-700 hover:text-white
                    px-3 py-2 rounded-md text-sm font-medium ${
                      activeIndex === index ? "bg-gray-900 text-white" : ""
                    }`}
                >
                  {item.label} <span className={item.iconClass}></span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopMenu;
