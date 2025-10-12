"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional().nullable(),
  slug: z.string().min(1, "Slug is required"),
  featuredImage: z.string().optional().nullable(),
  author: z.string().min(1, "Author is required"),
  tags: z.string().optional().nullable(),
  isPublished: z.boolean().optional(),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

export default function AdminBlogPostPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const id = params.slug;
        if (id === "new") {
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/blog/${id}`);
        if (!response.ok) throw new Error("Failed to fetch post");
        
        const data = await response.json();
        reset(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load blog post");
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.slug, reset]);

  const onSubmit = async (data: BlogPostFormData) => {
    try {
      const id = params.slug;
      const url = id === "new" ? "/api/blog" : `/api/blog/${id}`;
      const method = id === "new" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save post");
      }

      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      setError("Failed to save blog post");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6">
      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded">
          {error}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6">
        {params.slug === "new" ? "Create New Blog Post" : "Edit Blog Post"}
      </h1>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            {...register("title")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Slug</label>
          <input
            type="text"
            {...register("slug")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          {errors.slug && (
            <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            {...register("content")}
            rows={10}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Excerpt</label>
          <textarea
            {...register("excerpt")}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          {errors.excerpt && (
            <p className="mt-1 text-sm text-red-600">{errors.excerpt.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Featured Image URL</label>
          <input
            type="text"
            {...register("featuredImage")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Author</label>
          <input
            type="text"
            {...register("author")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          {errors.author && (
            <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
          <input
            type="text"
            {...register("tags")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register("isPublished")}
            className="h-4 w-4 rounded border-gray-300"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Publish this post
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            {params.slug === "new" ? "Create Post" : "Update Post"}
          </button>
        </div>
      </div>
    </form>
  );
}