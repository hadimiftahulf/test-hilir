import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { Role } from "../types/role";

export function useRoles() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Role[]>([]);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/roles");
      if (!res.ok) throw new Error("Gagal mengambil data roles");
      const json = await res.json();
      setData(json.data || []);
    } catch (error) {
      console.error(error);
      message.error("Gagal memuat data roles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return { data, loading, refresh: fetchRoles };
}
