"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import sttData from "../../../public/stt.json";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [sttSettings, setSttSettings] = useState(null);
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
        setSttSettings(JSON.parse(savedSettings));
      }
    }
  }, [router]);

  if (!user) {
    return null;
  }

  const providerName = sttSettings
    ? sttData.stt.find((p) => p.value === sttSettings.provider)?.name || "Not configured"
    : "Not configured";
  const modelName = sttSettings
    ? sttData.stt
        .find((p) => p.value === sttSettings.provider)
        ?.models.find((m) => m.value === sttSettings.model)?.name || "Not configured"
    : "Not configured";
  const languageName = sttSettings
    ? sttData.stt
        .find((p) => p.value === sttSettings.provider)
        ?.models.find((m) => m.value === sttSettings.model)
        ?.languages.find((l) => l.value === sttSettings.language)?.name || "Not configured"
    : "Not configured";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-18 pb-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white">
            Welcome, {user.username}!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Here's an overview of your proPAL AI dashboard.
          </p>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0">
          {/* Sidebar */}
          <div className="lg:w-64">
            <Sidebar />
          </div>

          {/* Dashboard Content */}
          <div className="flex-1 space-y-6">
            {/* Summary Card */}
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">
                User Summary
              </h2>
              <div className="space-y-2 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone || "Not provided"}</p>
                <p><strong>STT Provider:</strong> {providerName}</p>
                <p><strong>STT Model:</strong> {modelName}</p>
                <p><strong>STT Language:</strong> {languageName}</p>
                {!sttSettings && (
                  <p>
                    STT settings not configured.{" "}
                    <Link href="/dashboard/agent" className="text-[#5CE5BC] hover:underline">
                      Configure Now
                    </Link>
                  </p>
                )}
              </div>
            </div>

            {/* Dashboard Overview */}
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Dashboard Overview
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                Here you can manage agents, update your profile, and configure AI preferences.
              </p>
            </div>

            {/* Shortcut Cards (Desktop Only) */}
            <div className="hidden lg:grid grid-cols-2 gap-6">
              <Link
                href="/dashboard/agent"
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold text-gray-800 dark:text-white">Manage Agents</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Adjust AI models & languages
                </p>
              </Link>
              <Link
                href="/dashboard/profile"
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold text-gray-800 dark:text-white">Update Profile</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Change email, password, phone
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}