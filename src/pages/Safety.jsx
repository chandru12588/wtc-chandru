import React from "react";
import { ShieldCheck, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function Safety() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Safety Guidelines</h1>

      <p className="text-gray-700 text-sm mb-6">
        Your safety is our top priority. Here are the essential measures we follow at every campsite.
      </p>

      {/* Safety Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition">
          <ShieldCheck className="text-emerald-600 mb-3" size={32} />
          <h3 className="font-semibold mb-2">Verified Camps</h3>
          <p className="text-sm text-gray-600">All camps are checked by our field team for safety, hygiene & comfort.</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition">
          <AlertTriangle className="text-yellow-600 mb-3" size={32} />
          <h3 className="font-semibold mb-2">Emergency Support</h3>
          <p className="text-sm text-gray-600">Trained staff available for basic first-aid & support on location.</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition">
          <CheckCircle2 className="text-blue-600 mb-3" size={32} />
          <h3 className="font-semibold mb-2">Secure Environment</h3>
          <p className="text-sm text-gray-600">Safe & family-friendly campsites monitored regularly.</p>
        </div>
      </div>

      {/* Checklist */}
      <h2 className="text-xl font-semibold mb-4">What We Ensure</h2>

      <ul className="space-y-3 text-sm text-gray-700">
        <li className="flex items-center gap-2"><CheckCircle2 className="text-emerald-600" /> Clean tents & bedding</li>
        <li className="flex items-center gap-2"><CheckCircle2 className="text-emerald-600" /> Professional campsite staff</li>
        <li className="flex items-center gap-2"><CheckCircle2 className="text-emerald-600" /> Safe drinking water</li>
        <li className="flex items-center gap-2"><CheckCircle2 className="text-emerald-600" /> Verified food preparation</li>
        <li className="flex items-center gap-2"><CheckCircle2 className="text-emerald-600" /> Basic first-aid kit on site</li>
      </ul>
    </div>
  );
}
