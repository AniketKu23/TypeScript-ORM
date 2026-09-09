"use client";

import { useOptimistic, useTransition, useState } from "react";
import { toggleTodo, deleteTodo } from "../actions/todo-actions";

type Todo = { id: number; title: string; completed: boolean };

export function TodoList({ todos, filter }: { todos: Todo[]; filter?: string }) {
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(
    todos,
    (state, action: { id: number; type: "toggle" | "delete" }) => {
      if (action.type === "toggle") {
        return state.map((t) =>
          t.id === action.id ? { ...t, completed: !t.completed } : t
        );
      }
      if (action.type === "delete") {
        return state.filter((t) => t.id !== action.id);
      }
      return state;
    }
  );

  const activeTodos = optimisticTodos.filter((t) => !t.completed);
  const doneTodos = optimisticTodos.filter((t) => t.completed);

  if (todos.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <h2 className="font-display text-2xl text-ink mb-2">Nothing on the page yet</h2>
        <p className="font-sans text-ink-muted">Write your first line above.</p>
      </div>
    );
  }

  if (filter === "active" && activeTodos.length === 0 && doneTodos.length > 0) {
    return (
      <div className="px-6 py-12 text-center">
        <h2 className="font-display text-2xl text-blush">Notebook's clear.</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {activeTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} setOptimisticTodos={setOptimisticTodos} />
      ))}
      
      {doneTodos.length > 0 && (
        <div className="px-6 pt-6 pb-2">
          <h3 className="font-sans font-semibold text-ink-muted">Done</h3>
        </div>
      )}

      {doneTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} setOptimisticTodos={setOptimisticTodos} />
      ))}
    </div>
  );
}

function TodoItem({
  todo,
  setOptimisticTodos,
}: {
  todo: Todo;
  setOptimisticTodos: (action: { id: number; type: "toggle" | "delete" }) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [animatingOut, setAnimatingOut] = useState(false);

  const handleToggle = () => {
    if (todo.completed) {
      // Immediate un-toggle, no complex animation outwards requested by brief
      startTransition(() => {
        setOptimisticTodos({ id: todo.id, type: "toggle" });
        toggleTodo(todo.id, todo.completed);
      });
      return;
    }

    // Checking off animation sequence
    setAnimatingOut(true);
    
    // total animation time: 200ms (check) + 100ms (delay) + 250ms (strike) = 550ms
    // We wait 600ms to be safe before actually moving it to "Done" in the DOM
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeout = prefersReducedMotion ? 0 : 600;

    setTimeout(() => {
      startTransition(() => {
        setOptimisticTodos({ id: todo.id, type: "toggle" });
        toggleTodo(todo.id, todo.completed);
      });
      setAnimatingOut(false);
    }, timeout);
  };

  const handleDelete = () => {
    startTransition(() => {
      setOptimisticTodos({ id: todo.id, type: "delete" });
      deleteTodo(todo.id);
    });
  };

  const isChecking = animatingOut;
  const isDone = todo.completed;

  return (
    <div
      className={`group flex items-center justify-between px-6 py-3 border-b border-paper-line overflow-hidden motion-safe-transition ${
        isDone ? "opacity-70" : "opacity-100"
      }`}
    >
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={handleToggle}
          className="shrink-0 focus-ring-custom rounded-sm p-1 -ml-1 text-ink"
          aria-label={isDone ? "Mark as active" : "Mark as done"}
          disabled={isChecking || isPending}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" stroke="currentColor" strokeWidth="1.5" rx="1" />
            {(isDone || isChecking) && (
              <path
                d="M6 12L10 16L18 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={isChecking ? "animate-draw-check" : ""}
              />
            )}
          </svg>
        </button>
        
        <div className="relative font-sans text-ink flex-1">
          <span className={isDone ? "text-ink-muted" : ""}>{todo.title}</span>
          {(isDone || isChecking) && (
            <svg
              className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-full pointer-events-none text-ink-muted"
              preserveAspectRatio="none"
              viewBox="0 0 100 10"
              fill="none"
            >
              <path
                d="M0 5 Q 50 3, 100 6"
                stroke="currentColor"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                className={isChecking ? "animate-draw-strike" : ""}
              />
            </svg>
          )}
        </div>
      </div>

      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0 text-ink-muted hover:text-ink focus-ring-custom rounded-sm px-2 text-xl leading-none transition-opacity pb-1"
        aria-label="Delete todo"
        disabled={isChecking || isPending}
      >
        ×
      </button>
    </div>
  );
}
