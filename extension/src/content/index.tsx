import { createRoot } from 'react-dom/client';
import ContentUI from './ContentUI';

// Add global styles for the injected UI if needed, but Tailwind classes usually handle it.
// Note: Since we inject into the page, our Tailwind classes might conflict or get overridden.
// Using a Shadow DOM is safer, but for simplicity, we'll render a fixed overlay first.

const init = () => {
  const container = document.createElement('div');
  container.id = 'love4prompts-extension-root';
  container.style.position = 'absolute';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.pointerEvents = 'none'; // let clicks pass through
  container.style.zIndex = '999999';

  const attachToDOM = () => {
    if (document.body) {
      document.body.appendChild(container);
    } else {
      document.documentElement.appendChild(container);
    }
  };

  attachToDOM();

  const root = createRoot(container);
  root.render(<ContentUI />);
};

// Initialize after the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
