import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../redux/adminSlice";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ta", label: "Tamil" },
  { code: "hi", label: "Hindi" },
  { code: "te", label: "Telugu" },
  { code: "kn", label: "Kannada" },
  { code: "ml", label: "Malayalam" },
  { code: "bn", label: "Bengali" },
  { code: "gu", label: "Gujarati" },
  { code: "mr", label: "Marathi" },
  { code: "or", label: "Oriya" },
  { code: "ur", label: "Urdu" }
];

function Settings() {
  const dispatch = useDispatch();
  const { admin } = useSelector((state) => state.admin);
  const [localAdmin, setLocalAdmin] = useState(admin || {});
  const [language, setLanguage] = useState("en");
  const [status, setStatus] = useState("");

  useEffect(() => {
    // hydrate from localStorage if redux empty
    if (!localAdmin || Object.keys(localAdmin).length === 0) {
      const stored = localStorage.getItem("admin");
      if (stored) {
        const parsed = JSON.parse(stored);
        setLocalAdmin(parsed);
        dispatch(login(parsed));
      }
    }
  }, []);

  const onSaveProfile = () => {
    try {
      const updated = { ...localAdmin };
      // persist to localStorage and redux
      localStorage.setItem("admin", JSON.stringify(updated));
      dispatch(login(updated));
      setStatus("Profile updated");
      setTimeout(() => setStatus(""), 2000);
    } catch (e) {
      setStatus("Failed to update profile");
      setTimeout(() => setStatus(""), 2500);
    }
  };

  const applyGoogleTranslate = (langCode) => {
    try {
      const googleSelect = document.querySelector('#google_translate_element_dashboard .goog-te-combo')
        || document.querySelector('#google_translate_element .goog-te-combo');
      if (googleSelect) {
        googleSelect.value = langCode;
        const changeEvent = new Event('change', { bubbles: true });
        googleSelect.dispatchEvent(changeEvent);
      } else {
        // initialize inline translate element if not present
        if (!window.googleTranslateElementInit) {
          window.googleTranslateElementInit = function () {
            new window.google.translate.TranslateElement(
              {
                pageLanguage: "en",
                includedLanguages: LANGUAGES.map(l => l.code).join(','),
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              },
              "google_translate_element"
            );
          };
        }
        if (!document.querySelector('#google_translate_element')) {
          const host = document.createElement('div');
          host.id = 'google_translate_element';
          document.body.appendChild(host);
        }
        const script = document.createElement('script');
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
        setTimeout(() => applyGoogleTranslate(langCode), 800);
      }
    } catch (e) {
      // fail silently
    }
  };

  const onLanguageChange = (e) => {
    const code = e.target.value;
    setLanguage(code);
    applyGoogleTranslate(code);
    setStatus(`Language set to ${LANGUAGES.find(l => l.code === code)?.label || code}`);
    setTimeout(() => setStatus(""), 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-6 ">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Settings</h2>

      {/* Profile */}
      <div className="bg-white border border-gray-200 rounded p-4 mb-6">
        <h3 className="text-base font-medium text-gray-900 mb-3">Account</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Display Name</label>
            <input
              type="text"
              value={localAdmin?.user_name || ""}
              onChange={(e) => setLocalAdmin({ ...localAdmin, user_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Phone (optional)</label>
            <input
              type="text"
              value={localAdmin?.phone || ""}
              onChange={(e) => setLocalAdmin({ ...localAdmin, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button
            type="button"
            onClick={onSaveProfile}
            className="px-4 py-2 bg-gray-900 hover:bg-gray-700 text-white font-medium rounded"
          >
            Save Profile
          </button>
          <button
            type="button"
            onClick={() => { dispatch(logout()); setLocalAdmin({}); setStatus("Signed out"); setTimeout(()=>setStatus(""), 2000); }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Language */}
      <div className="bg-white border border-gray-200 rounded p-4 mb-6">
        <h3 className="text-base font-medium text-gray-900 mb-3">Language</h3>
        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={onLanguageChange}
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select> 
        </div>
      </div>

      {/* Status */}
      {status && (
        <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
          {status}
        </div>
      )}
    </div>
  );
}

export default Settings;
