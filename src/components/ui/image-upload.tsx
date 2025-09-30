import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
  variant?: "single" | "multiple";
}

export function ImageUpload({
  value = [],
  onChange,
  maxImages = 5,
  maxSize = 5,
  acceptedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  className,
  variant = "multiple"
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadToObjectStorage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('directory', 'products');
    
    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.url;
  };

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type not supported. Please use: ${acceptedTypes.join(', ')}`;
    }
    
    if (file.size > maxSize * 1024 * 1024) {
      return `File too large. Maximum size: ${maxSize}MB`;
    }
    
    return null;
  };

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    // Check max images limit
    if (variant === "multiple" && value.length + fileArray.length > maxImages) {
      toast({
        title: "Too many images",
        description: `Maximum ${maxImages} images allowed`,
        variant: "destructive"
      });
      return;
    }

    if (variant === "single" && fileArray.length > 1) {
      toast({
        title: "Single image only",
        description: "Please select only one image",
        variant: "destructive"
      });
      return;
    }

    // Validate all files first
    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        toast({
          title: "Invalid file",
          description: `${file.name}: ${error}`,
          variant: "destructive"
        });
        return;
      }
    }

    // Upload files
    const uploadPromises = fileArray.map(async (file) => {
      setUploadingFiles(prev => [...prev, file.name]);
      
      try {
        const url = await uploadToObjectStorage(file);
        setUploadingFiles(prev => prev.filter(name => name !== file.name));
        return url;
      } catch (error) {
        setUploadingFiles(prev => prev.filter(name => name !== file.name));
        toast({
          title: "Upload failed",
          description: `${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          variant: "destructive"
        });
        throw error;
      }
    });

    try {
      const uploadedUrls = await Promise.all(uploadPromises);
      const newUrls = variant === "single" ? uploadedUrls : [...value, ...uploadedUrls];
      onChange(newUrls);
      
      toast({
        title: "Upload successful",
        description: `${uploadedUrls.length} image(s) uploaded successfully`
      });
    } catch (error) {
      console.error("Upload error:", error);
    }
  }, [value, onChange, maxImages, maxSize, acceptedTypes, variant, toast]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const removeImage = useCallback((index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    onChange(newUrls);
  }, [value, onChange]);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <Card
        className={cn(
          "border-2 border-dashed transition-all duration-200 hover:border-primary/50 cursor-pointer",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          uploadingFiles.length > 0 && "border-secondary"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        data-testid="image-upload-area"
      >
        <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
          {uploadingFiles.length > 0 ? (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-secondary mb-4" />
              <p className="text-lg font-medium text-secondary mb-2">Uploading images...</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {uploadingFiles.map((filename) => (
                  <Badge key={filename} variant="secondary">
                    {filename}
                  </Badge>
                ))}
              </div>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">
                Drop images here or click to upload
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {variant === "single" ? "Upload 1 image" : `Upload up to ${maxImages} images`} 
                (Max {maxSize}MB each)
              </p>
              <Button variant="outline" type="button" className="cyber-button">
                <ImageIcon className="mr-2 h-4 w-4" />
                Choose Images
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        multiple={variant === "multiple"}
        onChange={handleFileSelect}
        className="hidden"
        data-testid="file-input"
      />

      {/* Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={url}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwaDIwMHYyMDBIMHoiIGZpbGw9IiNmNGY0ZjUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OTk5OSI+SW1hZ2UgRXJyb3I8L3RleHQ+PC9zdmc+";
                  }}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    data-testid={`remove-image-${index}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Info Text */}
      {value.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {value.length} of {maxImages} images uploaded
        </p>
      )}
    </div>
  );
}