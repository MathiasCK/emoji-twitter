import Spinner from "./Spinner";

const LoadingPage = () => (
  <div className="absolute right-0 top-0 flex h-screen w-screen items-center justify-center align-middle">
    <Spinner size={60} />
  </div>
);

export default LoadingPage;
