import Image from "next/image";

export default function NotLoggedIn() {
  return (
    <>
      <div className="hero min-h-[80vh]">
        <div className="hero-content flex-row lg:flex-col text-center">
          <Image
            src="/images/logo_sad_transparent.svg"
            alt="Shoes"
            width={125}
            height={125}
          />
          <div className="text-center lg:text-center text-white">
            <h1 className="text-5xl font-bold">Not logged in</h1>
            <p className="py-6">
              <a href="#loginModal" className="link">
                Login
              </a>{" "}
              in with your username or email order to create meal plans.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
