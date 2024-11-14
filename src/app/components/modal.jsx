import React from "react";
import { AiOutlineClose } from "react-icons/ai";

const Modal = ({ modalMessage, handleClose }) => {
  const handleCancel = () => {
    console.log("Cancel button clicked");
    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-950 relative rounded-lg shadow-2xl w-full max-w-[300px] h-[150px] mx-4 md:mx-0 p-8 space-y-8">
        <button
          onClick={handleCancel}
          className="absolute top-2 right-2 text-xl text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <AiOutlineClose />
        </button>
        <div className="flex items-center justify-center">
          <p className="text-medium font-bold">{modalMessage}</p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
