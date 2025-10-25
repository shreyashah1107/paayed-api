document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header.header');

  // Optimize scroll listener with throttling
  if (header) {
    let ticking = false;
    const updateHeader = () => {
      header.classList.toggle('shadow-sm', window.scrollY > 0);
      ticking = false;
    };

    document.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    });
  }

  const initSidebar = () => {
    const sidebar = document.querySelector('.sidebar-nav');
    if (!sidebar) return;

    const navGroups = sidebar.querySelectorAll('.nav-group');
    const navLinks = sidebar.querySelectorAll('.nav-link');
    
    // Improved URL matching - handle both hash and pathname
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    let matchedLink = null;
    let matchedGroup = null;

    // Reset all states
    navGroups.forEach(group => {
      group.classList.remove('show');
      group.setAttribute('aria-expanded', 'false');
    });
    navLinks.forEach(link => link.classList.remove('active'));

    // Find matching link with improved logic
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      let isMatch = false;
      
      // Check for exact path match
      if (href === currentPath) {
        isMatch = true;
      }
      // Check for hash match
      else if (href.startsWith('#') && href === currentHash) {
        isMatch = true;
      }
      // Check for partial path match (for nested routes)
      else if (href !== '#' && currentPath.includes(href)) {
        isMatch = true;
      }

      if (isMatch) {
        matchedLink = link;
        matchedGroup = link.closest('.nav-group');
      }
    });

    // Apply matched state or fallback
    if (matchedLink) {
      matchedLink.classList.add('active');
      if (matchedGroup) {
        matchedGroup.classList.add('show');
        matchedGroup.setAttribute('aria-expanded', 'true');
      }
    } else if (navGroups.length > 0) {
      // Default to first group (Getting Started)
      const firstGroup = navGroups[0];
      firstGroup.classList.add('show');
      firstGroup.setAttribute('aria-expanded', 'true');
    }
  };

  // Wait for CoreUI to initialize
  setTimeout(initSidebar, 100);

  // Optimized click handler with delegation
  document.addEventListener('click', e => {
    const link = e.target.closest('.nav-link');
    if (!link) return;

    // Handle submenu items
    if (link.closest('.nav-group-items')) {
      e.preventDefault();
      
      // Remove active from all links
      document.querySelectorAll('.nav-link.active').forEach(el => 
        el.classList.remove('active')
      );
      
      // Add active to clicked link
      link.classList.add('active');
      return;
    }

    // Handle group toggles
    if (link.classList.contains('nav-group-toggle')) {
      const group = link.closest('.nav-group');
      if (group) {
        const isExpanded = group.classList.contains('show');
        
        // Close all groups
        document.querySelectorAll('.nav-group.show').forEach(g => {
          g.classList.remove('show');
          g.setAttribute('aria-expanded', 'false');
        });
        
        // Toggle current group
        if (!isExpanded) {
          group.classList.add('show');
          group.setAttribute('aria-expanded', 'true');
        }
      }
    }
  });
});
