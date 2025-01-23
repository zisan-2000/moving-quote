import { useState, useEffect } from "react";
import { postdata } from "@/app/(main)/data/postdata";
import Image from "next/image";
import Link from "next/link";

// Define the Blog interface
interface Blog {
  ID: string;
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

const BlogAll = () => {
  const [blogData, setBlogData] = useState<Blog[]>([]); // Updated here

  useEffect(() => {
    const processedData: Blog[] = postdata.map((blog) => ({
      ...blog,
      imageUrl: extractFirstImage(blog.post_content),
    }));
    setBlogData(processedData);
  }, []);

  return (
    <section className="py-16 bg-black text-white">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-white mb-10 text-center">
          All Blogs
        </h2>
        <p className="text-gray-300 mb-10 text-center">
          Explore how our innovative logistics solutions meet your business
          needs.
        </p>
        <div className="text-2xl p-2 text-white text-center">
          Total Blogs: {postdata.length}
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogData.map((blogs, index) => (
            <div
              key={index}
              className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <Image
                src={blogs.imageUrl ?? "https://via.placeholder.com/400x200"}
                alt={blogs.post_title}
                width={400}
                height={200}
                className="w-full h-36 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-bold text-yellow-400 mb-4">
                {blogs.post_title}
              </h3>
              <div
                className="text-white text-lg"
                dangerouslySetInnerHTML={{
                  __html: blogs.post_content.slice(0, 200) + "...",
                }}
              ></div>
              <button className="mt-5 bg-yellow-500 text-black px-4 py-2 rounded-full hover:bg-yellow-600 transition-colors">
                <Link href={`/blogs/${blogs.ID}`}>Read More</Link>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogAll;
