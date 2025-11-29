// VeritasChain Explorer Frontend JavaScript

document.addEventListener('DOMContentLoaded', function() {
  console.log('VeritasChain Explorer initialized');
  
  // Initialize all interactive features
  initLanguageSwitcher();
  initSearch();
  initCountUpAnimation();
  initCopyButtons();
  initEventRowClick();
  initLiveStats();
});

// Language switcher
function initLanguageSwitcher() {
  const currentPath = window.location.pathname;
  const langSwitches = document.querySelectorAll('.lang-switch');
  
  langSwitches.forEach(link => {
    const lang = link.getAttribute('data-lang');
    
    // Highlight current language
    if ((currentPath.includes('/explorer/') && lang === 'en' && !currentPath.includes('/ja') && !currentPath.includes('/zh')) ||
        (currentPath.includes('/ja') && lang === 'ja') ||
        (currentPath.includes('/zh') && lang === 'zh')) {
      link.classList.add('bg-cyan-500', 'text-white');
      link.classList.remove('hover:bg-slate-700');
    }
  });
  
  // Mobile menu toggle
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

// Search functionality
function initSearch() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;
  
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      const query = searchInput.value.trim();
      if (query) {
        handleSearch(query);
      }
    }
  });
}

function handleSearch(query) {
  console.log('Searching for:', query);
  // In a real implementation, this would query the API
  alert(`Search functionality coming soon!\nSearching for: ${query}\n\nThis will query the VCP API endpoint:\nGET /v1/events/${query}`);
}

// Count-up animation for stats
function initCountUpAnimation() {
  const countElements = document.querySelectorAll('.count-up');
  
  countElements.forEach(element => {
    const target = parseInt(element.getAttribute('data-target') || element.textContent.replace(/,/g, ''));
    animateCount(element, 0, target, 2000);
  });
}

function animateCount(element, start, end, duration) {
  const increment = (end - start) / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= end) {
      current = end;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current).toLocaleString();
  }, 16);
}

// Copy button functionality
function initCopyButtons() {
  // Copy JSON payload
  const copyBtn = document.querySelector('.btn-copy');
  if (copyBtn) {
    copyBtn.addEventListener('click', function() {
      const codeBlock = this.closest('.code-block-container').querySelector('code');
      copyToClipboard(codeBlock.textContent, this);
    });
  }
  
  // Copy API command
  const copyApiBtn = document.querySelector('.btn-copy-api');
  if (copyApiBtn) {
    copyApiBtn.addEventListener('click', function() {
      const codeBlock = this.closest('.code-block-container').querySelector('code');
      copyToClipboard(codeBlock.textContent, this);
    });
  }
}

function copyToClipboard(text, button) {
  navigator.clipboard.writeText(text).then(() => {
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check mr-1"></i>Copied!';
    button.classList.add('text-green-400');
    
    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.classList.remove('text-green-400');
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy:', err);
    alert('Failed to copy to clipboard');
  });
}

// Event row click handler
function initEventRowClick() {
  const eventRows = document.querySelectorAll('tbody tr[data-event-id]');
  
  eventRows.forEach(row => {
    row.addEventListener('click', function() {
      const eventId = this.getAttribute('data-event-id');
      showEventDetails(eventId);
    });
  });
}

function showEventDetails(eventId) {
  console.log('Event clicked:', eventId);
  // In a real implementation, this would fetch and display detailed event data
  alert(`Event Details\n\nEventID: ${eventId}\n\nIn a live implementation, this would:\n1. Fetch full event data from API\n2. Display complete payload\n3. Show Merkle proof path\n4. Verify cryptographic signatures\n5. Link to blockchain anchor\n\nAPI Endpoint:\nGET /v1/events/${eventId}`);
}

// Simulate live stats updates (for demo purposes)
function initLiveStats() {
  // In a real implementation, this would connect to WebSocket
  // wss://api.veritaschain.org/v1/stream/stats
  
  setInterval(() => {
    updateLiveStats();
  }, 5000); // Update every 5 seconds for demo
}

function updateLiveStats() {
  // Simulate small increments to stats
  const totalEventsElement = document.querySelector('.count-up');
  if (totalEventsElement) {
    const currentValue = parseInt(totalEventsElement.textContent.replace(/,/g, ''));
    const newValue = currentValue + Math.floor(Math.random() * 100) + 50;
    totalEventsElement.textContent = newValue.toLocaleString();
  }
  
  // Update last anchor time
  const anchorTimeElements = document.querySelectorAll('.stat-card .text-gray-500');
  anchorTimeElements.forEach(element => {
    if (element.textContent.includes('mins ago')) {
      const randomMins = Math.floor(Math.random() * 5) + 1;
      element.textContent = `${randomMins} mins ago`;
    }
  });
  
  console.log('Live stats updated');
}

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

// Add hover effect to merkle tree nodes
const merkleNodes = document.querySelectorAll('.merkle-tree > div > div > div');
merkleNodes.forEach(node => {
  node.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.05)';
    this.style.transition = 'all 0.2s ease';
  });
  
  node.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
  });
});

// Console banner
console.log('%c🔗 VeritasChain Explorer', 'color: #06b6d4; font-size: 20px; font-weight: bold;');
console.log('%cVerify the Market. One Event at a Time.', 'color: #64748b; font-size: 14px;');
console.log('%cAPI: https://api.veritaschain.org/v1/', 'color: #10b981; font-size: 12px;');
console.log('%cDocs: https://docs.veritaschain.org', 'color: #10b981; font-size: 12px;');
