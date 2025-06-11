import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 pt-20">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-6">
        Welcome to proPAL AI
      </h1>
      <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mb-8 text-center">
        Your personal AI assistant to help with daily tasks and more.
      </p>
      <Link
        href="/signup"
        className="px-6 py-3 bg-[#5CE5BC] text-white rounded-lg hover:bg-[#92b9ae] transition-colors text-sm sm:text-base"
      >
        Get Started
      </Link>
    </div>
  );
}