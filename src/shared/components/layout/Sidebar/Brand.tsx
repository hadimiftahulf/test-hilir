"use client";
import React from "react";

export default function Brand({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="h-16 flex items-center gap-3 px-4 border-b border-neutral-200/70 dark:border-neutral-800">
      <img
        src="https://ui-avatars.com/api/?name=Hillir&background=7e22fa&color=fff&size=64"
        alt="Logo"
        className="w-9 h-9 rounded-full"
      />
      {!collapsed && (
        <div className="min-w-0">
          <div className="text-[15px] font-semibold text-neutral-900 dark:text-neutral-50 truncate">
            PT Hillir
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
            Technical Test
          </div>
        </div>
      )}
    </div>
  );
}
