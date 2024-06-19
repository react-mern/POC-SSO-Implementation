import { LogoutButton } from "@/components/auth/LogoutButton";

const DashboardPage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-5 h-full">
      <h1 className="text-white text-3xl">Welcome to Learn Lounge</h1>
      <LogoutButton>Logout</LogoutButton>
    </div>
  );
};

export default DashboardPage;
