import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-5">
      <h1 className="text-white text-3xl">Welcome to Academix</h1>
      <Link to="/login">
        <Button variant="secondary">Proceed to Login</Button>
      </Link>
    </div>
  );
};

export default Home;
