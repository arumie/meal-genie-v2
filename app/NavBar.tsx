import LogoutButton from "@meal-genie/components/LogoutButton";
import { logout } from "@meal-genie/lib/auth";
import { useUser } from "@meal-genie/lib/useUser";
import Image from "next/image";
import { MdMenu } from "react-icons/md";

function getInitials(name: string) {
  return name.match(/\b(\w)/g)?.join("");
}

async function Navbar() {
  const userData = await useUser();

  return (
    <nav className="navbar sticky top-0 z-10 bg-[#439de1] text-white shadow-xl">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-l">
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
            <MdMenu className="h-8 w-8"></MdMenu>
          </label>
          <ul
            tabIndex={0}
            className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52 text-black"
          >
            <li>
              <a className="justify-between">
                Logged in as: {userData?.model?.name && userData.model.name}
              </a>
            </li>
            <li>
              <a>Settings</a>
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
