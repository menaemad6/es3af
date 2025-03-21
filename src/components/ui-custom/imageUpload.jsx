
import { Image, Image as ImageIcon , Paperclip } from "lucide-react"; // Import Lucide icon
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { Button } from "@/components/ui/button";


const APP_LANG = import.meta.env.VITE_APP_LANG




const ImageUpload = ({
  imagePreview,
  isLoadingImage,
  setImagePreview,
  setImage,
  setImageBase64,
  fileInputRef,
}) => {


  // Convert image to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set preview
        resolve(reader.result.split(",")[1]); // Remove "data:image/jpeg;base64,"
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle file selection
  const handleFileChange = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const base64 = await convertToBase64(file);
      setImageBase64(base64);
    }
  };










    



  return (
    <div className="relative">
      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
              <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="flex-shrink-0"
                          onClick={() => fileInputRef.current.click()} // Open file picker
                          disabled={isLoadingImage}
                        >
                          {isLoadingImage ? <LoadingSpinner width={16} height={16}  className="sm:w-5 sm:h-5 " /> :  <Paperclip className="h-5 w-5" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <span className="text-sm">{APP_LANG === 'en' ? "Upload Image" : "ارفع صورة"}</span>
                    </TooltipContent>
                  </Tooltip>
              </TooltipProvider>

    </div>
  );
};

export default ImageUpload;





    //   <div className="flex flex-col items-center gap-4 p-4 max-w-md mx-auto bg-gray-100 shadow-md rounded-lg">
    //     {/* Prompt Input */}
    //     <input
    //       type="text"
    //       placeholder="Enter your prompt..."
    //       value={prompt}
    //       onChange={(e) => setPrompt(e.target.value)}
    //       className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
    //     />
  
    //     {/* Upload Image Button with Tooltip */}
    //     <div className="relative">
    //       <label htmlFor="file-upload" className="cursor-pointer">
    //         <ImageIcon
    //           size={32}
    //           className="text-gray-600 hover:text-blue-500 transition"
    //           data-tooltip-id="image-tooltip"
    //           data-tooltip-content="Upload an image"
    //         />
    //       </label>
    //       <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
    //       <Tooltip id="image-tooltip" place="top" effect="solid" />
  
    //       {/* Image Preview Tooltip */}
    //       {imagePreview && (
    //         <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-40 h-40 border rounded-lg shadow-lg bg-white p-1">
    //           <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-md" />
    //         </div>
    //       )}
    //     </div>
  
    //     {/* Submit Button */}
    //     <button
    //       onClick={handleSubmit}
    //       disabled={loading}
    //       className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:bg-gray-400"
    //     >
    //       {loading ? "Processing..." : "Send to Gemini"}
    //     </button>
  
    //     {/* Display uploaded image from Supabase */}
    //     {imageUrl && <img src={imageUrl} alt="Uploaded" className="w-40 rounded-md shadow-md" />}
  
    //     {/* Display Gemini Response */}
    //     {response && (
    //       <div className="mt-4 p-3 bg-white shadow-md rounded-md">
    //         <h3 className="font-semibold">Gemini Response:</h3>
    //         <p>{response}</p>
    //       </div>
    //     )}
    //   </div>




