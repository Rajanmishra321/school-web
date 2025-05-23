import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebase/firebaseConfig';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const EditHomeContent = () => {
  const [content, setContent] = useState({
    welcome: '',
    mission: '',
    vision: '',
    history: '',
    facilities: [],
  });

  const [newFacility, setNewFacility] = useState({
    name: '',
    description: '',
    imageUrl: '',
  });

  const [selectedFile, setSelectedFile] = useState(null); // for new facility image
  const [selectedEditFile, setSelectedEditFile] = useState(null); // for edit facility image
  const [editIndex, setEditIndex] = useState(null); // to track which facility is being edited
  const [editFacility, setEditFacility] = useState({
    name: '',
    description: '',
    imageUrl: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const docRef = doc(db, 'siteContent', 'home');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContent(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent((prevContent) => ({
      ...prevContent,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const docRef = doc(db, 'siteContent', 'home');
      await setDoc(docRef, content);
      alert('Home content updated successfully!');
    } catch (error) {
      alert('Error saving content: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddFacility = async () => {
    try {
      setIsSaving(true);
      let imageUrl = newFacility.imageUrl;

      if (selectedFile) {
        const storageRef = ref(storage, `facilityImages/${Date.now()}_${selectedFile.name}`);
        await uploadBytes(storageRef, selectedFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const newFacilityData = {
        ...newFacility,
        imageUrl: imageUrl || '',
      };

      const docRef = doc(db, 'siteContent', 'home');
      const updatedFacilities = [...(content.facilities || []), newFacilityData];

      await updateDoc(docRef, {
        facilities: updatedFacilities,
      });

      setContent((prevContent) => ({
        ...prevContent,
        facilities: updatedFacilities,
      }));

      setNewFacility({ name: '', description: '', imageUrl: '' });
      setSelectedFile(null);
      alert('Facility added successfully!');
    } catch (error) {
      alert('Error adding facility: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteFacility = async (index) => {
    if (!window.confirm('Are you sure you want to delete this facility?')) return;

    try {
      setIsSaving(true);
      const updatedFacilities = content.facilities.filter((_, i) => i !== index);
      const docRef = doc(db, 'siteContent', 'home');
      await updateDoc(docRef, { facilities: updatedFacilities });

      setContent((prevContent) => ({
        ...prevContent,
        facilities: updatedFacilities,
      }));
      alert('Facility deleted successfully!');
    } catch (error) {
      alert('Error deleting facility: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditFacility(content.facilities[index]);
    setSelectedEditFile(null);
  };

  const handleUpdateFacility = async () => {
    try {
      setIsSaving(true);
      let updatedImageUrl = editFacility.imageUrl;

      if (selectedEditFile) {
        const storageRef = ref(storage, `facilityImages/${Date.now()}_${selectedEditFile.name}`);
        await uploadBytes(storageRef, selectedEditFile);
        updatedImageUrl = await getDownloadURL(storageRef);
      }

      const updatedFacility = {
        ...editFacility,
        imageUrl: updatedImageUrl,
      };

      const updatedFacilities = [...content.facilities];
      updatedFacilities[editIndex] = updatedFacility;

      const docRef = doc(db, 'siteContent', 'home');
      await updateDoc(docRef, { facilities: updatedFacilities });

      setContent((prevContent) => ({
        ...prevContent,
        facilities: updatedFacilities,
      }));

      setEditIndex(null);
      setSelectedEditFile(null);
      alert('Facility updated successfully!');
    } catch (error) {
      alert('Error updating facility: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full md:w-250 md:ml-29 mb-5 border border-gray-200">
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-4 md:p-6">
        <h2 className="text-2xl md:text-3xl font-bold">Home Page Content Manager</h2>
        <p className="text-blue-100 mt-2 text-sm md:text-base">Update your website's homepage content and facilities</p>
        <div className="w-16 md:w-24 h-1 bg-yellow-400 mt-3 md:mt-4 rounded-full"></div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 bg-blue-50 overflow-x-auto">
        <button
          onClick={() => setActiveTab('content')}
          className={`px-3 md:px-6 py-3 md:py-4 font-medium text-base md:text-lg transition-all duration-200 ${activeTab === 'content'
              ? 'border-b-4 border-yellow-400 text-blue-900 bg-white'
              : 'text-gray-600 hover:text-blue-800 hover:bg-blue-100'
            }`}
        >
          Main Content
        </button>
        <button
          onClick={() => setActiveTab('facilities')}
          className={`px-3 md:px-6 py-3 md:py-4 font-medium text-base md:text-lg transition-all duration-200 flex items-center ${activeTab === 'facilities'
              ? 'border-b-4 border-yellow-400 text-blue-900 bg-white'
              : 'text-gray-600 hover:text-blue-800 hover:bg-blue-100'
            }`}
        >
          Facilities
          <span className="ml-2 bg-blue-900 text-white text-xs md:text-sm py-1 px-2 rounded-full">
            {content.facilities?.length || 0}
          </span>
        </button>
      </div>

      <div className="p-4 md:p-6 bg-blue-50 bg-opacity-30">
        {activeTab === 'content' && (
          <div className="space-y-4 md:space-y-6">
            {['welcome', 'mission', 'vision', 'history'].map((field) => (
              <div key={field} className="mb-4 md:mb-6">
                <label className="block text-blue-900 font-semibold mb-2 capitalize text-base md:text-lg">
                  {field} Section
                </label>
                <textarea
                  name={field}
                  value={content[field]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2 md:py-3 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition"
                  rows="4"
                  placeholder={`Enter your ${field} content here...`}
                />
              </div>
            ))}

            <div className="flex justify-end pt-4 md:pt-6">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 md:px-8 py-2 md:py-3 rounded-lg font-medium transition flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                {isSaving ? (
                  <>
                    <span className="animate-spin h-4 md:h-5 w-4 md:w-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 md:h-5 w-4 md:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    <span>Save All Content</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        {activeTab === 'facilities' && (
          <div>
            {/* Add New Facility */}
            <div className="bg-white p-4 md:p-6 rounded-lg mb-6 md:mb-8 border border-blue-100 shadow-sm">
              <div className="flex items-center mb-3 md:mb-4">
                <div className="w-2 h-6 md:h-8 bg-yellow-400 rounded-full mr-2 md:mr-3"></div>
                <h3 className="text-lg md:text-xl font-semibold text-blue-900">Add New Facility</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="col-span-1">
                  <label className="block text-blue-900 text-xs md:text-sm font-medium mb-1">Facility Name</label>
                  <input
                    type="text"
                    placeholder="Enter facility name"
                    value={newFacility.name}
                    onChange={(e) => setNewFacility({ ...newFacility, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-blue-900 text-xs md:text-sm font-medium mb-1">Image URL (optional)</label>
                  <input
                    type="text"
                    placeholder="Or enter an image URL"
                    value={newFacility.imageUrl}
                    onChange={(e) => setNewFacility({ ...newFacility, imageUrl: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-blue-900 text-xs md:text-sm font-medium mb-1">Description</label>
                  <textarea
                    placeholder="Describe this facility"
                    value={newFacility.description}
                    onChange={(e) => setNewFacility({ ...newFacility, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                    rows="3"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-blue-900 text-xs md:text-sm font-medium mb-1">Upload Image</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      className="hidden"
                      id="facility-image-upload"
                    />
                    <label
                      htmlFor="facility-image-upload"
                      className="cursor-pointer bg-blue-50 border border-blue-200 rounded-lg px-3 md:px-4 py-2 text-blue-900 hover:bg-blue-100 transition-colors flex items-center text-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 md:h-5 w-4 md:w-5 mr-1 md:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Choose File
                    </label>
                    <span className="text-xs md:text-sm text-gray-500">
                      {selectedFile ? selectedFile.name : 'No file chosen'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-6">
                <button
                  onClick={handleAddFacility}
                  disabled={isSaving || !newFacility.name}
                  className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium flex items-center space-x-2 transition-all shadow-md text-sm md:text-base ${isSaving || !newFacility.name
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-yellow-400 hover:bg-yellow-500 text-blue-900 hover:shadow-lg transform hover:-translate-y-1'
                    }`}
                >
                  {isSaving ? (
                    <>
                      <span className="animate-spin h-4 md:h-5 w-4 md:w-5 border-2 border-blue-900 border-t-transparent rounded-full"></span>
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 md:h-5 w-4 md:w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Add Facility</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Existing Facilities */}
            <div>
              <div className="flex items-center mb-4 md:mb-6">
                <div className="w-2 h-6 md:h-8 bg-yellow-400 rounded-full mr-2 md:mr-3"></div>
                <h3 className="text-lg md:text-xl font-semibold text-blue-900">Existing Facilities</h3>
              </div>

              {content.facilities?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {content.facilities.map((facility, index) => (
                    <div
                      key={index}
                      className="border border-blue-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all bg-white"
                    >
                      {editIndex === index ? (
                        <div className="p-4 md:p-5 border-t-4 border-yellow-400">
                          <h4 className="font-medium text-blue-900 mb-3 md:mb-4 text-base md:text-lg">Edit Facility</h4>
                          <div className="space-y-3 md:space-y-4">
                            <div>
                              <label className="block text-blue-900 text-xs md:text-sm font-medium mb-1">Facility Name</label>
                              <input
                                type="text"
                                value={editFacility.name}
                                onChange={(e) => setEditFacility({ ...editFacility, name: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                              />
                            </div>

                            <div>
                              <label className="block text-blue-900 text-xs md:text-sm font-medium mb-1">Description</label>
                              <textarea
                                value={editFacility.description}
                                onChange={(e) => setEditFacility({ ...editFacility, description: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                                rows="3"
                              />
                            </div>

                            <div>
                              <label className="block text-blue-900 text-xs md:text-sm font-medium mb-1">Current Image</label>
                              {editFacility.imageUrl ? (
                                <div className="w-full h-32 md:h-40 bg-gray-100 flex items-center justify-center overflow-hidden rounded border border-gray-200">
                                  <img
                                    src={editFacility.imageUrl}
                                    alt={editFacility.name}
                                    className="h-full w-auto object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-full h-32 md:h-40 bg-blue-50 flex items-center justify-center rounded border border-blue-100">
                                  <span className="text-blue-300">No image</span>
                                </div>
                              )}
                            </div>

                            <div>
                              <label className="block text-blue-900 text-xs md:text-sm font-medium mb-1">Upload New Image</label>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => setSelectedEditFile(e.target.files[0])}
                                  className="hidden"
                                  id={`edit-facility-image-${index}`}
                                />
                                <label
                                  htmlFor={`edit-facility-image-${index}`}
                                  className="cursor-pointer bg-blue-50 border border-blue-200 rounded-lg px-2 md:px-3 py-1 md:py-2 text-blue-900 hover:bg-blue-100 text-xs md:text-sm flex items-center"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 md:h-4 w-3 md:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  Choose File
                                </label>
                                <span className="text-xs md:text-sm text-gray-500">
                                  {selectedEditFile ? selectedEditFile.name : 'No file chosen'}
                                </span>
                              </div>
                            </div>

                            <div className="flex space-x-3 pt-2">
                              <button
                                onClick={handleUpdateFacility}
                                disabled={isSaving}
                                className={`px-3 md:px-4 py-1 md:py-2 rounded-lg font-medium text-xs md:text-sm flex items-center ${isSaving ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-800 text-white shadow hover:shadow-md transition-all'
                                  }`}
                              >
                                {isSaving ? (
                                  <>
                                    <span className="animate-spin h-3 md:h-4 w-3 md:w-4 border-2 border-white border-t-transparent rounded-full mr-1 md:mr-2"></span>
                                    <span>Saving...</span>
                                  </>
                                ) : (
                                  <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 md:h-4 w-3 md:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Save Changes
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => setEditIndex(null)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 md:px-4 py-1 md:py-2 rounded-lg font-medium text-xs md:text-sm transition-all flex items-center"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 md:h-4 w-3 md:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="relative">
                            {facility.imageUrl ? (
                              <div className="w-full h-48 md:h-60 bg-gray-100">
                                <img
                                  src={facility.imageUrl}
                                  alt={facility.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-full h-24 md:h-32 bg-blue-50 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 md:h-16 w-12 md:w-16 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                            <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>
                          </div>

                          <div className="p-4 md:p-5">
                            <h4 className="text-lg md:text-xl font-semibold text-blue-900">{facility.name}</h4>
                            <p className="text-gray-600 mt-2 md:mt-3 mb-4 md:mb-5 text-sm md:text-base">{facility.description}</p>

                            <div className="flex space-x-2 md:space-x-3">
                              <button
                                onClick={() => handleEditClick(index)}
                                className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-3 md:px-4 py-1 md:py-2 rounded-lg text-xs md:text-sm font-medium flex items-center transition-all shadow hover:shadow-md"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 md:h-4 w-3 md:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteFacility(index)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 md:px-4 py-1 md:py-2 rounded-lg text-xs md:text-sm font-medium flex items-center transition-all shadow hover:shadow-md"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 md:h-4 w-3 md:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 md:py-16 bg-blue-50 rounded-lg border-2 border-dashed border-blue-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 md:h-16 w-12 md:w-16 mx-auto text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p className="mt-3 md:mt-4 text-blue-900 font-medium text-sm md:text-base">No facilities found. Add your first facility above.</p>
                  <p className="text-blue-600 text-xs md:text-sm mt-1 md:mt-2">Facilities will be displayed on the homepage for visitors to see.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditHomeContent;