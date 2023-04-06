import LoginForm from "../../components/forms/LoginForm";

export default function Login() {
  return (
    <main>
      <div className="hero min-h-[80vh]">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left text-white">
            <h1 className="text-5xl font-bold">Login</h1>
            <p className="py-6">Login in with your username or email order to create meal plans.</p>
          </div>
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <div className="card-body">
              <LoginForm></LoginForm>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
