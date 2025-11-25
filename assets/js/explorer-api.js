// VCP Explorer API v1.1 - JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
  console.log('VCP Explorer API v1.1 - Page loaded');
  
  // Mobile menu toggle
  const navbarBurger = document.getElementById('navbarBurger');
  const navbarMenu = document.getElementById('navbarMenu');
  
  if (navbarBurger && navbarMenu) {
    navbarBurger.addEventListener('click', () => {
      navbarBurger.classList.toggle('active');
      navbarMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navbarItems = navbarMenu.querySelectorAll('.navbar-item');
    navbarItems.forEach(item => {
      item.addEventListener('click', () => {
        navbarBurger.classList.remove('active');
        navbarMenu.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbarBurger.contains(e.target) && !navbarMenu.contains(e.target)) {
        navbarBurger.classList.remove('active');
        navbarMenu.classList.remove('active');
      }
    });
  }
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add copy functionality to code blocks
  const codeBlocks = document.querySelectorAll('.code-block');
  codeBlocks.forEach(block => {
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-btn';
    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
    copyButton.title = 'Copy to clipboard';
    
    copyButton.addEventListener('click', () => {
      const code = block.querySelector('pre').textContent;
      navigator.clipboard.writeText(code).then(() => {
        copyButton.innerHTML = '<i class="fas fa-check"></i>';
        copyButton.style.color = '#10b981';
        setTimeout(() => {
          copyButton.innerHTML = '<i class="fas fa-copy"></i>';
          copyButton.style.color = '';
        }, 2000);
      });
    });
    
    block.style.position = 'relative';
    block.appendChild(copyButton);
  });
});

// Add copy button styles dynamically
const style = document.createElement('style');
style.textContent = `
  .copy-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.875rem;
  }
  
  .copy-btn:hover {
    background-color: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  .copy-btn i {
    pointer-events: none;
  }
`;
document.head.appendChild(style);
