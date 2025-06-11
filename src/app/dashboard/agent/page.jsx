"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import sttData from "../../../../public/stt.json";
import Sidebar from "@/components/Sidebar";

export default function Agent() {
  const [user, setUser] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [availableModels, setAvailableModels] = useState([]);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      const savedSettings = localStorage.getItem(`sttSettings_${parsedUser.username}`);
      if (savedSettings) {
        const { provider, model, language } = JSON.parse(savedSettings);
        setSelectedProvider(provider || "");
        setSelectedModel(model || "");
        setSelectedLanguage(language || "");
      }
    }
  }, [router]);

  useEffect(() => {
    if (selectedProvider) {
      const providerData = sttData.stt.find((p) => p.value === selectedProvider);
      setAvailableModels(providerData ? providerData.models : []);
      setSelectedModel("");
      setSelectedLanguage("");
      setAvailableLanguages([]);
    }
  }, [selectedProvider]);

  useEffect(() => {
    if (selectedModel) {
      const providerData = sttData.stt.find((p) => p.value === selectedProvider);
      const modelData = providerData?.models.find((m) => m.value === selectedModel);
      setAvailableLanguages(modelData ? modelData.languages : []);
      setSelectedLanguage("");
    }
  }, [selectedModel]);

  const handleSave = () => {
    if (!selectedProvider || !selectedModel || !selectedLanguage) {
      toast.error("Please select a provider, model, and language.");
      return;
    }

    const settings = {
      provider: selectedProvider,
      model: selectedModel,
      language: selectedLanguage,
    };
    localStorage.setItem(`sttSettings_${user.username}`, JSON.stringify(settings));
    toast.success("STT settings saved successfully!");
  };

  if (!user) {
    return null;
  }

  const providerName = sttData.stt.find((p) => p.value === selectedProvider)?.name || "";
  const modelName = availableModels.find((m) => m.value === selectedModel)?.name || "";
  const languageName = availableLanguages.find((l) => l.value === selectedLanguage)?.name || "";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            Agent
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Configure your speech-to-text settings for the agent.
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          <div className="lg:w-64">
            <Sidebar />
          </div>
          <div className="flex-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Configure STT
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Provider
                  </label>
                  <select
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  >
                    <option value="">Select a provider</option>
                    {sttData.stt.map((provider) => (
                      <option key={provider.value} value={provider.value}>
                        {provider.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedProvider && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Model
                    </label>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    >
                      <option value="">Select a model</option>
                      {availableModels.map((model) => (
                        <option key={model.value} value={model.value}>
                          {model.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedModel && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Language
                    </label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    >
                      <option value="">Select a language</option>
                      {availableLanguages.map((language) => (
                        <option key={language.value} value={language.value}>
                          {language.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  onClick={handleSave}
                  className="w-full p-3 bg-[#5CE5BC] text-white rounded-lg hover:bg-[#9df4da] transition-colors text-sm sm:text-base"
                >
                  Save Settings
                </button>
              </div>
            </div>

            {selectedProvider && selectedModel && selectedLanguage && (
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  STT Summary
                </h2>
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                    <strong>Provider:</strong> {providerName} ({selectedProvider})
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                    <strong>Model:</strong> {modelName} ({selectedModel})
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                    <strong>Language:</strong> {languageName} ({selectedLanguage})
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}