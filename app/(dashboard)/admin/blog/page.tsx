"use client";
import {
  DashboardSidebar,
} from "@/components";
import React, { useState, useEffect } from "react";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  author: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  readTime: number | null;
}

const DashboardBlog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch('/api/blog');
      const data = await response.json();
      setBlogPosts(data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBlogPost = async (slug: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        await fetch(`/api/blog/${slug}`, { method: 'DELETE' });
        setBlogPosts(blogPosts.filter(post => post.slug !== slug));
      } catch (error) {
        console.error('Error deleting blog post:', error);
      }
    }
  };

  const togglePublish = async (slug: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/blog/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !currentStatus })
      });
      fetchBlogPosts(); // Refresh the list
    } catch (error) {
      console.error('Error updating blog post:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white flex justify-start max-w-screen-2xl mx-auto h-full max-xl:flex-col">
        <DashboardSidebar />
        <div className="flex-1 p-8">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto h-full max-xl:flex-col max-xl:h-fit max-xl:gap-y-4">
      <DashboardSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Blog Management</h1>
          <Link href="/admin/blog/new">
            <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
              Add New Post
            </button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Published Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Read Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blogPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{post.title}</div>
                    <div className="text-sm text-gray-500">/{post.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {post.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      post.isPublished 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {post.publishedAt 
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : '-'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {post.readTime ? `${post.readTime} min` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link href={`/admin/blog/${post.slug}`}>
                      <button className="text-blue-600 hover:text-blue-900">Edit</button>
                    </Link>
                    <button 
                      onClick={() => togglePublish(post.slug, post.isPublished)}
                      className="text-green-600 hover:text-green-900"
                    >
                      {post.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <button 
                      onClick={() => deleteBlogPost(post.slug)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {blogPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No blog posts found. Create your first blog post!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardBlog;