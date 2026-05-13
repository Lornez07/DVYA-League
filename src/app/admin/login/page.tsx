"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth-actions";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, undefined);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-athletic text-navy mb-2">ADMIN ACCESS</h1>
          <p className="text-gray-500 font-medium italic">Enter password to proceed</p>
        </div>
        <form action={formAction} className="space-y-6">
          <div>
            <input
              type="password"
              name="password"
              placeholder="Admin Password"
              required
              className="w-full px-6 py-4 rounded-xl border-2 border-gray-100 focus:border-gold outline-none transition-all font-bold text-center text-navy tracking-widest"
            />
            {state?.error && (
              <p className="text-red-500 text-xs font-bold mt-2 text-center uppercase tracking-tight">
                {state.error}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 bg-navy text-gold font-athletic text-2xl rounded-xl hover:bg-gold hover:text-navy transition-all shadow-lg hover:shadow-gold/20 disabled:opacity-50"
          >
            {isPending ? "UNLOCKING..." : "UNLOCK DASHBOARD"}
          </button>
        </form>
      </div>
    </div>
  );
}
