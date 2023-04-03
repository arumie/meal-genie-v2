"use client";

import { logout } from "@meal-genie/lib/auth";
import { pb } from "@meal-genie/lib/pocketbase";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";

function LogoutButton() {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const handleLogout = async () => {
    pb.authStore.clear();
    logout();
    //Clear all SWR data
    mutate(/* match all keys */ () => true, undefined, false);
    await router.push("/login");
    router.refresh();
  };
  return (
    <>
      <a onClick={handleLogout}>Logout</a>
    </>
  );
}

export default LogoutButton;
