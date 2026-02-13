import Link from "next/link";
import WaitlistForm from "@/components/WaitlistForm";

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="space-y-4 py-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Build Better Product Launches with Lumepo
        </h1>
        <p className="max-w-2xl text-base text-gray-600 sm:text-lg">
          Lumepo helps teams capture early interest, validate ideas quickly, and
          keep potential users engaged before launch.
        </p>
        <Link
          href="#waitlist"
          className="inline-flex rounded-md bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
        >
          Join Waitlist
        </Link>
      </section>

      <section id="waitlist" className="rounded-lg border border-gray-200 bg-gray-50 p-6">
        <h2 className="text-2xl font-semibold text-gray-900">Waitlist</h2>
        <WaitlistForm />
      </section>
    </div>
  );
}
