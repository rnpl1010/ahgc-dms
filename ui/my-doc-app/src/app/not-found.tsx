import Link from "next/link";

export const metadata = {
  title: "404 - Page Not Found",
};

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-4">
      <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold mb-4 text-center">
        404
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl mb-8 text-center max-w-lg">
        Oops! The page you’re looking for does not exist.
      </p>
      <Link
        href="/home"
        className="px-6 py-3 sm:px-8 sm:py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
      >
        Go to Home
      </Link>
    </div>
  );
}
