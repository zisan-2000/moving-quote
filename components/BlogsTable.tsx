"use client";
import { postdata } from "@/app/(main)/data/postdata";
import React, { useState } from "react";
import Link from "next/link";
import RichTextEditor from "./RichTextEditor";

// Define TypeScript interface for blog posts
interface BlogPost {
  ID: number;
  post_title: string;
  post_content: string;
  post_status: string;
  comment_status: string;
}

const AllBlogs: React.FC = () => {
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<BlogPost>({
    ID: 0,
    post_title: "",
    post_content: "",
    post_status: "Draft",
    comment_status: "Open",
  });

  const [posts, setPosts] = useState<BlogPost[]>(postdata);
  const [newPost, setNewPost] = useState<Omit<BlogPost, "ID">>({
    post_title: "",
    post_content: "",
    post_status: "Draft",
    comment_status: "Open",
  });

  const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal visibility
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const handleEdit = (blog: BlogPost) => {
    setSelectedBlog(blog);
    setFormData({
      ID: blog.ID,
      post_title: blog.post_title,
      post_content: blog.post_content,
      post_status: blog.post_status,
      comment_status: blog.comment_status,
    });
  };

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog post?"
    );
    if (confirmDelete) {
      setPosts(posts.filter((blog) => blog.ID !== id));
      alert("Blog post deleted successfully!");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here, such as updating the post
    console.log("Updated Blog:", formData);
    // Reset form
    setSelectedBlog(null);
  };

  const handleNewPostChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewPost((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAddNewPost = (e: React.FormEvent) => {
    e.preventDefault();
    const newPostData: BlogPost = {
      ...newPost,
      ID: posts.length + 1,
    };
    setPosts([...posts, newPostData]);
    setNewPost({
      post_title: "",
      post_content: "",
      post_status: "Draft",
      comment_status: "Open",
    });
    setIsModalOpen(false);
    alert("New post added successfully!");
  };

  const filteredPosts = posts.filter((post) =>
    post.post_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">
        Blog Management: {filteredPosts.length}
      </h1>

      {/* Aligning Add New Post Button to the Left */}
      <div className="flex justify-end mb-6">
        <div>
          <input
            type="text"
            placeholder="Search blogs by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-auto mt-8 p-2 mr-4 border rounded"
          />
        </div>
        <div className="mt-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Add New Post
          </button>
        </div>
      </div>

      {/* Table of Existing Posts */}
      <div className="scrollbar max-h-[350px] overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-sm font-medium text-gray-700 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-700 uppercase">
                Title
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-700 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-700 uppercase">
                Comments
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-700 uppercase text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((blog, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } border-b`}
              >
                <td className="px-6 py-4 text-gray-700">{blog.ID}</td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  <Link href={`/blogs/${blog.ID}`}>{blog.post_title}</Link>
                </td>
                <td className="px-6 py-4 text-gray-700">{blog.post_status}</td>
                <td className="px-6 py-4 text-gray-700">
                  {blog.comment_status}
                </td>
                <td className="flex px-6 py-4 text-right">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="bg-blue-500 text-white font-medium text-sm py-2 px-4 rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105 shadow-sm"
                    title="Edit Blog"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog.ID)}
                    className="bg-red-500 text-white font-medium text-sm py-2 px-4 rounded-lg hover:bg-red-600 transition-transform transform hover:scale-105 shadow-sm ml-2"
                    title="Delete Blog"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Adding New Post */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white p-6 rounded-lg shadow-md w-2/3"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium mb-4">Add New Blog Post</h3>
            <form onSubmit={handleAddNewPost}>
              <div className="mb-4">
                <label htmlFor="post_title" className="block">
                  Post Title
                </label>
                <input
                  type="text"
                  id="post_title"
                  name="post_title"
                  value={newPost.post_title}
                  onChange={handleNewPostChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="post_content" className="block">
                  Post Content
                </label>
                <RichTextEditor
                  value={newPost.post_content}
                  onChange={(content) => {
                    setNewPost((prev) => ({
                      ...prev,
                      post_content: content,
                    }));
                  }}
                />
              </div>
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 font-medium px-4 py-2 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Add Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Conditional rendering of the edit form */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white p-6 rounded-lg shadow-md w-2/3" // Changed width to match add post modal
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium mb-4">Edit Blog</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="post_title" className="block">
                  Post Title
                </label>
                <input
                  type="text"
                  id="post_title"
                  name="post_title"
                  value={formData.post_title}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="post_content" className="block">
                  Post Content
                </label>
                <RichTextEditor
                  value={formData.post_content}
                  onChange={(content) => {
                    setFormData((prev) => ({
                      ...prev,
                      post_content: content,
                    }));
                  }}
                />
              </div>
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setSelectedBlog(null)}
                  className="text-gray-500 font-medium px-4 py-2 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBlogs;
