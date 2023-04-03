import SignupForm from "./SignupForm";

export default function Signup() {
  return (
    <main>
      <div className="container m-auto mt-5 mb-5 shadow-l">
        <div className="card bg-base-100 text-black w-[500px] m-auto">
          <div className="card-body">
            <h2 className="card-title">Sign up</h2>
            <SignupForm></SignupForm>
          </div>
        </div>
      </div>
    </main>
  );
}
