import Login from "@auth/views/Login";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page() {
  return <Login />;
}
