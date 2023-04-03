import { useUserProtected } from "@meal-genie/lib/useUser";
import NewMealPlanBtn from "@meal-genie/components/NewMealPlanButton";

export default async function Home() {
  await useUserProtected({redirectTo: '/login'})
  return (
    <main>
      <div className="container m-auto mt-5 mb-5 shadow-l">
        <div className="card bg-base-100 text-black">
          <div className="card-body">
            <h2 className="card-title">Card title!</h2>
            <p>If a dog chews shoes whose shoes does he choose?</p>
            <div className="card-actions justify-end">
              <NewMealPlanBtn></NewMealPlanBtn>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
