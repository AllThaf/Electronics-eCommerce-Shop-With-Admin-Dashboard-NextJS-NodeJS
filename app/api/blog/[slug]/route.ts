import { NextResponse } from "next/server";
import prisma from "@/utils/db";
import { handleApiError } from "@/utils/errorHandler";

export const GET = async (
  request: Request,
  { params }: { params: { slug: string } }
) => {
  try {
    // Await the params
    const slug = await params.slug;
    const isAdminRoute = request.url.includes('/admin/');

    const post = await prisma.blogPost.findFirst({
      where: {
        slug: slug,
        ...(!isAdminRoute ? { isPublished: true } : {}) // Only filter published posts for public routes
      }
    });

    if (!post) {
      return new NextResponse("Post not found", { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return handleApiError(error);
  }
}

// Handle PUT/PATCH requests (for admin updates)
export const PUT = async (
  request: Request,
  { params }: { params: { slug: string } }
) => {
  try {
    const slug = await params.slug;
    const body = await request.json();

    // Find the existing post first
    const existingPost = await prisma.blogPost.findFirst({
      where: { slug: slug }
    });

    if (!existingPost) {
      return new NextResponse("Post not found", { status: 404 });
    }

    // If updating slug, check for duplicates
    if (body.slug && body.slug !== slug) {
      const slugExists = await prisma.blogPost.findFirst({
        where: {
          slug: body.slug,
          NOT: {
            id: existingPost.id
          }
        }
      });

      if (slugExists) {
        return new NextResponse(
          "A post with this slug already exists",
          { status: 400 }
        );
      }
    }

    const updatedPost = await prisma.blogPost.update({
      where: { id: existingPost.id },
      data: body
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    return handleApiError(error);
  }
};

// Handle DELETE requests (for admin deletion)
export const DELETE = async (
  request: Request,
  { params }: { params: { slug: string } }
) => {
  try {
    const slug = await params.slug;

    // Find the post first
    const post = await prisma.blogPost.findFirst({
      where: { slug }
    });

    if (!post) {
      return new NextResponse("Post not found", { status: 404 });
    }

    // Delete by ID for accuracy
    await prisma.blogPost.delete({
      where: { id: post.id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
};