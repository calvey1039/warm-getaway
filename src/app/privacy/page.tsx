import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - Warm Road",
  description: "Privacy Policy for Warm Road - Find warm weather destinations within driving distance",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Warm Road
        </Link>

        <h1 className="text-3xl font-semibold text-zinc-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-zinc-500 mb-8">Last updated: February 24, 2026</p>

        <div className="prose prose-zinc prose-sm max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">Overview</h2>
            <p className="text-zinc-600 leading-relaxed">
              Warm Road ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">Information We Collect</h2>

            <h3 className="text-lg font-medium text-zinc-800 mt-4 mb-2">Location Data</h3>
            <p className="text-zinc-600 leading-relaxed mb-3">
              With your permission, we collect your approximate location to calculate driving distances to destinations. This data is:
            </p>
            <ul className="list-disc list-inside text-zinc-600 space-y-1 ml-4">
              <li>Only used locally in your browser</li>
              <li>Never stored on our servers</li>
              <li>Never shared with third parties</li>
            </ul>

            <h3 className="text-lg font-medium text-zinc-800 mt-4 mb-2">Local Storage</h3>
            <p className="text-zinc-600 leading-relaxed mb-3">
              We use your browser's local storage to save:
            </p>
            <ul className="list-disc list-inside text-zinc-600 space-y-1 ml-4">
              <li>Your favorite destinations</li>
              <li>Your booking site preferences</li>
              <li>Your fuel efficiency and gas price settings</li>
            </ul>
            <p className="text-zinc-600 leading-relaxed mt-3">
              This data remains on your device and is never transmitted to our servers.
            </p>

            <h3 className="text-lg font-medium text-zinc-800 mt-4 mb-2">Zip Code</h3>
            <p className="text-zinc-600 leading-relaxed">
              If you enter a zip code, it is used solely to determine your starting location for distance calculations. We do not store or track zip codes entered.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">Third-Party Services</h2>
            <p className="text-zinc-600 leading-relaxed mb-3">
              Our website integrates with the following third-party services:
            </p>
            <ul className="list-disc list-inside text-zinc-600 space-y-1 ml-4">
              <li><strong>Open-Meteo API:</strong> For weather forecast data</li>
              <li><strong>OpenStreetMap/Nominatim:</strong> For zip code geocoding</li>
              <li><strong>Leaflet Maps:</strong> For interactive map display</li>
              <li><strong>EIA API:</strong> For current gas price data</li>
            </ul>
            <p className="text-zinc-600 leading-relaxed mt-3">
              When you click on booking links (hotels, flights, car rentals), you will be redirected to third-party websites. These sites have their own privacy policies, and we encourage you to review them.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">Cookies</h2>
            <p className="text-zinc-600 leading-relaxed">
              Warm Road does not use cookies for tracking or advertising purposes. We only use browser local storage to remember your preferences as described above.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">Data Security</h2>
            <p className="text-zinc-600 leading-relaxed">
              Since we do not collect or store personal data on our servers, there is no centralized database of user information. Your preferences and favorites are stored locally on your device and can be cleared at any time through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">Children's Privacy</h2>
            <p className="text-zinc-600 leading-relaxed">
              Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">Changes to This Policy</h2>
            <p className="text-zinc-600 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">Contact Us</h2>
            <p className="text-zinc-600 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us through our GitHub repository.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-200">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-900 hover:text-orange-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Warm Road
          </Link>
        </div>
      </div>
    </div>
  );
}
