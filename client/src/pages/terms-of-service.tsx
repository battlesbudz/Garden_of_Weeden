
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-battles-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/">
          <button className="flex items-center text-battles-gold hover:text-yellow-400 mb-8 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </button>
        </Link>

        <h1 className="text-4xl font-playfair font-bold text-battles-gold mb-8">Terms of Service</h1>
        
        <div className="prose prose-invert max-w-none space-y-6">
          <p className="text-gray-300 text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-battles-gold">Acceptance of Terms</h2>
            <p className="text-gray-300">
              By accessing and using the Battles Budz LLC website, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-battles-gold">Age Verification</h2>
            <p className="text-gray-300">
              You must be 21 years of age or older to access this website and purchase cannabis products. By using this site, you certify that you are of legal age to purchase cannabis products in New York State.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-battles-gold">Legal Compliance</h2>
            <p className="text-gray-300">
              Battles Budz LLC operates under New York State Adult-Use Microbusiness License OCMMICR-2023-000258. All cannabis products are produced and sold in compliance with New York State regulations.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-battles-gold">Product Information</h2>
            <p className="text-gray-300">
              Cannabis products have not been analyzed or approved by the FDA. Please consume responsibly. Effects may vary by individual. Do not operate vehicles or machinery after consumption.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-battles-gold">Prohibited Uses</h2>
            <p className="text-gray-300">
              You may not use our service:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To transmit any material that is harmful, threatening, abusive, harassing, or otherwise objectionable</li>
              <li>To impersonate or attempt to impersonate the company, employees, or other users</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-battles-gold">Limitation of Liability</h2>
            <p className="text-gray-300">
              Battles Budz LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-battles-gold">Contact Information</h2>
            <p className="text-gray-300">
              Questions about the Terms of Service should be sent to us at battlesbudz@gmail.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
