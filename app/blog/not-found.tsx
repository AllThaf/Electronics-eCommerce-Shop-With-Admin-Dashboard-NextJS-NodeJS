import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900">
          Blog Post Not Found
        </h2>
        <p className="mb-8 text-lg text-gray-600">
          We couldn't find the blog post you're looking for. It may have been removed or doesn't exist.
        </p>
        <Link
          href="/blog"
          className="inline-block px-6 py-3 text-base font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Return to Blog
        </Link>
      </div>
    </div>
  );
}