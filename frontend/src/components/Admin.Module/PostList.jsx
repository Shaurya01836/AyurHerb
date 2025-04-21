import React from "react";

const PostList = ({ posts, onDelete }) => {
  return (
    <section className="bg-white shadow p-6 rounded-lg">
      <h2 className="text-3xl mb-4">Community Posts</h2>
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts found.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            className="p-4 border rounded mb-4 bg-gray-50 shadow-sm"
          >
            <p className="text-gray-800">{post.content}</p>
            <button
              onClick={() => onDelete(post.id)}
              className="bg-red-600 text-white px-4 py-2 rounded mt-2 hover:bg-red-500 transition-colors"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </section>
  );
};

export default PostList;
