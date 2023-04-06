import MealPlanList from "@meal-genie/components/MealPlanList";
import NotLoggedIn from "@meal-genie/components/NoLoggedIn";
import { useUser } from "@meal-genie/lib/useUser";
import { HiPlus } from "react-icons/hi";

async function getMealPlans(userId: string) {  
  const res = await fetch(`http://127.0.0.1:8090/api/collections/mealplans/records?userId=${userId}`, { cache: 'no-store' });  const data = await res.json();
  return data?.items as any[];
}

export default async function Home() {
  const user = useUser();
  if (user == null) {
    return (
      <NotLoggedIn></NotLoggedIn>
    )
  }
  
  const mealPlans = await getMealPlans(user.id);

  return (
    <main>
      <div className="container m-auto mt-5 mb-5">
        <div className="card bg-base-100 text-black w-1/2 m-auto shadow-xl">
        <MealPlanList mealPlans={mealPlans} user={user}></MealPlanList>

          <div className="card-body bg-base-100 rounded-b-md">
            <div className="card-actions">
              <a
                href="/create"
                className="btn btn-primary w-full text-white normal-case"
              >
                <HiPlus className="mr-2"></HiPlus>
                Create new meal plan
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
