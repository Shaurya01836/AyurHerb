import React from "react";

const AdminSidebar = ({ isOpen, toggle, active, setActive }) => {
  const menuItems = [
    { id: "stats", label: "Stats" },
    { id: "users", label: "Registered Users" },
    { id: "posts", label: "Community Posts" },
    { id: "add-herb", label: "Add New Herb" },
    { id: "manage-herbs", label: "Manage Herbs" },
  ];

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-green-800 text-white h-screen fixed transition-all duration-300 flex flex-col`}
    >
      <button
        onClick={toggle}
        className="p-4 focus:outline-none hover:bg-green-700"
        title={isOpen ? "Collapse" : "Expand"}
      >
        {isOpen ? "<" : ">"}
      </button>

      <nav className="flex flex-col space-y-4 mt-6">
        {menuItems.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`hover:bg-green-700 p-3 rounded text-left ${
              active === id ? "bg-green-600" : ""
            }`}
            title={label}
          >
            {isOpen ? label : label[0]}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
