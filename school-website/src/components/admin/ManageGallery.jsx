import React, { useState, useEffect } from "react";
import { storage, db } from "@/firebase/firebaseConfig";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Upload, X, Image, Trash2 } from "lucide-react";

const GalleryManager = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // 🔄 Load existing images
  useEffect(() => {
    const fetchImages = async () => {
      const querySnapshot = await getDocs(collection(db, "galleryImages"));
      const images = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGalleryImages(images);
    };

    fetchImages();
  }, []);

  // 🆕 Upload new image
  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a file");
    
    setIsUploading(true);
    try {
      const imageRef = ref(storage, `gallery/${Date.now()}_${selectedFile.name}`);
      await uploadBytes(imageRef, selectedFile);
      const downloadURL = await getDownloadURL(imageRef);

      const docRef = await addDoc(collection(db, "galleryImages"), {
        imageUrl: downloadURL,
        uploadedAt: new Date(),
        imageName: selectedFile.name,
        storagePath: imageRef.fullPath,
      });

      setGalleryImages((prev) => [
        ...prev,
        {
          id: docRef.id,
          imageUrl: downloadURL,
          uploadedAt: new Date(),
          imageName: selectedFile.name,
          storagePath: imageRef.fullPath,
        },
      ]);

      setSelectedFile(null);
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // ❌ Delete image
  const handleDelete = async (image) => {
    const confirm = window.confirm("Are you sure you want to delete this image?");
    if (!confirm) return;

    try {
      // Delete from storage
      const imageRef = ref(storage, image.storagePath);
      await deleteObject(imageRef);

      // Delete from Firestore
      await deleteDoc(doc(db, "galleryImages", image.id));

      // Update state
      setGalleryImages((prev) =>
        prev.filter((img) => img.id !== image.id)
      );

      alert("Image deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete image. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl mx-auto border-4 border-yellow-400">
      {/* Header with logo-inspired styling */}
      <div className="bg-blue-900 -mx-6 -mt-6 mb-6 px-6 py-4 rounded-t-lg border-b-4 border-yellow-400">
        <h2 className="text-2xl font-bold text-white">Dynamic Academy Gallery Manager</h2>
      </div>

      {/* Upload Section */}
      <div className="mb-8 bg-blue-50 p-6 rounded-lg border-2 border-blue-900">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <label 
              htmlFor="file-upload" 
              className={`flex items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                selectedFile ? "border-red-500 bg-red-50" : "border-blue-300 hover:border-blue-400"
              }`}
            >
              <div className="flex flex-col items-center">
                {selectedFile ? (
                  <>
                    <div className="flex items-center text-blue-900">
                      <Image size={24} className="mr-2" />
                      <span className="font-medium text-sm truncate max-w-xs">{selectedFile.name}</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedFile(null);
                      }}
                      className="mt-2 text-xs text-red-500 flex items-center"
                    >
                      <X size={14} className="mr-1" /> Remove
                    </button>
                  </>
                ) : (
                  <>
                    <Upload size={24} className="text-blue-900" />
                    <p className="mt-2 text-sm text-blue-900">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-blue-700 mt-1">PNG, JPG, GIF up to 10MB</p>
                  </>
                )}
              </div>
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="hidden"
            />
          </div>
          
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center min-w-32 transition-colors ${
              !selectedFile || isUploading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <Upload size={18} className="mr-2" />
                Upload Image
              </>
            )}
          </button>
        </div>
      </div>

      {/* Gallery Display */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-blue-900 mb-4 pb-2 border-b-2 border-yellow-400">Gallery Images</h3>
        
        {galleryImages.length === 0 ? (
          <div className="text-center py-12 bg-blue-50 rounded-lg border-2 border-blue-200">
            <Image size={48} className="mx-auto text-blue-300 mb-3" />
            <p className="text-blue-700">No images in the gallery yet.</p>
            <p className="text-blue-500 text-sm mt-1">Upload your first image to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {galleryImages.map((image) => (
              <div key={image.id} className="group relative overflow-hidden rounded-lg shadow-md transition-all hover:shadow-lg border-2 border-blue-200">
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={image.imageUrl}
                    alt={image.imageName}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                  <p className="text-white text-sm font-medium truncate">{image.imageName}</p>
                  <p className="text-blue-100 text-xs mb-2">
                    {new Date(image.uploadedAt?.toDate?.() || image.uploadedAt).toLocaleDateString()}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(image);
                    }}
                    className="mt-2 px-3 py-1.5 bg-red-600 text-white text-xs rounded-md flex items-center justify-center hover:bg-red-700 transition-colors"
                  >
                    <Trash2 size={14} className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer with academy-inspired styling */}
      <div className="mt-8 pt-4 border-t-2 border-yellow-400 text-sm text-center text-blue-900">
        <p>© 2025 Dynamic Academy of Science - Ashrafpur Majgawan</p>
      </div>
    </div>
  );
};

export default GalleryManager;