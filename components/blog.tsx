"use client";
import { useEffect, useState } from "react";
import { postdata } from "@/app/(main)/data/postdata";
import Link from "next/link";
import Image from "next/image";

// Define TypeScript Interface for Blog
interface Blog {
  ID: number;
  post_title: string;
  post_content: string;
  imageUrl?: string;
}

// Function to extract the first image's src from the post_content
const extractFirstImage = (htmlContent: string): string => {
  const placeholderImage = "https://via.placeholder.com/400x200";
  if (typeof window !== "undefined") {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const imgElement = doc.querySelector("img");
    return imgElement
      ? imgElement.getAttribute("src") ?? placeholderImage
      : placeholderImage;
  }
  return placeholderImage;
};

const BlogSection = () => {
  const [blogCards, setBlogCards] = useState<Blog[]>([]); // ✅ Replaced `any[]` with `Blog[]`

  useEffect(() => {
    // Process postdata client-side to extract images
    const processedData: Blog[] = postdata.slice(1, 4).map((blog) => ({
      ...blog,
      imageUrl: extractFirstImage(blog.post_content),
    }));
    setBlogCards(processedData);
  }, []);

  return (
    <section className="py-16 bg-black text-white">
      <h2 className="text-4xl font-bold text-center mb-12">Blogs</h2>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {blogCards.map((blog, index) => (
          <div
            key={index}
            className="border border-gray-700 bg-gray-900 p-6 text-center shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300"
          >
            {/* ✅ Replaced <img> with Next.js <Image /> */}
            <Image
              src={blog.imageUrl ?? "https://via.placeholder.com/400x200"}
              alt={blog.post_title}
              width={400}
              height={200}
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-bold text-yellow-400 mb-4">
              {blog.post_title}
            </h3>
            <div
              className="text-white text-lg leading-7"
              dangerouslySetInnerHTML={{
                __html: blog.post_content.slice(0, 300) + "...",
              }}
            ></div>
            <button className="mt-5 bg-yellow-500 text-black px-4 py-2 rounded-full hover:bg-yellow-600 transition-colors">
              <Link href={`/blogs/${blog.ID}`}>Read More</Link>
            </button>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Link
          href="/allBlogs"
          className="px-4 py-2 bg-yellow-400 text-black shadow-md hover:bg-yellow-500 transition"
        >
          VIEW MORE
        </Link>
      </div>
    </section>
  );
};

export default BlogSection;
