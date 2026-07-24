import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { AccountView } from "@/components/account/AccountView";

export default async function AccountPage() {
  const user = await getSessionUser();
  if (!user) redirect("/signin");

  const memberSince = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(user.createdAt);

  return (
    <AccountView
      user={{
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        memberSince,
      }}
    />
  );
}
