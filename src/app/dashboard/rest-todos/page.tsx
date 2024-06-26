export const dynamic = 'force-dynamic';

import { getUserSessionServer } from "@/auth/action/auth-action";
import prisma from "@/lib/prisma";
import { NewTodo, TodosGrid } from "@/todos";
import { redirect } from "next/navigation";

export const metadata = {
 title: 'Listado de Todos',
 description: 'SEO Title',
};

export default async function RestTodosPage() {

  const user = await getUserSessionServer(); 
  if(!user) redirect('/api/auth/sigin');
  
  const todos = await prisma.todo.findMany({ where: { userID: user.id }, orderBy: { description: 'asc' } });
  
  return (
    <>
      <span className="text-3xl mb-10">Rest TODOS</span>
      <div className="w-full px-3 mx-5 mb-5">
        <NewTodo />
      </div>
      <TodosGrid todos={ todos } />
    </>
  );
}