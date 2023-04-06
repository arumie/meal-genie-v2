import { PbUser } from "@meal-genie/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const useUser = () => {
  const nextCookies = cookies()
  const pb_auth = nextCookies.get('pb_auth')
  let user = null
  if (pb_auth) {
    user = JSON.parse(pb_auth.value)
    return user
  } else {
    return null
  }
}

export const useUserProtected = ({ redirectTo = "/login" } = {}) => {
  const nextCookies = cookies();
  const pb_auth = nextCookies.get("pb_auth");
  let user = null;
  
  if (!pb_auth) {
    try {
      redirect(redirectTo);
    } catch (e) {
      console.log(e)
    }
  } else {
    user = JSON.parse(pb_auth.value);
  }
  return user;
};
