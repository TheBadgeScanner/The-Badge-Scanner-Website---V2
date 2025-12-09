// File: components/utils/clipboardUtils.ts
/**
 * Utility functions for clipboard operations with fallbacks
 */

export async function copyToClipboard(text: string): Promise<boolean> {
  // First try the modern Clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Clipboard API failed, trying fallback method:', err);
      // Fall through to fallback methods
    }
  }

  // Fallback method 1: Using execCommand (deprecated but widely supported)
  try {
    const result = await fallbackCopyTextToClipboard(text);
    if (result) {
      return true;
    }
  } catch (err) {
    console.warn('execCommand fallback failed:', err);
  }

  // Fallback method 2: Create temporary textarea (most compatible)
  try {
    const result = textAreaFallback(text);
    return result;
  } catch (err) {
    console.error('All clipboard methods failed:', err);
    return false;
  }
}

/**
 * Fallback using deprecated execCommand
 */
function fallbackCopyTextToClipboard(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    textArea.style.pointerEvents = "none";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      resolve(successful);
    } catch (err) {
      document.body.removeChild(textArea);
      resolve(false);
    }
  });
}

/**
 * Most basic fallback using textarea selection
 */
function textAreaFallback(text: string): boolean {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  
  // Make the textarea invisible but still functional
  textArea.style.position = "absolute";
  textArea.style.left = "-9999px";
  textArea.style.top = "-9999px";
  textArea.style.opacity = "0";
  textArea.setAttribute("readonly", "");
  textArea.style.pointerEvents = "none";
  
  document.body.appendChild(textArea);
  
  try {
    // For mobile devices
    if (/ipad|iphone/i.test(navigator.userAgent)) {
      const range = document.createRange();
      range.selectNodeContents(textArea);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      textArea.setSelectionRange(0, 999999);
    } else {
      textArea.select();
      textArea.setSelectionRange(0, 999999); // For mobile
    }
    
    // Try to copy
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    document.body.removeChild(textArea);
    return false;
  }
}

/**
 * Show user feedback for copy operations
 */
export function showCopyFeedback(success: boolean, text?: string): void {
  if (success) {
    // You can integrate with your toast system here
    console.log('✅ Copied to clipboard successfully');
  } else {
    // Fallback: show the text to user for manual copying
    console.warn('❌ Failed to copy to clipboard');
    if (text) {
      // Create a modal or alert for manual copying
      showManualCopyDialog(text);
    }
  }
}

/**
 * Show manual copy dialog when all clipboard methods fail
 */
function showManualCopyDialog(text: string): void {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    font-family: system-ui, -apple-system, sans-serif;
  `;
  
  const dialog = document.createElement('div');
  dialog.style.cssText = `
    background: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  `;
  
  dialog.innerHTML = `
    <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Manual Copy Required</h3>
    <p style="margin: 0 0 15px 0; font-size: 14px; color: #666;">
      Please manually copy the text below:
    </p>
    <textarea readonly style="
      width: 100%;
      height: 80px;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: monospace;
      font-size: 12px;
      resize: none;
      margin-bottom: 15px;
    ">${text}</textarea>
    <div style="text-align: right;">
      <button style="
        background: #007bff;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      ">Close</button>
    </div>
  `;
  
  const closeBtn = dialog.querySelector('button');
  const textarea = dialog.querySelector('textarea');
  
  // Auto-select text
  if (textarea) {
    textarea.focus();
    textarea.select();
  }
  
  if (closeBtn) {
    closeBtn.onclick = () => document.body.removeChild(modal);
  }
  
  modal.onclick = (e) => {
    if (e.target === modal) document.body.removeChild(modal);
  };
  
  modal.appendChild(dialog);
  document.body.appendChild(modal);
}

/**
 * Enhanced copy function with user feedback
 */
export async function copyWithFeedback(text: string): Promise<void> {
  try {
    const success = await copyToClipboard(text);
    showCopyFeedback(success, text);
  } catch (err) {
    console.error('Copy operation failed:', err);
    showCopyFeedback(false, text);
  }
}
