'use client';

import { Todo } from "@prisma/client";
import { toggleTodo } from '@/todos/actions/todo-actions';
import { TodoItemExperimental } from "./TodoItemExperiemental";

interface Props {
  todos?: Todo[];
}

export const TodosGrid = ({ todos = [] }: Props) => {
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
      {
        todos.map( todo => (
          <TodoItemExperimental key={ todo.id } todo={ todo } toggleTodo={ toggleTodo }  />
        ))
      }
    </div>
  )
}
