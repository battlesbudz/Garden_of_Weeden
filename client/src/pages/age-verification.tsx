
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function AgeVerification() {
  return (
    <div className="min-h-screen bg-battles-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/">
          <button className="flex items-center text-battles-gold hover:text-yellow-400 mb-8 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </button>
        </Link>

        <h1 className="text-4xl font-playfair font-bold text-battles-gold mb-8">Age Verification Policy</h1>
        
        <div className="prose prose-invert max-w-none space-y-6">
          <p className="text-gray-300 text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-battles-gold">Legal Age Requirement</h2>
            <p className="text-gray-300">
              New York State law requires that all cannabis consumers be 21 years of age or older. This website contains information about cannabis products that are intended for adults only.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-battles-gold">Verification Process</h2>
            <p className="text-gray-300">
              Before accessing cannabis-related content or making any purchases, users must verify their age by:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Confirming they are 21 years of age or older</li>
              <li>Providing valid government-issued photo identification when required</li>
              <li>Acknowledging they understand New York cannabis laws</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-battles-gold">Identification Requirements</h2>
            <p className="text-gray-300">
              Valid forms of identification include:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Driver's License</li>
              <li>State-issued ID card</li>
              <li>Passport</li>
              <li>Military ID</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-battles-gold">Compliance</h2>
            <p className="text-gray-300">
              Battles Budz LLC is committed to preventing underage access to cannabis products. We reserve the right to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Request additional verification at any time</li>
              <li>Refuse service to anyone who cannot provide valid identification</li>
              <li>Report suspected underage access attempts to appropriate authorities</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-battles-gold">Penalties</h2>
            <p className="text-gray-300">
              Providing false information about your age or attempting to circumvent age verification systems is illegal and may result in criminal charges and/or civil penalties.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-battles-gold">Contact Us</h2>
            <p className="text-gray-300">
              If you have questions about our age verification policy, please contact us at battlesbudz@gmail.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
