import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { User } from "../types/user";

export function useUsers() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<User[]>([]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Gagal mengambil data user");
      const json = await res.json();
      setData(json.data);
    } catch (error) {
      console.error(error);
      message.error("Gagal memuat data users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { data, loading, refresh: fetchUsers };
}
