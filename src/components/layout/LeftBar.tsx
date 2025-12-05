/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import LeftBarContent from "./LeftBarContent";
import LeftBarSkeleton from "./LeftBarSkeleton";
import api from "@/lib/api/axios";

const LeftBar = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/users/me");
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <LeftBarSkeleton />;
  }

  return <LeftBarContent user={user} />;
};

export default LeftBar;
