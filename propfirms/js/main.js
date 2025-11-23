// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.section-enter').forEach(el => {
    observer.observe(el);
  });

  // Contact form submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);
      const messageDiv = document.getElementById('form-message');
      const lang = document.documentElement.lang || 'en';
      
      // Simulate form submission (replace with actual API call in production)
      try {
        // In production: await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) })
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        messageDiv.className = 'mt-4 p-4 bg-green-100 text-green-800 rounded-lg';
        messageDiv.textContent = lang === 'ja' 
          ? 'お問い合わせを受け付けました。担当者より3営業日以内にご連絡いたします。'
          : 'Thank you for your inquiry. Our team will contact you within 3 business days.';
        messageDiv.classList.remove('hidden');
        e.target.reset();
      } catch (error) {
        messageDiv.className = 'mt-4 p-4 bg-red-100 text-red-800 rounded-lg';
        messageDiv.textContent = lang === 'ja'
          ? '送信に失敗しました。お手数ですが、info@veritaschain.orgまで直接ご連絡ください。'
          : 'Submission failed. Please contact us directly at info@veritaschain.org';
        messageDiv.classList.remove('hidden');
      }
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu if open
        if (mobileMenu) {
          mobileMenu.classList.add('hidden');
        }
      }
    });
  });
});
