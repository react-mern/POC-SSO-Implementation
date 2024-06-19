import { LogoutButton } from "@/components/auth/LogoutButton";

const DashboardPage = () => {
  return (
    <div className="text-3xl text-white flex flex-col gap-5 items-center justify-center h-full">
      <h1>Quiz Quest Dashboard Page</h1>
      <LogoutButton>Logout</LogoutButton>
    </div>
  );
};

export default DashboardPage;
