import { useState } from "react";
import useShowToast from "./useShowToast";

const usePreviewImg = () => {
  const [imgUrl, setImgUrl] = useState(null);
  const showToast = useShowToast();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    // Check if the selected file is an image
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();

      // Set the image URL when the file is loaded
      reader.onloadend = () => {
        setImgUrl(reader.result);
      };

      // Read the selected file as a data URL
      reader.readAsDataURL(file);
    } else {
      showToast("Invalid file type", " Please select an image file", "error");
      setImgUrl(null);
    }
  };
  return { handleImageChange, imgUrl, setImgUrl };
};

export default usePreviewImg;
