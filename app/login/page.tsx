import LoginForm from "./LoginForm";

export default function Login() {
  return (
    <main>
      <div className="container m-auto mt-5 mb-5 shadow-l">
        <div className="card bg-base-100 text-black w-[500px] m-auto">
          <div className="card-body">
            <h2 className="card-title">Login</h2>
            <LoginForm></LoginForm>
          </div>
        </div>
      </div>
    </main>
  );
}
