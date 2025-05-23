import React, { useEffect, useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Mail, Phone, MapPin, Save, Eye, EyeOff, AlertCircle } from "lucide-react";

const EditContactInfo = () => {
  const [contactInfo, setContactInfo] = useState({
    address: "",
    email: "",
    phone: "",
    mapUrl: "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("success"); // success or error
  const [showPreview, setShowPreview] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Fetch contact info on mount
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const docRef = doc(db, "schoolData", "contactInfo");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setContactInfo(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
        setMessage("Failed to load contact information");
        setStatus("error");
      }
    };

    fetchContactInfo();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setContactInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    // Clear map error when user changes the map URL
    if (e.target.name === "mapUrl") {
      setMapError(false);
    }
  };

  // Save to Firestore
  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const docRef = doc(db, "schoolData", "contactInfo");
      await setDoc(docRef, contactInfo);
      setMessage("Contact information updated successfully!");
      setStatus("success");
    } catch (error) {
      console.error("Error updating contact info:", error);
      setMessage("Failed to update contact information");
      setStatus("error");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 5000); // Clear message after 5s
    }
  };

  // Toggle preview mode
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  // Handle iframe load error
  const handleMapError = () => {
    setMapError(true);
  };

  // Helper function to verify and correct Google Maps embed URL
  const getValidMapUrl = () => {
      return contactInfo.mapUrl?.trim() || "";
    };

  // Validate if the URL is likely to be embeddable
  const isLikelyEmbeddable = (url) => {
    if (!url) return true;
    return url.includes("google.com/maps/embed") || url.includes("maps.google.com/embed");
  };

  return (
    <div className="max-w-4xl mx-auto border-4 border-yellow-400 rounded-lg shadow-lg bg-white">
      {/* Header with logo-inspired styling */}
      <div className="bg-blue-900 px-6 py-4 rounded-t-lg border-b-4 border-yellow-400">
        <h2 className="text-2xl font-bold text-white">Dynamic Academy Contact Information</h2>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-blue-900">Manage Contact Details</h3>
          <button
            onClick={togglePreview}
            className="flex items-center gap-2 bg-yellow-100 text-blue-900 font-medium px-4 py-2 rounded-md hover:bg-yellow-200 transition-colors border border-yellow-400"
          >
            {showPreview ? (
              <>
                <EyeOff size={18} /> Hide Preview
              </>
            ) : (
              <>
                <Eye size={18} /> Show Preview
              </>
            )}
          </button>
        </div>

        <div className={`grid ${showPreview ? "grid-cols-1 md:grid-cols-2 gap-6" : "grid-cols-1"}`}>
          {/* Edit Form */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-md border-2 border-blue-200">
            <h3 className="text-lg font-semibold mb-4 text-blue-900 pb-2 border-b-2 border-yellow-400">Edit Contact Details</h3>

            <div className="space-y-5">
              <div>
                <label className="block font-medium text-blue-900 mb-1">Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-600">
                    <MapPin size={18} />
                  </div>
                  <textarea
                    name="address"
                    value={contactInfo.address}
                    onChange={handleChange}
                    className="w-full border border-blue-300 rounded-md pl-10 py-2 focus:ring-red-500 focus:border-red-500 bg-white"
                    rows={3}
                    placeholder="School address"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-blue-900 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-600">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={contactInfo.email}
                    onChange={handleChange}
                    className="w-full border border-blue-300 rounded-md pl-10 py-2 focus:ring-red-500 focus:border-red-500 bg-white"
                    placeholder="contact@school.edu"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-blue-900 mb-1">Phone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-600">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={contactInfo.phone}
                    onChange={handleChange}
                    className="w-full border border-blue-300 rounded-md pl-10 py-2 focus:ring-red-500 focus:border-red-500 bg-white"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-blue-900 mb-1">Google Maps Embed URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-600">
                    <MapPin size={18} />
                  </div>
                  <input
                    type="text"
                    name="mapUrl"
                    value={contactInfo.mapUrl}
                    onChange={handleChange}
                    className={`w-full border ${mapError ? 'border-red-500' : 'border-blue-300'} rounded-md pl-10 py-2 focus:ring-red-500 focus:border-red-500 bg-white`}
                    placeholder="https://www.google.com/maps/embed?..."
                  />
                  {mapError && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle size={16} /> Unable to load the map. Please check the embed URL.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors w-full md:w-auto disabled:bg-red-400"
              >
                {saving ? (
                  "Saving..."
                ) : (
                  <>
                    <Save size={18} /> Save Changes
                  </>
                )}
              </button>
            </div>

            {message && (
              <div
                className={`mt-4 p-3 rounded-md ${status === "success" ? "bg-green-100 border border-green-500 text-green-700" : "bg-red-100 border border-red-500 text-red-700"
                  } flex items-start gap-2`}
              >
                {status === "error" && <AlertCircle size={18} />}
                <p>{message}</p>
              </div>
            )}
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="bg-white p-6 rounded-lg shadow-md border-2 border-blue-200">
              <h3 className="text-lg font-semibold mb-4 text-blue-900 pb-2 border-b-2 border-yellow-400">Contact Preview</h3>

              <div className="border-2 border-blue-100 rounded-md overflow-hidden">
                <div className="bg-blue-900 p-4">
                  <h4 className="text-xl font-bold text-center text-white">Contact Us</h4>
                </div>

                <div className="p-4 space-y-4 bg-blue-50">
                  {contactInfo.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="text-red-600 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <h5 className="font-medium text-blue-900">Address</h5>
                        <p className="text-blue-800 whitespace-pre-line">{contactInfo.address}</p>
                      </div>
                    </div>
                  )}

                  {contactInfo.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="text-red-600 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <h5 className="font-medium text-blue-900">Email</h5>
                        <a href={`mailto:${contactInfo.email}`} className="text-red-600 hover:underline">
                          {contactInfo.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {contactInfo.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="text-red-600 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <h5 className="font-medium text-blue-900">Phone</h5>
                        <a href={`tel:${contactInfo.phone}`} className="text-red-600 hover:underline">
                          {contactInfo.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {contactInfo.mapUrl && (
                    <div className="mt-4">
                      <h5 className="font-medium text-blue-900 mb-2">Our Location</h5>
                      <div className="aspect-video bg-white flex items-center justify-center rounded border-2 border-yellow-400 relative">
                        {contactInfo.mapUrl ? (
                          <>
                            <iframe
                              src={getValidMapUrl()}
                              width="100%"
                              height="100%"
                              className="border-0"
                              allowFullScreen=""
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                              title="School Location Map"
                              onError={handleMapError}
                            ></iframe>
                            {mapError && (
                              <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
                                <div className="text-center p-4">
                                  <AlertCircle size={40} className="mx-auto mb-2 text-red-500" />
                                  <p className="text-red-600 font-medium">Map cannot be displayed</p>
                                  <p className="text-sm text-blue-800 mt-1">Please use a valid Google Maps embed URL</p>
                                  <p className="text-xs text-blue-600 mt-2">
                                    URLs must start with: https://www.google.com/maps/embed
                                  </p>
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-blue-400 text-center">Map preview will appear here</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer with academy-inspired styling */}
      <div className="mt-4 py-4 border-t-2 border-yellow-400 text-sm text-center text-blue-900 bg-blue-50">
        <p>© 2025 Dynamic Academy of Science - Ashrafpur Majgawan</p>
      </div>
    </div>
  );
};

export default EditContactInfo;