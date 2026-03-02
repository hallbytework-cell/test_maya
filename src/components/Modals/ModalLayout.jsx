import { X } from "lucide-react";
import { useEffect, useState } from "react";

const ModalLayout = ({ isOpen, onClose, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-500 ${
        isVisible ? 'bg-black/70 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div 
        className={`relative w-full max-w-[420px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-500 transform ${
          isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'
        }`}
      >
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2 text-stone-400 hover:text-stone-900 transition-all rounded-full hover:bg-stone-100"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default ModalLayout;