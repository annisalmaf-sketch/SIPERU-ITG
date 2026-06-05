import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardRedirect() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const role = (session.user as any).role;

  if (role === "ADMIN") {
    redirect("/dashboard/admin");
  } else if (role === "KAJUR") {
    redirect("/dashboard/kajur");
  } else if (role === "BKKH") {
    redirect("/dashboard/bkkh");
  } else if (role === "SARPAS") {
    redirect("/dashboard/sarpas");
  } else if (role === "DOSEN") {
    redirect("/dashboard/dosen");
  } else {
    redirect("/dashboard/mahasiswa");
  }
}
