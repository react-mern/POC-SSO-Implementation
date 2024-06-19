import Logout from "@/components/auth/Logout";

/**
 * Component for signing out of other apps.
 * Handles the sign-out process and redirects to the specified URL after successful sign-out.
 * @param searchParams Object containing query parameters from the URL, including the 'next' parameter.
 */

const SignOutOtherApps = ({
  searchParams,
}: {
  searchParams: { next: string };
}) => {
  const { next } = searchParams;
  return <Logout next={next} />;
};

export default SignOutOtherApps;
