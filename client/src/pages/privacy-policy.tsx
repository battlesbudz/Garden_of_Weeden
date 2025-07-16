
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-battles-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/">
          <button className="flex items-center text-battles-gold hover:text-yellow-400 mb-8 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </button>
        </Link>

        <h1 className="text-4xl font-playfair font-bold text-battles-gold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none space-y-6">
          <p className="text-gray-300 text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-battles-gold">Information We Collect</h2>
            <p className="text-gray-300">
              At Battles Budz LLC, we collect information you provide directly to us, such as when you:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Subscribe to our newsletter</li>
              <li>Submit a job application</li>
              <li>Contact us through our website</li>
              <li>Book events or experiences</li>
              <li>Create an investor account</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-battles-gold">How We Use Your Information</h2>
            <p className="text-gray-300">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Provide and improve our services</li>
              <li>Send you newsletters and updates about our business</li>
              <li>Process job applications and communicate with candidates</li>
              <li>Respond to your inquiries and requests</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-battles-gold">Information Sharing</h2>
            <p className="text-gray-300">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-battles-gold">Data Security</h2>
            <p className="text-gray-300">
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-battles-gold">Contact Us</h2>
            <p className="text-gray-300">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="text-gray-300">
              <p>Email: battlesbudz@gmail.com</p>
              <p>Phone: (904) 415-7635</p>
              <p>Address: Gloversville, NY 12078</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
