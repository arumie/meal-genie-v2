"use client";

import { usePathname, useRouter } from "next/navigation";
import LoginForm from "./forms/LoginForm";

export default function LoginModal() {
  return (
    <>
      <div className="modal" id="loginModal">
        <div className="modal-box relative">
          <a
            href={'#'}
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </a>
          <LoginForm></LoginForm>
        </div>
      </div>
    </>
  );
}
