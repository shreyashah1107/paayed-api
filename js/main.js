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

  // Feedback popup logic
  const feedbackBlocks = document.querySelectorAll('.feedback');

  feedbackBlocks.forEach(feedback => {
    const yesBtn = feedback.querySelector('.yes');
    const noBtn = feedback.querySelector('.no');
    const popup = feedback.querySelector('.feedback-popup');
    const cancelBtn = feedback.querySelector('.btn-cancel');
    const submitBtn = feedback.querySelector('.btn-submit');

    noBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.feedback-popup.active').forEach(p => {
        if (p !== popup) p.classList.remove('active');
      });
      popup.classList.toggle('active');
    });

    [yesBtn, cancelBtn, submitBtn].forEach(btn => {
      btn.addEventListener('click', () => popup.classList.remove('active'));
    });

    document.addEventListener('click', (e) => {
      if (popup.classList.contains('active') && !popup.contains(e.target) && !noBtn.contains(e.target)) {
        popup.classList.remove('active');
      }
    });
  });

  // Copy to clipboard logic
  document.addEventListener('click', (e) => {
    const copyBtn = e.target.closest('.btn-copy');
    if (!copyBtn) return;

    const infoCard = copyBtn.closest('.info-card');
    const urls = Array.from(infoCard.querySelectorAll('.info-card-text'))
                      .map(el => el.textContent.trim())
                      .join('\n');

    navigator.clipboard.writeText(urls).then(() => {
      const original = copyBtn.innerHTML;
      copyBtn.innerHTML = '✅';
      setTimeout(() => (copyBtn.innerHTML = original), 1200);
    });
  });

  // Language dropdown logic
  const dropdowns = document.querySelectorAll('.language-dropdown');

  dropdowns.forEach(dropdown => {
    const selected = dropdown.querySelector('.dropdown-selected');
    const optionsContainer = dropdown.querySelector('.dropdown-options');
    const optionsList = dropdown.querySelectorAll('.dropdown-option');

    selected.addEventListener('click', () => {
      optionsContainer.style.display = optionsContainer.style.display === 'block' ? 'none' : 'block';
    });

    optionsList.forEach(option => {
      option.addEventListener('click', () => {
        selected.innerHTML = option.innerText + ' <span class="arrow">&#9662;</span>';
        optionsContainer.style.display = 'none';
      });
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        optionsContainer.style.display = 'none';
      }
    });
  });
});
