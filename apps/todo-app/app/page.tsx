import { listTodos } from "./actions/todo-actions";
import { TodoForm } from "./components/todo-form";
import { TodoList } from "./components/todo-list";
import { TodoFilter } from "./components/todo-filter";
import { Suspense } from "react";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const filterParams =
    resolvedSearchParams.filter === "completed"
      ? { completed: true }
      : resolvedSearchParams.filter === "active"
      ? { completed: false }
      : undefined;

  const todos = await listTodos(filterParams);

  // Ensure todos is an array
  const serializedTodos = Array.from(todos).map((t) => ({
    id: t.id as number,
    title: t.title as string,
    completed: t.completed as boolean,
  }));

  serializedTodos.sort((a, b) => b.id - a.id);

  return (
    <main className="flex min-h-screen flex-col items-center py-10 px-4 md:py-20">
      <div className="w-full max-w-[640px] border border-paper-line bg-paper relative pb-20">
        
        {/* Header Section */}
        <div className="flex items-end justify-between px-6 pt-10 pb-4 relative z-10">
          <div className="flex items-center gap-3">
            {/* Hand-drawn pencil SVG */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-ink-muted shrink-0"
            >
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
            <h1 className="font-display font-[560] text-3xl md:text-4xl tracking-tight text-ink">
              Little List
            </h1>
          </div>
          
          <Suspense fallback={null}>
            <TodoFilter />
          </Suspense>
        </div>

        {/* Double Rule Motif */}
        <div className="border-t border-paper-line mb-1"></div>
        <div className="border-t border-paper-line mb-6"></div>

        <TodoForm />
        <TodoList todos={serializedTodos} filter={resolvedSearchParams.filter} />
      </div>
    </main>
  );
}
