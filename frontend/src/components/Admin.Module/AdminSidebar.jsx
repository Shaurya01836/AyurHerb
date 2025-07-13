import React from "react";
import {
  BarChart3,
  Users,
  FileText,
  Plus,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const AdminSidebar = ({ isOpen, toggle, active, setActive }) => {
  const menuItems = [
    {
      id: "stats",
      label: "Dashboard",
      icon: BarChart3,
      description: "Overview & Analytics",
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      description: "User Management",
    },
    {
      id: "posts",
      label: "Posts",
      icon: FileText,
      description: "Community Posts",
    },
    {
      id: "add-herb",
      label: "Add Herb",
      icon: Plus,
      description: "Add New Herb",
    },
    {
      id: "manage-herbs",
      label: "Manage Herbs",
      icon: Settings,
      description: "Herb Management",
    },
  ];

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-gradient-to-b from-green-800 to-green-900 text-white h-screen fixed top-0 left-0 transition-all duration-300 flex flex-col shadow-2xl z-20 mt-[74px]`}
    >
      {/* Header */}
      <div className="p-4 border-b border-green-700">
        <div className="flex items-center justify-between">
          {isOpen && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Settings className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg">Admin</span>
            </div>
          )}
          <button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
            title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {isOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map(({ id, label, icon: Icon, description }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`w-full p-3 rounded-xl text-left transition-all duration-200 group ${
              active === id
                ? "bg-white/20 text-white shadow-lg"
                : "text-green-100 hover:bg-white/10 hover:text-white"
            }`}
            title={isOpen ? description : label}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  active === id
                    ? "bg-white/20"
                    : "bg-white/10 group-hover:bg-white/20"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              {isOpen && (
                <div className="flex-1">
                  <div className="font-medium">{label}</div>
                  <div className="text-xs text-green-200 opacity-75">
                    {description}
                  </div>
                </div>
              )}
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
