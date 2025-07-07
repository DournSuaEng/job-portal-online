"use client";
import { ImagePlus, Trash } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { UploadButton } from '../utils/uploadthing';
import imageRemove from '@/app/api/actions/imageRemove';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string;
  onDeleteCallback?: () => void; // NEW
}

interface UploadResponse {
  url: string;
  key: string;
}

const ImageUpload = ({ disabled, onChange, onRemove, value, onDeleteCallback }: ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageKey, setImageKey] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleUploadComplete = (res: UploadResponse[]) => {
    if (res && res.length > 0) {
      const uploadedImageUrl = res[0].url;
      const uploadedImageKey = res[0].key;
      setImageUrl(uploadedImageUrl);
      setImageKey(uploadedImageKey);
      onChange(uploadedImageUrl);
    }
    setIsLoading(false);
  };

  const handleUploadError = (error: Error) => {
    alert(`Upload failed: ${error.message}`);
    setIsLoading(false);
  };

  const handleRemove = async () => {
    if (!imageKey && !value) return;

    setIsLoading(true);
    const res = await imageRemove(imageKey || value);

    if (res.success) {
      toast.success("Image deleted");
      setImageKey("");
      setImageUrl("");
      onRemove(value);
      onDeleteCallback?.(); // SUBMIT FORM IF CALLBACK IS PROVIDED
    } else {
      alert("Failed to delete image.");
    }
    setIsLoading(false);
  };

  if (!isMounted) return null;

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      {value ? (
        <div className="relative w-full h-60 aspect-video rounded-md overflow-hidden">
          <Image fill className="w-full h-full object-cover" src={value} alt="Uploaded Image" />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
            disabled={isLoading}
          >
            <Trash className="w-4 h-6" />
          </button>
        </div>
      ) : (
        <div className="w-full h-60 aspect-video flex items-center justify-center border border-dashed bg-neutral-50">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
