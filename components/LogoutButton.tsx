"use client";

import { logout } from "@meal-genie/lib/auth";
import { pb } from "@meal-genie/lib/pocketbase";
import { useRouter } from "next/navigation";
import { HiLogout } from "react-icons/hi";
import { useSWRConfig } from "swr";

function LogoutButton() {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const handleLogout = async () => {
    pb.authStore.clear();
    await logout();
    //Clear all SWR data
    mutate(/* match all keys */ () => true, undefined, false);
    router.refresh();
  };
  return (
    <>
      <a onClick={handleLogout}><HiLogout className="mr-2"></HiLogout>Logout</a>
    </>
  );
}

export default LogoutButton;
