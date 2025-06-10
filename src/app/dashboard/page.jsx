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
      setUser(JSON.parse(storedUser));
    }

    const savedSettings = localStorage.getItem("sttSettings");
    if (savedSettings) {
      setSttSettings(JSON.parse(savedSettings));
    }
  }, [router]);

  if (!user) {
    return null;
  }

  const providerName = sttSettings
    ? sttData.stt.find((p) => p.value === sttSettings.provider)?.name || "Not configured"
    : null;
  const modelName = sttSettings
    ? sttData.stt
        .find((p) => p.value === sttSettings.provider)
        ?.models.find((m) => m.value === sttSettings.model)?.name || "Not configured"
    : null;
  const languageName = sttSettings
    ? sttData.stt
        .find((p) => p.value === sttSettings.provider)
        ?.models.find((m) => m.value === sttSettings.model)
        ?.languages.find((l) => l.value === sttSettings.language)?.name || "Not configured"
    : null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white">
            Welcome, {user.username}!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Here's an overview of your proPAL AI dashboard.
          </p>
        </div>

        {/* Mobile Navigation - Only visible on mobile */}
        <div className="lg:hidden mb-6 grid grid-cols-2 gap-4">
          <a href="/dashboard/agent" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-gray-800 dark:text-white">Agents</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage AI</p>
          </a>
          <a href="/dashboard/profile" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-gray-800 dark:text-white">Profile</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Your Info</p>
          </a>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0">
          {/* Sidebar - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:block lg:w-64">
            <Sidebar />
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {/* Content Cards */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  Summary Card
                </h2>
                <div className="space-y-2 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {user.phone || "Not provided"}
                  </p>
                  {sttSettings ? (
                    <>
                      <p>
                        <strong>STT Provider:</strong> {providerName}
                      </p>
                      <p>
                        <strong>STT Model:</strong> {modelName}
                      </p>
                      <p>
                        <strong>STT Language:</strong> {languageName}
                      </p>
                    </>
                  ) : (
                    <p>
                      Speech-to-Text (STT) settings are not configured.{" "}
                      <Link href="/dashboard/agent" className="text-blue-600 hover:underline">
                        Configure STT
                      </Link>
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  Dashboard Overview
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                  This is where you can view your key metrics, manage agents, and access your profile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}