// ImageUpload for direct gemini (without uploading to supabase)
// const ImageUpload = () => {
//   const [image, setImage] = useState(null);
//   const [prompt, setPrompt] = useState("");
//   const [response, setResponse] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Handle image selection
//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setImage(file);
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async () => {
//     if (!prompt) return alert("Please enter a prompt!");

//     setLoading(true);
//     setResponse(""); // Clear previous response

//     try {
//       const { responseMsg } = await fetchGeminiResponse(prompt, image);
//       setResponse(responseMsg);
//     } catch (error) {
//       console.error("Error fetching Gemini response:", error);
//       setResponse("Failed to get a response.");
//     }

//     setLoading(false);
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="Enter your prompt..."
//         value={prompt}
//         onChange={(e) => setPrompt(e.target.value)}
//       />
//       <input type="file" accept="image/*" onChange={handleFileChange} />
//       <button onClick={handleSubmit} disabled={loading}>
//         {loading ? "Processing..." : "Send to Gemini"}
//       </button>

//       {image && <img src={URL.createObjectURL(image)} alt="Preview" width="200" />}

//       {response && (
//         <div>
//           <h3>Gemini Response:</h3>
//           <p>{response}</p>
//         </div>
//       )}
//     </div>
//   );
// };






// Working Alone 
// const ImageUpload = () => {
//   const [image, setImage] = useState(null);
//   const [imageBase64, setImageBase64] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [imageUrl, setImageUrl] = useState(null);
//   const [prompt, setPrompt] = useState("");
//   const [response, setResponse] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Convert image to base64
//   const convertToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result); // Set preview
//         resolve(reader.result.split(",")[1]); // Remove "data:image/jpeg;base64,"
//       };
//       reader.onerror = reject;
//       reader.readAsDataURL(file);
//     });
//   };

//   // Handle file selection
//   const handleFileChange = async (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setImage(file);
//       const base64 = await convertToBase64(file);
//       setImageBase64(base64);
//     }
//   };

//   // Upload image to Supabase
//   const uploadImageToSupabase = async (file) => {
//     const fileName = `${Date.now()}-${file.name}`;
//     const { data, error } = await supabase.storage.from("uploads").upload(fileName, file);

//     if (error) {
//       console.error("Error uploading to Supabase:", error);
//       throw new Error("Failed to upload image");
//     }

//     return `${SUPABASE_URL}/storage/v1/object/public/uploads/${fileName}`;
//   };

//   // Handle submit
//   const handleSubmit = async () => {
//     if (!prompt) return alert("Please enter a prompt!");
//     setLoading(true);
//     setResponse("");

//     try {
//       let uploadedImageUrl = null;

//       if (image) {
//         uploadedImageUrl = await uploadImageToSupabase(image);
//         setImageUrl(uploadedImageUrl);
//       }

//       const { responseMsg } = await fetchGeminiResponse(prompt, imageBase64);
//       setResponse(responseMsg);
//     } catch (error) {
//       console.error("Error:", error);
//       setResponse("Failed to get a response.");
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="flex flex-col items-center gap-4 p-4 max-w-md mx-auto bg-gray-100 shadow-md rounded-lg">
//       {/* Prompt Input */}
//       <input
//         type="text"
//         placeholder="Enter your prompt..."
//         value={prompt}
//         onChange={(e) => setPrompt(e.target.value)}
//         className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//       />

//       {/* Upload Image Button with Tooltip */}
//       <div className="relative">
//         <label htmlFor="file-upload" className="cursor-pointer">
//           <ImageIcon
//             size={32}
//             className="text-gray-600 hover:text-blue-500 transition"
//             data-tooltip-id="image-tooltip"
//             data-tooltip-content="Upload an image"
//           />
//         </label>
//         <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
//         <Tooltip id="image-tooltip" place="top" effect="solid" />

//         {/* Image Preview Tooltip */}
//         {imagePreview && (
//           <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-40 h-40 border rounded-lg shadow-lg bg-white p-1">
//             <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-md" />
//           </div>
//         )}
//       </div>

//       {/* Submit Button */}
//       <button
//         onClick={handleSubmit}
//         disabled={loading}
//         className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:bg-gray-400"
//       >
//         {loading ? "Processing..." : "Send to Gemini"}
//       </button>

//       {/* Display uploaded image from Supabase */}
//       {imageUrl && <img src={imageUrl} alt="Uploaded" className="w-40 rounded-md shadow-md" />}

//       {/* Display Gemini Response */}
//       {response && (
//         <div className="mt-4 p-3 bg-white shadow-md rounded-md">
//           <h3 className="font-semibold">Gemini Response:</h3>
//           <p>{response}</p>
//         </div>
//       )}
//     </div>
//   );
// };



