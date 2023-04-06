import LogoutButton from "@meal-genie/components/LogoutButton";
import { useUser } from "@meal-genie/lib/useUser";
import Image from "next/image";
import { HiCog, HiDotsVertical, HiLogin, HiUser } from "react-icons/hi";

async function Navbar() {
  const userData = await useUser();

  return (
    <nav className="navbar sticky top-0 z-10 bg-[#439de1] text-white shadow-xl">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-l" href="/">
          <Image
            className="mr-2 h-10"
            src={"/images/logo_transparent.svg"}
            alt="''"
            width={55}
            height={55}
          ></Image>
          Meal Genie
        </a>
      </div>

      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-neutral">
            <HiDotsVertical className="h-5 w-5 "></HiDotsVertical>
          </label>
          <ul
            tabIndex={0}
            className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52 text-black"
          >
            <li>
              {userData?.model?.name ? (
                <a className="justify-between">
                  <HiUser className="mr-2 h-5 w-5"></HiUser>Logged in as:{" "}
                  {userData.model.name}
                </a>
              ) : (
                <a href="#loginModal">
                  <HiLogin className="mr-2"></HiLogin> Login
                </a>
              )}
            </li>
            <li>
              <a>
                <HiCog className="mr-2"></HiCog> Settings
              </a>
            </li>
            <li>
              <LogoutButton></LogoutButton>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
