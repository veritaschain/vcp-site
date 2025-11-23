// VeritasChain Protocol - Solutions for Exchanges & Brokers
// Interactive functionality

document.addEventListener('DOMContentLoaded', function() {
  console.log('VeritasChain Protocol (VCP) - Solutions for Exchanges & Brokers');
  console.log('Version: 1.0');
  console.log('Loading interactive features...');

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all major sections
  document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
  });

  // Navigation background opacity on scroll
  const nav = document.querySelector('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      nav.classList.add('shadow-lg');
    } else {
      nav.classList.remove('shadow-lg');
    }

    lastScroll = currentScroll;
  });

  // Highlight active navigation link
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  function highlightNavigation() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-vcp-primary', 'font-bold');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('text-vcp-primary', 'font-bold');
      }
    });
  }

  window.addEventListener('scroll', highlightNavigation);

  // Add hover effects to cards
  const cards = document.querySelectorAll('.hover-lift');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px)';
    });
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // Count-up animation for statistics
  function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      element.textContent = value + (element.dataset.suffix || '');
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  // Track tier comparison interactions
  const tierCards = document.querySelectorAll('[id^="tiers"] .transform');
  tierCards.forEach(card => {
    card.addEventListener('click', function() {
      console.log('Tier card clicked:', this.querySelector('h3')?.textContent);
      // Future: Send analytics event
    });
  });

  // Track CTA button clicks
  const ctaButtons = document.querySelectorAll('a[href*="contact"], a[href*="mailto"]');
  ctaButtons.forEach(button => {
    button.addEventListener('click', function() {
      console.log('CTA clicked:', this.textContent.trim());
      // Future: Send conversion tracking event
    });
  });

  // Enhance table responsiveness
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const wrapper = document.createElement('div');
    wrapper.className = 'overflow-x-auto';
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });

  // Add copy functionality to code blocks
  const codeBlocks = document.querySelectorAll('code, pre');
  codeBlocks.forEach(block => {
    block.style.cursor = 'pointer';
    block.title = 'Click to copy';
    block.addEventListener('click', function() {
      const text = this.textContent;
      navigator.clipboard.writeText(text).then(() => {
        const originalText = this.textContent;
        this.textContent = 'Copied!';
        setTimeout(() => {
          this.textContent = originalText;
        }, 1500);
      });
    });
  });

  // Keyboard navigation enhancement
  document.addEventListener('keydown', function(e) {
    // Press 'Escape' to return to top
    if (e.key === 'Escape') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // Add "Back to Top" button
  const backToTopButton = document.createElement('button');
  backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
  backToTopButton.className = 'fixed bottom-8 right-8 bg-vcp-primary text-white w-12 h-12 rounded-full shadow-lg hover:bg-blue-700 transition-all opacity-0 pointer-events-none z-50';
  backToTopButton.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(backToTopButton);

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopButton.style.opacity = '1';
      backToTopButton.style.pointerEvents = 'auto';
    } else {
      backToTopButton.style.opacity = '0';
      backToTopButton.style.pointerEvents = 'none';
    }
  });

  backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Log page load complete
  console.log('✓ Page loaded successfully');
  console.log('✓ Interactive features initialized');
  console.log('Target Markets: CEX, DEX, FX/CFD Brokers, DeFi');
  console.log('Compliance Tiers: Platinum (HFT), Gold (Institutional)');
  console.log('Regulatory Support: MiFID II, EU AI Act, GDPR');
});

// Expose VCP API info for testing
window.VCP = {
  version: '1.0',
  page: 'Solutions for Exchanges & Brokers',
  tiers: ['Platinum', 'Gold'],
  regulations: ['MiFID II RTS 25', 'MiFID II RTS 27/28', 'EU AI Act', 'GDPR'],
  targetMarkets: ['CEX', 'DEX', 'FX/CFD Brokers', 'DeFi', 'Dark Pools'],
  technicalFeatures: [
    'UUID v7 for time-series integrity',
    'IEEE 754 problem solved (string encoding)',
    'PTPv2 clock synchronization (Platinum)',
    'Ed25519 digital signatures',
    'Post-quantum crypto agility',
    'Merkle tree anchoring',
    'Crypto-shredding for GDPR'
  ]
};

console.log('VCP API available at window.VCP');
