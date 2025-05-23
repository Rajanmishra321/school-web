import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

const ManageNotices = () => {
  const [notices, setNotices] = useState([]);
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    date: '',
    important: false,
    active: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editNotice, setEditNotice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  useEffect(() => {
    if (!isInitialized) {
      fetchNotices();
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const fetchNotices = async () => {
    try {
      setIsLoading(true);
      
      // Try to get from a single document
      const docRef = doc(db, "siteContent", "notices");
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists() && docSnap.data().noticesList) {
        // If notices are stored in a single document
        setNotices(docSnap.data().noticesList);
      } else {
        // Create initial notices document if it doesn't exist
        console.log("No notices found. Creating initial notices document.");
        await setDoc(docRef, {
          noticesList: []
        });
        setNotices([]);
      }
    } catch (error) {
      console.error("Error fetching notices: ", error);
      alert("Error loading notices. Please check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNotice = async () => {
    if (!newNotice.title.trim() || !newNotice.content.trim()) {
      alert("Title and content are required!");
      return;
    }

    try {
      setIsSaving(true);
      
      const currentDate = newNotice.date || new Date().toISOString().split('T')[0];
      const noticeToAdd = {
        ...newNotice,
        date: currentDate,
        createdAt: new Date().toISOString(),
        id: `notice_${Date.now()}`
      };

      const docRef = doc(db, "siteContent", "notices");
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        // Document exists, update it
        await updateDoc(docRef, {
          noticesList: arrayUnion(noticeToAdd)
        });
      } else {
        // Document doesn't exist, create it
        await setDoc(docRef, {
          noticesList: [noticeToAdd]
        });
      }

      setNotices([...notices, noticeToAdd]);
      setNewNotice({
        title: '',
        content: '',
        date: '',
        important: false,
        active: true
      });
      setShowAddForm(false);
      
      alert("Notice added successfully!");
    } catch (error) {
      console.error("Error adding notice: ", error);
      alert("Error adding notice. Please check console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNotice = async (noticeToDelete) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) {
      return;
    }
    
    try {
      setIsSaving(true);
      
      const docRef = doc(db, "siteContent", "notices");
      await updateDoc(docRef, {
        noticesList: arrayRemove(noticeToDelete)
      });
      
      setNotices(notices.filter(notice => notice.id !== noticeToDelete.id));
      alert("Notice deleted successfully!");
    } catch (error) {
      console.error("Error deleting notice: ", error);
      alert("Error deleting notice. Please check console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditNotice({...notices[index]});
  };

  const handleEditSave = async () => {
    if (!editNotice.title.trim() || !editNotice.content.trim()) {
      alert("Title and content are required!");
      return;
    }

    try {
      setIsSaving(true);
      
      // Create an updated array by replacing the edited item
      const updatedNotices = [...notices];
      updatedNotices[editIndex] = editNotice;
      
      // Set the entire updated array to Firebase
      const docRef = doc(db, "siteContent", "notices");
      await setDoc(docRef, {
        noticesList: updatedNotices
      });
      
      setNotices(updatedNotices);
      setEditIndex(null);
      setEditNotice(null);
      
      alert("Notice updated successfully!");
    } catch (error) {
      console.error("Error updating notice: ", error);
      alert("Error updating notice. Please check console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleNoticeStatus = async (index) => {
    try {
      setIsSaving(true);
      
      const updatedNotices = [...notices];
      updatedNotices[index] = {
        ...updatedNotices[index],
        active: !updatedNotices[index].active
      };
      
      const docRef = doc(db, "siteContent", "notices");
      await setDoc(docRef, {
        noticesList: updatedNotices
      });
      
      setNotices(updatedNotices);
    } catch (error) {
      console.error("Error toggling notice status: ", error);
      alert("Error updating notice status. Please check console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleImportant = async (index) => {
    try {
      setIsSaving(true);
      
      const updatedNotices = [...notices];
      updatedNotices[index] = {
        ...updatedNotices[index],
        important: !updatedNotices[index].important
      };
      
      const docRef = doc(db, "siteContent", "notices");
      await setDoc(docRef, {
        noticesList: updatedNotices
      });
      
      setNotices(updatedNotices);
    } catch (error) {
      console.error("Error toggling importance: ", error);
      alert("Error updating notice importance. Please check console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredNotices = notices.filter(notice => 
    notice.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    notice.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-yellow-400 max-w-full">
      {/* Header - Mobile Optimized */}
      <div className="bg-blue-900 text-white py-4 px-4 sm:px-6">
        <h1 className="text-xl sm:text-2xl font-bold">Notice Management Portal</h1>
        <p className="text-blue-100 text-xs sm:text-sm mt-1">Create, update, and organize announcements</p>
      </div>
      
      <div className="p-4 sm:p-6">
        {/* Mobile Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center transition-all shadow-md hover:shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {showAddForm ? 'Hide Form' : 'Add New Notice'}
          </button>
          
          {/* Search Bar - Mobile Responsive */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search notices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-blue-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent bg-blue-50 text-sm"
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 absolute left-3 top-3 text-blue-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Add New Notice Section - Collapsible on Mobile */}
        {showAddForm && (
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-blue-900 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-lg sm:text-xl font-semibold text-blue-900">Add New Notice</h2>
            </div>
            
            <div className="bg-blue-50 p-4 sm:p-5 rounded-lg border border-blue-200 shadow-sm">
              <div className="space-y-4">
                {/* Title Input */}
                <div>
                  <label className="block text-blue-900 text-sm font-medium mb-1">Title*</label>
                  <input
                    type="text"
                    placeholder="Notice title"
                    value={newNotice.title}
                    onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
                    className="w-full border border-blue-200 rounded-lg px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
                
                {/* Date Input */}
                <div>
                  <label className="block text-blue-900 text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={newNotice.date}
                    onChange={(e) => setNewNotice({...newNotice, date: e.target.value})}
                    className="w-full border border-blue-200 rounded-lg px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
                
                {/* Content Textarea */}
                <div>
                  <label className="block text-blue-900 text-sm font-medium mb-1">Content*</label>
                  <textarea
                    placeholder="Notice content"
                    value={newNotice.content}
                    onChange={(e) => setNewNotice({...newNotice, content: e.target.value})}
                    className="w-full border border-blue-200 rounded-lg px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-sm sm:text-base"
                    rows="3"
                  />
                </div>
                
                {/* Checkboxes - Mobile Responsive */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newNotice.important}
                      onChange={(e) => setNewNotice({...newNotice, important: e.target.checked})}
                      className="rounded border-blue-300 text-red-600 focus:ring-red-500 h-4 w-4"
                    />
                    <span className="ml-2 text-blue-900 text-sm sm:text-base">Mark as Important</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newNotice.active}
                      onChange={(e) => setNewNotice({...newNotice, active: e.target.checked})}
                      className="rounded border-blue-300 text-blue-900 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="ml-2 text-blue-900 text-sm sm:text-base">Active</span>
                  </label>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="mt-6">
                <button
                  onClick={handleAddNotice}
                  disabled={isSaving || !newNotice.title || !newNotice.content}
                  className={`w-full sm:w-auto px-6 py-2 rounded-lg font-medium text-sm sm:text-base ${
                    isSaving || !newNotice.title || !newNotice.content
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all'
                  }`}
                >
                  {isSaving ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Notice
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Manage Notices Section */}
        <div className="mb-6">
          <div className="flex items-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-blue-900 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h2 className="text-lg sm:text-xl font-semibold text-blue-900">
              Manage Notices ({filteredNotices.length})
            </h2>
          </div>

          {filteredNotices.length > 0 ? (
            <div className="space-y-4">
              {filteredNotices.map((notice, index) => (
                <div 
                  key={notice.id || index} 
                  className={`border rounded-lg overflow-hidden shadow-md transition hover:shadow-lg ${
                    !notice.active ? 'opacity-60' : ''
                  } ${notice.important ? 'border-l-4 border-red-600' : 'border-l-4 border-yellow-400'}`}
                >
                  {editIndex === index ? (
                    /* Edit Mode - Mobile Responsive */
                    <div className="p-4">
                      <div className="border-b border-blue-100 pb-3 mb-4">
                        <h3 className="font-semibold text-blue-900 text-sm sm:text-base">Edit Notice</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-blue-900 text-sm font-medium mb-1">Title*</label>
                          <input
                            type="text"
                            value={editNotice.title}
                            onChange={(e) => setEditNotice({...editNotice, title: e.target.value})}
                            className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900 bg-blue-50 text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-blue-900 text-sm font-medium mb-1">Date</label>
                          <input
                            type="date"
                            value={editNotice.date}
                            onChange={(e) => setEditNotice({...editNotice, date: e.target.value})}
                            className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900 bg-blue-50 text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-blue-900 text-sm font-medium mb-1">Content*</label>
                          <textarea
                            value={editNotice.content}
                            onChange={(e) => setEditNotice({...editNotice, content: e.target.value})}
                            className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900 bg-blue-50 text-sm"
                            rows="3"
                          />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={editNotice.important}
                              onChange={(e) => setEditNotice({...editNotice, important: e.target.checked})}
                              className="rounded border-blue-300 text-red-600 focus:ring-red-500 h-4 w-4"
                            />
                            <span className="ml-2 text-blue-900 text-sm">Mark as Important</span>
                          </label>
                          
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={editNotice.active}
                              onChange={(e) => setEditNotice({...editNotice, active: e.target.checked})}
                              className="rounded border-blue-300 text-blue-900 focus:ring-blue-500 h-4 w-4"
                            />
                            <span className="ml-2 text-blue-900 text-sm">Active</span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2 mt-4">
                        <button
                          onClick={handleEditSave}
                          disabled={isSaving}
                          className={`flex-1 sm:flex-none px-4 py-2 rounded font-medium text-sm ${
                            isSaving ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-800 text-white shadow-md hover:shadow-lg transition-all'
                          }`}
                        >
                          {isSaving ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Saving...
                            </span>
                          ) : (
                            <span className="flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Save Changes
                            </span>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setEditIndex(null);
                            setEditNotice(null);
                          }}
                          className="flex-1 sm:flex-none bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded font-medium text-sm shadow-md hover:shadow-lg transition-all"
                        >
                          <span className="flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel
                          </span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* View Mode - Mobile Responsive */
                    <div className="p-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                        <div className="flex-1 mb-3 sm:mb-0">
                          <h3 className="font-semibold text-base sm:text-lg text-blue-900 flex flex-wrap items-center gap-2">
                            {notice.important && (
                              <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded font-bold">
                                IMPORTANT
                              </span>
                            )}
                            <span className="break-words">{notice.title}</span>
                          </h3>
                          <p className="text-blue-500 text-xs sm:text-sm mt-1">
                            {notice.date ? new Date(notice.date).toLocaleDateString() : 'No date set'}
                          </p>
                        </div>
                        
                        {/* Action Buttons - Mobile Optimized */}
                        <div className="flex gap-1 sm:gap-2 flex-wrap">
                          <button
                            onClick={() => toggleImportant(index)}
                            className={`p-1.5 rounded-full transition-all ${
                              notice.important ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            title={notice.important ? "Remove important flag" : "Mark as important"}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => toggleNoticeStatus(index)}
                            className={`p-1.5 rounded-full transition-all ${
                              notice.active ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            title={notice.active ? "Deactivate notice" : "Activate notice"}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-3 sm:p-4 rounded-lg mb-3 border-l-2 border-blue-200 shadow-sm">
                        <p className="text-blue-900 whitespace-pre-wrap text-sm sm:text-base break-words">{notice.content}</p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div className="flex items-center text-blue-500 text-xs sm:text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                          <span className="break-all">ID: {notice.id}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(index)}
                            className="flex-1 sm:flex-none bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-1 rounded text-xs sm:text-sm font-medium flex items-center justify-center transition-all shadow-sm hover:shadow"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteNotice(notice)}
                            className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm font-medium flex items-center transition-all shadow-sm hover:shadow"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-blue-50 rounded-lg border border-dashed border-blue-300 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-blue-900 font-medium text-lg">No Notices Found</h3>
              <p className="mt-1 text-blue-500">
                {searchTerm ? "No notices match your search criteria" : "Add your first notice using the form above"}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-blue-100 py-3 px-6 text-center text-blue-900 text-sm border-t border-blue-200">
        <p>Manage all your organization's notices from one central dashboard</p>
      </div>
    </div>
  );
};

export default ManageNotices;