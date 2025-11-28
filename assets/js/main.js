/**
 * VeritasChain Protocol (VCP) - Main JavaScript
 * © 2025 VeritasChain Inc.
 */

(function() {
  'use strict';

  // ===== Smooth Scroll =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || !href) return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ===== Fade In on Scroll Animation =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe sections for fade-in animation
  document.querySelectorAll('.section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
  });

  // ===== Scroll to Top Button =====
  let scrollTopBtn = null;
  
  function createScrollTopButton() {
    scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollTopBtn.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      color: white;
      border: none;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      z-index: 999;
      font-size: 1.25rem;
    `;
    
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    
    scrollTopBtn.addEventListener('mouseenter', () => {
      scrollTopBtn.style.transform = 'translateY(-5px)';
      scrollTopBtn.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
    });
    
    scrollTopBtn.addEventListener('mouseleave', () => {
      scrollTopBtn.style.transform = 'translateY(0)';
      scrollTopBtn.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
    });
    
    document.body.appendChild(scrollTopBtn);
  }

  // Show/hide scroll to top button
  function handleScrollTopButton() {
    if (!scrollTopBtn) {
      createScrollTopButton();
    }
    
    if (window.pageYOffset > 300) {
      scrollTopBtn.style.opacity = '1';
      scrollTopBtn.style.visibility = 'visible';
    } else {
      scrollTopBtn.style.opacity = '0';
      scrollTopBtn.style.visibility = 'hidden';
    }
  }

  window.addEventListener('scroll', handleScrollTopButton);

  // ===== Lazy Loading for Images =====
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.src = img.dataset.src || img.src;
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/lazysizes@5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
  }

  // ===== Navigation Active State =====
  function updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.pageYOffset + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        document.querySelectorAll(`a[href="#${sectionId}"]`).forEach(link => {
          link.classList.add('active');
        });
      } else {
        document.querySelectorAll(`a[href="#${sectionId}"]`).forEach(link => {
          link.classList.remove('active');
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveSection);

  // ===== External Links - Open in New Tab =====
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.getAttribute('target')) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });

  // ===== Performance: Reduce Motion for Users Who Prefer It =====
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.scrollBehavior = 'auto';
  }

  // ===== Console Easter Egg =====
  console.log('%c🛡️ VeritasChain Protocol (VCP)', 'color: #3b82f6; font-size: 24px; font-weight: bold;');
  console.log('%cEncoding Trust in the Algorithmic Age', 'color: #8b5cf6; font-size: 14px; font-style: italic;');
  console.log('%c\nInterested in contributing? Visit: https://github.com/VeritasChain/vcp-spec', 'color: #10b981; font-size: 12px;');

  // ===== Navigation =====
  // Navigation is handled by vcp-header.js web component
  // No additional navigation code needed here

  // ===== Initialize =====
  console.log('✅ VCP Website initialized');
})();
