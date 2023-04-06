import { CustomError } from "@meal-genie/lib/auth";
import Image from "next/image";

export default function ErrorMessage(props: {error: CustomError}) {
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
            <h1 className="text-xl font-bold">An error occured</h1>
            <span className="">Message: {props.error.message}</span>
          </div>
        </div>
      </div>
    </>
  );
}
