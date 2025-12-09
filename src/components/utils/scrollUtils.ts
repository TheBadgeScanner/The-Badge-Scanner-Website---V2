// File: components/utils/scrollUtils.ts
/**
 * Universal scroll utility functions for dashboard pages
 */

/**
 * Scrolls to the top of the current page/dashboard with smooth animation
 * Works across all browsers with multiple fallback methods
 */
export const scrollToTop = () => {
  console.log('ScrollUtils: Scrolling to top of page');
  
  // Use setTimeout to ensure DOM updates are complete
  setTimeout(() => {
    // Primary method - smooth scroll to top
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.warn('ScrollUtils: Smooth scroll failed, using fallback');
    }
    
    // Fallback for older browsers if smooth scroll fails
    setTimeout(() => {
      if (window.scrollY > 50) {
        console.log('ScrollUtils: Applying instant scroll fallback');
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        window.scrollTo(0, 0);
      }
    }, 500);
  }, 100);
};

/**
 * Creates a universal scroll-to-top handler that can be passed to any dashboard component
 * @param componentName - Optional name for debugging purposes
 */
export const createUniversalScrollHandler = (componentName = 'Dashboard') => {
  return () => {
    console.log(`${componentName}: Universal scroll to top triggered`);
    scrollToTop();
  };
};
