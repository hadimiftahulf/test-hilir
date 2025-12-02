import { redirect } from "next/navigation";
import { getSessionUser } from "@/shared/lib/auth";

export default async function LocaleRoot({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale || "en";
  const user = await getSessionUser();
  redirect(`/${locale}/${user ? "dashboard" : "login"}`);
}
