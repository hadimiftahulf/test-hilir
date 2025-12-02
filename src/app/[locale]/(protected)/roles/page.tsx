"use client";

import React from "react";
import RoleList from "@/modules/roles/components/RoleList";
import { useRoles } from "@/modules/roles/hooks/useRoles";

export default function RolesPage() {
  const { data, loading, refresh } = useRoles();

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto">
      <RoleList data={data} loading={loading} onRefresh={refresh} />
    </div>
  );
}
