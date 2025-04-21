import React from "react";

const UserList = ({ users }) => {
  return (
    <section className="bg-white shadow p-6 rounded-lg">
      <h2 className="text-3xl mb-4">Registered Users</h2>
      {users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        users.map((user, index) => (
          <p key={index} className="border-b py-2 text-gray-700">
            {user.email || "Anonymous"}
          </p>
        ))
      )}
    </section>
  );
};

export default UserList;
