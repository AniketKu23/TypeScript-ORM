"use client";

import { useActionState } from "react";
import { createTodo } from "../actions/todo-actions";
import { useRef } from "react";

export function TodoForm() {
  const formAction = async (prevState: any, formData: FormData) => {
    await createTodo(formData);
    return null;
  };
  const [state, action, isPending] = useActionState(formAction, null);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await action(formData);
        formRef.current?.reset();
      }}
      className="px-6 mb-4 group relative flex items-center w-full"
    >
      <div className="absolute left-6 text-sage font-bold text-xl leading-none pt-1">
        +
      </div>
      <input
        type="text"
        name="title"
        placeholder="Write a new line…"
        required
        disabled={isPending}
        className="w-full bg-transparent pl-8 py-3 text-ink placeholder:text-ink-muted font-sans border-b border-paper-line outline-none focus:border-sage-deep focus:ring-0 transition-colors"
      />
    </form>
  );
}
