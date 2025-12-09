// File: components/DeveloperLabel.tsx
import { useState } from "react";
import { Copy, Check, AlertCircle } from "lucide-react";

export function DeveloperLabel({ pageName, popups = [] }) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const fallbackCopyToClipboard = (text) => {
    // Create a temporary textarea element
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      // Use the older execCommand method as fallback
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  };

  const handleCopy = async () => {
    let textToCopy = `On page ${pageName}:\n`;
    
    if (popups.length > 0) {
      popups.forEach(popup => {
        textToCopy += `- On popup ${popup}:\n`;
      });
    }

    // Reset states
    setCopyError(false);
    setCopied(false);

    try {
      // Try modern Clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }
    } catch (err) {
      console.warn('Clipboard API failed, trying fallback method:', err);
    }

    // Fallback to older method
    try {
      const successful = fallbackCopyToClipboard(textToCopy);
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        setCopyError(true);
        setTimeout(() => setCopyError(false), 3000);
      }
    } catch (err) {
      console.error('All copy methods failed:', err);
      setCopyError(true);
      setTimeout(() => setCopyError(false), 3000);
    }
  };

  const getButtonContent = () => {
    if (copied) {
      return <Check className="w-3 h-3 text-green-600" />;
    }
    if (copyError) {
      return <AlertCircle className="w-3 h-3 text-red-600" />;
    }
    return <Copy className="w-3 h-3 text-gray-600" />;
  };

  const getTooltipText = () => {
    if (copied) return "Copied!";
    if (copyError) return "Copy failed - try manual selection";
    return "Copy page reference";
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-yellow-200 border-2 border-yellow-400 px-3 py-2 rounded-lg shadow-lg font-mono text-sm flex items-center space-x-2">
      <button
        onClick={handleCopy}
        className="flex items-center justify-center w-4 h-4 hover:bg-yellow-300 rounded transition-colors"
        title={getTooltipText()}
      >
        {getButtonContent()}
      </button>
      <span className={`${copyError ? "select-all" : ""} mr-7`}>{pageName}</span>
      {copyError && (
        <span className="text-xs text-red-600 ml-2">
          (Select text manually)
        </span>
      )}
    </div>
  );
}
