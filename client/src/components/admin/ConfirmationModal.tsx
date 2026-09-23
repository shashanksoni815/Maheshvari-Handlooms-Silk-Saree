import { createContext, useContext, useState, type ReactNode } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  isDestructive?: boolean;
}

interface ConfirmationModalContextType {
  confirm: (options: ConfirmationModalOptions) => void;
}

const ConfirmationModalContext = createContext<ConfirmationModalContextType | undefined>(undefined);

export const useConfirmation = () => {
  const context = useContext(ConfirmationModalContext);
  if (!context) {
    throw new Error('useConfirmation must be used within a ConfirmationModalProvider');
  }
  return context;
};

export const ConfirmationModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmationModalOptions | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const confirm = (opts: ConfirmationModalOptions) => {
    setOptions(opts);
    setIsOpen(true);
  };

  const handleClose = () => {
    if (isProcessing) return;
    setIsOpen(false);
    setTimeout(() => setOptions(null), 300); // Wait for animation
  };

  const handleConfirm = async () => {
    if (!options) return;
    setIsProcessing(true);
    try {
      await options.onConfirm();
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ConfirmationModalContext.Provider value={{ confirm }}>
      {children}
      {isOpen && options && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-md shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-fade-in-up">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="text-lg font-serif font-bold text-primary flex items-center gap-2">
                {options.isDestructive && <AlertTriangle className="w-5 h-5 text-red-500" />}
                {options.title}
              </h3>
              <button onClick={handleClose} disabled={isProcessing} className="text-gray-400 hover:text-primary transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 text-muted">
              {options.message}
            </div>
            
            <div className="p-5 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
              <button
                onClick={handleClose}
                disabled={isProcessing}
                className="px-4 py-2 text-sm font-semibold text-primary border border-supporting rounded hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                {options.cancelText || 'Cancel'}
              </button>
              <button
                onClick={handleConfirm}
                disabled={isProcessing}
                className={`px-4 py-2 text-sm font-semibold text-white rounded transition-colors disabled:opacity-50 flex items-center gap-2 ${
                  options.isDestructive ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary-light'
                }`}
              >
                {isProcessing && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {options.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmationModalContext.Provider>
  );
};
