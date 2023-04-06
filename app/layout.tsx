import { SiGithub } from "react-icons/si";
import Navbar from "./NavBar";
import "./globals.css";
import { useUser } from "@meal-genie/lib/useUser";
import NotLoggedIn from "@meal-genie/components/NoLoggedIn";
import LoginModal from "@meal-genie/components/LoginModal";

export const metadata = {
  title: "MealGenieV2",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useUser();

  return (
    <html lang="en">
      <body className="min-h-screen">
        {/* @ts-ignore */}
        <Navbar />
        {user != null ? <div>{children}</div> : <NotLoggedIn></NotLoggedIn>}

        <div className="footer sticky top-[100vh] justify-end p-2 bg-[#439de1] text-white shadow-inner">
          <div>
            <a
              className="btn btn-ghost btn-sm text-sm normal-case"
              href="https://github.com/arumie"
              target="__blank"
            >
              <SiGithub className="mr-2"></SiGithub> arumie
            </a>
          </div>
        </div>
        <LoginModal></LoginModal>
      </body>
    </html>
  );
}
