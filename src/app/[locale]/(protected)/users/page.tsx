"use client";

import React from "react";
import UserList from "@/modules/users/components/UserList";
import { useUsers } from "@/modules/users/hooks/useUsers";

export default function UsersPage() {
  const { data, loading, refresh } = useUsers();

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto">
      <UserList
        data={data}
        loading={loading}
        onRefresh={refresh}
        title="Employees / Users"
        subtitle="Manage Access & Roles"
      />
    </div>
  );
}
