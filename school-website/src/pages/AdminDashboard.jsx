import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebaseConfig";
import EditHomeContent from "@/components/admin/EditHomeContent";
import { useState } from "react";
import logo from '../assets/logo.jpg';
import ManageNotices from "@/components/admin/ManageNotices";
import ManageGallery from "@/components/admin/ManageGallery";
import EditContactInfo from "@/components/admin/EditContactInfo";

const AdminDashboard = () => {
  const [user, loading] = useAuthState(auth);
  const [activeEditor, setActiveEditor] = useState(null);

  // List of all available editors/modules
  const adminModules = [
    { id: 'home', title: 'Edit Home Content', component: EditHomeContent },
    { id: 'notices', title: 'Manage Notices', component: ManageNotices },
    { id: 'events', title: 'Manage contacts', component: EditContactInfo},
    { id: 'gallery', title: 'Manage Gallery', component: ManageGallery },
  ];

  const toggleEditor = (editorId) => {
    if (activeEditor === editorId) {
      setActiveEditor(null);
    } else {
      setActiveEditor(editorId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.email !== "das@gmail.com") {
    if(user.password !== "Das10+2@"){
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h1>
            <p className="text-gray-600">You are not authorized to access this dashboard.</p>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Left side - School logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-white p-1 rounded-full shadow">
                <img
                  src={logo}
                  alt="School Logo"
                  className="h-12 w-12 rounded-full object-contain"
                />
              </div>
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            </div>

            {/* Right side - Close button (only visible when editor is active) */}
            {activeEditor && (
              <button
                onClick={() => setActiveEditor(null)}
                className="bg-white text-red-600 px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-gray-100 transition flex items-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span>Close Editor</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        {/* Main Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar Navigation - Always visible */}
          <div className="md:col-span-3 lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h2 className="font-medium text-gray-700">Admin Controls</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {adminModules.map((module) => (
                  <button
                    key={module.id}
                    onClick={() => toggleEditor(module.id)}
                    className={`w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-gray-50 transition ${
                      activeEditor === module.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${activeEditor === module.id ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                    <span>{module.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="md:col-span-9 lg:col-span-10">
            {activeEditor ? (
              <div className="transition-all duration-300 ease-in-out">
                <div className="bg-white rounded-lg shadow">
                  <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="font-medium text-gray-700">
                      {adminModules.find(m => m.id === activeEditor)?.title}
                    </h2>
                    <button
                      onClick={() => setActiveEditor(null)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <div>
                    {(() => {
                      const EditorComponent = adminModules.find(m => m.id === activeEditor)?.component;
                      return EditorComponent ? <EditorComponent /> : null;
                    })()}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center py-12">
                  <div className="bg-gray-50 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-medium text-gray-700 mb-2">Welcome to Admin Dashboard</h2>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Select an option from the sidebar to manage different aspects of your website.
                  </p>
                </div>

                {/* Quick Access Cards for Mobile */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 sm:hidden">
                  {adminModules.slice(0, 6).map((module) => (
                    <button
                      key={module.id}
                      onClick={() => toggleEditor(module.id)}
                      className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg text-center transition"
                    >
                      <div className="text-blue-600 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{module.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;