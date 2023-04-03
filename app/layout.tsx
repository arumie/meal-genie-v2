import { SiGithub } from "react-icons/si";
import Navbar from "./NavBar";
import "./globals.css";
import { useUser } from "@meal-genie/lib/useUser";

export const metadata = {
  title: "MealGenieV2",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {/* @ts-ignore */}
        <Navbar />
        <div>{children}</div>

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
      </body>
    </html>
  );
}
