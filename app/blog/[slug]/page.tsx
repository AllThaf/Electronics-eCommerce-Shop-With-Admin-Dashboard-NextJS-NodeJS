import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components";
import { notFound } from "next/navigation";
import { formatBlogContent } from "@/utils/formatBlogContent";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featuredImage: string | null;
  author: string;
  publishedAt: string | null;
  readTime: number | null;
  tags: string | null;
  isPublished: boolean;
}

async function getBlogPost(slug: string): Promise<BlogPost> {
  // Get the base URL from the environment or use a default for development
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const response = await fetch(
    `${baseUrl}/api/blog/${slug}`,
    { 
      next: { revalidate: 60 },
      headers: {
        'Accept': 'application/json'
      }
    }
  );

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error('Failed to fetch blog post');
  }

  return response.json();
}

const BlogPostPage = async ({ params }: { params: { slug: string } }) => {
  // Await the params
  const slug = await params.slug;
  
  // Validate params before using
  if (!slug) {
    notFound();
  }
  
  const post = await getBlogPost(slug);

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Blog", link: "/blog" },
            { label: post.title, link: `/blog/${post.slug}` },
          ]}
        />

        <article className="max-w-4xl mx-auto">
          {post.featuredImage && (
            <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="space-y-4 mb-8">
            <h1 className="text-4xl font-bold text-gray-900">{post.title}</h1>
            
            <div className="flex items-center text-gray-600 space-x-4">
              <span>By {post.author}</span>
              <span>•</span>
              {post.publishedAt && (
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              )}
              {post.readTime && (
                <>
                  <span>•</span>
                  <span>{post.readTime} min read</span>
                </>
              )}
            </div>

            {post.tags && (
              <div className="flex flex-wrap gap-2">
                {post.tags.split(",").map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div 
            className="prose prose-lg max-w-none [&>p]:mb-6 whitespace-pre-line"
            dangerouslySetInnerHTML={{ 
              __html: formatBlogContent(post.content)
            }}
          />

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
              Back to Blog
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
};

export default BlogPostPage;