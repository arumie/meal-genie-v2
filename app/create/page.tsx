import MealGenieForm from "../../components/forms/MealGenieForm";

const  Create = () => {
  return (
    <>
      <div className="container m-auto mt-5 mb-5">
        <div className="card bg-base-100 text-black w-1/2 m-auto shadow-xl">
          <div className="card-body">
            <MealGenieForm></MealGenieForm>
          </div>
        </div>
      </div>
    </>
  );
};

export default Create;
