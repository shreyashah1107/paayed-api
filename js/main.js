document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header.header');

  if (header) {
    document.addEventListener('scroll', () => {
      header.classList.toggle('shadow-sm', window.scrollY > 0);
    });
  }

  const initSidebar = () => {
    const sidebar = document.querySelector('.sidebar-nav');
    if (!sidebar) return;

    const navGroups = sidebar.querySelectorAll('.nav-group');
    const navLinks = sidebar.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname.split('/').pop();
    let matchedLink = null;
    let matchedGroup = null;

    navGroups.forEach(group => {
      group.classList.remove('show');
      group.setAttribute('aria-expanded', 'false');
    });
    navLinks.forEach(link => link.classList.remove('active'));

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      const linkPath = href.split('/').pop();
      if (linkPath === currentPath) {
        matchedLink = link;
        matchedGroup = link.closest('.nav-group');
      }
    });

    if (matchedLink) {
      matchedLink.classList.add('active');
      if (matchedGroup) {
        matchedGroup.classList.add('show');
        matchedGroup.setAttribute('aria-expanded', 'true');
      }
    }

    else if (navGroups.length > 0) {
      const firstGroup = navGroups[0];
      firstGroup.classList.add('show');
      firstGroup.setAttribute('aria-expanded', 'true');
    }

    else {
      const firstLink = sidebar.querySelector('.nav-link');
      if (firstLink) firstLink.classList.add('active');
    }
  };

  setTimeout(initSidebar, 100);

  document.addEventListener('click', e => {
    const link = e.target.closest('.nav-link');
    if (!link) return;

    if (link.closest('.nav-group-items')) {
      e.preventDefault();
    }

    document.querySelectorAll('.nav-link.active').forEach(el => el.classList.remove('active'));

    if (!link.classList.contains('nav-group-toggle')) {
      link.classList.add('active');
    }
  });
});
