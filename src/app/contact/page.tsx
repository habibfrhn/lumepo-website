export default function ContactPage() {
  return (
    <section className="space-y-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900">Contact</h1>
      <p className="text-gray-600">
        Reach us at{" "}
        <a
          href="mailto:hello@lumepo.com"
          className="font-medium text-gray-900 underline underline-offset-2"
        >
          hello@lumepo.com
        </a>
        .
      </p>
    </section>
  );
}
