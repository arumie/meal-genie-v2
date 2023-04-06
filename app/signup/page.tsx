import SignupForm from "../../components/forms/SignupForm";

export default function Signup() {
  return (
    <main>
      <div className="hero min-h-[80vh]">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left text-white">
            <h1 className="text-5xl font-bold">Sign up</h1>
            <p className="py-6">In order to use Meal Genie, you need to provide an API token to OpenAI with access to GPT-4.</p>
            <p className="py-6">Go to <a className="link" href="https://platform.openai.com/account/api-keys" target="__blank">account settings</a> on the OpenAI website to get a token.</p>
          </div>
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <div className="card-body">
              <SignupForm></SignupForm>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
