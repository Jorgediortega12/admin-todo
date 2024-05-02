import { WidgetItem } from "@/components";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function DashboardPage() {

  const session = await getServerSession(authOptions); //Obtenemos todos los datos de nuestro provedor para iniciar sesion. 

  if (!session) {
    redirect('/api/auth/signin'); 
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <WidgetItem title="Usuario conectado Server-side">
        <div className="flex flex-col gap-1">
          <span>{session.user?.name}</span>
          <span>{session.user?.email}</span>
          <span>{session.user?.image}</span>
        </div>

        <div>
          {JSON.stringify(session)}
        </div>
      </WidgetItem>
    </div>
  );
}