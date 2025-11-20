import { useEffect, useRef, useState } from "react";
import { Image, MapPin, FileText, Mic, Camera, User, X } from "lucide-react";
import { toast } from "react-toastify";

interface AttachmentMenuProps {
  onClose: () => void;
  onFileSelect: (file: File, type: "image" | "document" | "audio" | "camera") => void;
  onLocationSelect: (location: { lat: number; lng: number }) => void;
}

const AttachmentMenu: React.FC<AttachmentMenuProps> = ({
  onClose,
  onFileSelect,
  onLocationSelect,
}) => {
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "document" | "audio" | "camera"
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("Selected:", file, "Type:", type);
      onFileSelect(file, type);
      onClose();
    }
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setShowCameraModal(true);
    } catch (err) {
      console.error("Camera error:", err);
      toast.error("Failed to access camera");
    }
  };

  useEffect(() => {
    if (showCameraModal && videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [showCameraModal, cameraStream]);

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      toast.warning("Camera not ready yet!");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/png");
    setCapturedPreview(dataUrl);
  };

  const confirmPhoto = () => {
    if (!capturedPreview) return;

    fetch(capturedPreview)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `photo-${Date.now()}.png`, { type: "image/png" });
        onFileSelect(file, "camera");
        closeCamera();
        setCapturedPreview(null);
        onClose()
      });
  };

  const retakePhoto = async () => {
    setCapturedPreview(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error restarting camera:", err);
      toast.error("Failed to restart camera");
    }
  };

  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }
    setCameraStream(null);
    setShowCameraModal(false);
    setCapturedPreview(null);
  };

  // location
  const handleLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          onLocationSelect({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          toast.success("location added");
          onClose();
        },
        (err) => {
          toast.warning("Location access denied!");
          console.error(err);
        }
      );
    } else {
      toast.warning("Geolocation not supported");
    }
  };

  return (
    <div className="absolute bottom-16 left-4 right-4 bg-white p-4 rounded-2xl shadow-lg grid grid-cols-3 gap-6 max-w-md mx-auto">
      {/* Hidden Inputs */}
      <input
        type="file"
        accept="image/*"
        id="galleryInput"
        hidden
        onChange={(e) => handleFileChange(e, "image")}
      />
      <input
        type="file"
        accept="*/*"
        id="documentInput"
        hidden
        onChange={(e) => handleFileChange(e, "document")}
      />

      <input
        type="file"
        accept="audio/*"
        capture
        id="audioInput"
        hidden
        onChange={(e) => handleFileChange(e, "audio")}
      />

      {/* Gallery */}
      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={() => document.getElementById("galleryInput")?.click()}
      >
        <div className="bg-gray-200 h-8 w-8 rounded-full flex items-center justify-center me-2">
          <Image size={19} />
        </div>
        <p className="text-sm mt-1">Gallery</p>
      </div>

      {/* Location */}
      <div className="flex flex-col items-center cursor-pointer" onClick={handleLocation}>
        <div className="bg-gray-200 h-8 w-8 rounded-full flex items-center justify-center me-2">
          <MapPin size={19} />
        </div>
        <p className="text-sm mt-1">Location</p>
      </div>

      {/* Document */}
      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={() => document.getElementById("documentInput")?.click()}
      >
        <div className="bg-gray-200 h-8 w-8 rounded-full flex items-center justify-center me-2">
          <FileText size={19} />
        </div>
        <p className="text-sm mt-1">Document</p>
      </div>

      {/* Audio */}
      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={() => document.getElementById("audioInput")?.click()}
      >
        <div className="bg-gray-200 h-8 w-8 rounded-full flex items-center justify-center me-2">
          <Mic size={19} />
        </div>
        <p className="text-sm mt-1">Audio</p>
      </div>

      {/* Camera */}
      <div className="flex flex-col items-center cursor-pointer" onClick={openCamera}>
        <div className="bg-gray-200 h-8 w-8 rounded-full flex items-center justify-center me-2">
          <Camera size={19} />
        </div>
        <p className="text-sm mt-1">Camera</p>
      </div>

      {/* Contact */}
      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={() => alert("Contact picker not supported in browser. Use a form.")}
      >
        <div className="bg-gray-200 h-8 w-8 rounded-full flex items-center justify-center me-2">
          <User size={19} />
        </div>
        <p className="text-sm mt-1">Contact</p>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-black"
      >
        <X size={19} />
      </button>

      {/* Camera Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50">
          {!capturedPreview ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full max-w-md rounded-lg"
              />
              <div className="flex gap-4 mt-4">
                <button
                  onClick={capturePhoto}
                  className="bg-green-500 px-4 py-2 rounded text-white"
                >
                  Capture
                </button>
                <button
                  onClick={closeCamera}
                  className="bg-red-500 px-4 py-2 rounded text-white"
                >
                  Close
                </button>
              </div>
            </>
          ) : (
            <>
              <img
                src={capturedPreview}
                alt="Captured Preview"
                className="w-full max-w-md rounded-lg"
              />
              <div className="flex gap-4 mt-4">
                <button
                  onClick={confirmPhoto}
                  className="bg-blue-500 px-4 py-2 rounded text-white"
                >
                  OK
                </button>
                <button
                  onClick={retakePhoto}
                  className="bg-yellow-500 px-4 py-2 rounded text-white"
                >
                  Retake
                </button>
                <button
                  onClick={closeCamera}
                  className="bg-red-500 px-4 py-2 rounded text-white"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AttachmentMenu;
