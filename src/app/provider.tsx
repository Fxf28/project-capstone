"use client";

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function Provider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    const checkIsNewUser = async () => {
      if (user) {
        try {
          const result = await axios.post("/api/create-user", { user });
          console.log(result.data);
        } catch (error) {
          console.error("Failed to create user:", error);
        }
      }
    };

    if (isLoaded && !isSignedIn) {
      router.push("/");
    } else if (user) {
      checkIsNewUser();
    }
  }, [user, isLoaded, isSignedIn, router]);

  return <div>{children}</div>;
}

export default Provider;