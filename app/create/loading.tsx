import LoadingSpinner from "@meal-genie/components/LoadingSpinner";

const Loading = () => {
  return (
    <>
      <div className="container m-auto mt-5 mb-5">
        <div className="flex place-content-center">
          <LoadingSpinner></LoadingSpinner>
        </div>
      </div>
    </>
  );
};

export default Loading;
