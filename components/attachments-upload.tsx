import { useState, useEffect } from "react";
import { UploadButton } from "../utils/uploadthing";
import { toast } from "react-hot-toast";



interface AttachmentsUploadFormProps {
  disabled?: boolean;
  onChange: (value: {
    ufsUrl: any; url: string; name: string 
}[]) => void;
  value: { url: string; name: string }[];
}

const AttachmentsUploadForm = ({ disabled, onChange, value }: AttachmentsUploadFormProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
 
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleUploadComplete = (res: any) => {
    console.log("Upload response:", res);
    try {
      if (res && res.length > 0) {
        const newFiles = res.map((file: any) => ({ url: file.url, name: file.name }));
        onChange([...value, ...newFiles]);
        setIsLoading(false);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Failed to parse response from UploadThing server:", error);
      toast.error("Failed to parse response. Please try again.");
      setIsLoading(false);
    }
  };

  const handleUploadError = (error: Error) => {
    console.error("Upload failed:", error);
    toast.error(`Upload failed: ${error.message}`);
    setIsLoading(false);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <UploadButton
        endpoint="pdfUpload"
        onClientUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
        disabled={disabled || isLoading}
      />
    </div>
  );
};

export default AttachmentsUploadForm;
