"use client";

import { FormEvent, useState } from "react";

type SubmitState = "idle" | "success" | "error";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitState("idle");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          consent: true,
          source: "website",
          landingPath: window.location.pathname,
          utm: {},
          hp,
        }),
      });

      if (response.status === 200 || response.status === 204) {
        setSubmitState("success");
        setEmail("");
        setHp("");
      } else {
        setSubmitState("error");
      }
    } catch {
      setSubmitState("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-800">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none ring-gray-900/10 transition focus:border-gray-500 focus:ring"
          placeholder="you@example.com"
        />
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="hp">Leave this field empty</label>
        <input
          id="hp"
          name="hp"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={hp}
          onChange={(event) => setHp(event.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex rounded-md bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Submitting..." : "Join Waitlist"}
      </button>

      {submitState === "success" && (
        <p className="text-sm text-green-700">Thanks! You&apos;re on the list.</p>
      )}
      {submitState === "error" && (
        <p className="text-sm text-red-700">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
