const dataFiles = {
  site: 'data/site.json',
  profile: 'data/profile.json',
  projects: 'data/projects.json',
  uiConfig: 'data/ui-config.json'
};

const state = {
  site: null,
  profile: null,
  projects: null,
  uiConfig: null,
  skillsPage: 0,
  projectsPage: 0,
  activeFilter: 'All'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    entry.target.querySelectorAll('.skill-bar[data-progress]').forEach(bar => {
      bar.style.width = bar.dataset.progress + '%';
    });
    entry.target.querySelectorAll('.stat-value[data-target]').forEach(stat => {
      countUp(stat, stat.dataset.target);
    });
  });
}, { threshold: 0.12 });

function addReveal(element, classes = []) {
  element.classList.add('reveal', ...classes);
  observer.observe(element);
}

function countUp(el, target) {
  const parsed = parseInt(target, 10);
  const suffix = target.replace(parsed.toString(), '');
  if (isNaN(parsed)) { el.textContent = target; return; }
  let current = 0;
  const step = Math.max(1, Math.ceil(parsed / 60));
  const interval = setInterval(() => {
    current += step;
    if (current >= parsed) {
      current = parsed;
      clearInterval(interval);
    }
    el.textContent = current + suffix;
  }, 20);
}

function formatDuration(duration) {
  if (!duration || !duration.from) return '';
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const format = (value) => {
    const [year, month] = value.split('-').map(Number);
    return `${months[month - 1]} ${year}`;
  };
  return `${format(duration.from)}${duration.to ? ` → ${format(duration.to)}` : ' → Present'}`;
}

function applyTheme(isDark) {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  const themeIcon = document.getElementById('themeIcon');
  themeIcon.className = isDark ? 'bi bi-moon-stars-fill' : 'bi bi-sun-fill';
  localStorage.setItem('portfolioTheme', isDark ? 'dark' : 'light');
}

function applyFontVariables() {
  const fonts = state.uiConfig?.fonts;
  if (!fonts) return;
  const rootStyle = document.documentElement.style;
  if (fonts.pixel) rootStyle.setProperty('--font-pixel', fonts.pixel);
  if (fonts.head) rootStyle.setProperty('--font-head', fonts.head);
  if (fonts.body) rootStyle.setProperty('--font-body', fonts.body);
}

function loadTheme() {
  const stored = localStorage.getItem('portfolioTheme');
  if (stored) return stored === 'dark';
  return true;
}

function updateMeta(site) {
  document.title = site.title;
  const description = document.querySelector('meta[name="description"]');
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  const ogImage = document.querySelector('meta[property="og:image"]');
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (description) description.content = site.description;
  if (ogTitle) ogTitle.content = site.title;
  if (ogDescription) ogDescription.content = site.description;
  if (ogImage) ogImage.content = site.ogImage;
  if (ogUrl) ogUrl.content = site.url;
  document.querySelector('link[rel="icon"]').href = site.favicon;
}

function setHeroContent() {
  const profile = state.profile;
  document.getElementById('heroName').textContent = profile.hero.name;
  document.getElementById('navBrand').textContent = profile.hero.name.split(' ')[0].toUpperCase() + '.DEV';
  document.getElementById('footerBrand').textContent = profile.hero.name.split(' ')[0].toUpperCase() + '.DEV';
  const heroCtas = document.getElementById('heroCtas');
  heroCtas.innerHTML = `
    <a href="#projects" class="btn-cyber"><i class="bi bi-grid-3x3-gap-fill"></i> ${profile.hero.cta}</a>
    <a href="${profile.about.cvLink}" class="btn-cyber btn-cyber-gold" id="heroCvBtn"><i class="bi bi-file-earmark-person-fill"></i> View CV</a>
  `;
  renderStats();
  setAbout();
}

function renderStats() {
  const statsWrap = document.getElementById('rpgStats');
  statsWrap.innerHTML = '';
  state.profile.stats.forEach((item, index) => {
    const value = item.value === 'auto' ? calculateYears(item.startDate) : item.value;
    const card = document.createElement('div');
    card.className = `stat-card reveal scale-up reveal-delay-${index + 1}`;
    card.innerHTML = `
      <div class="stat-icon">${item.icon}</div>
      <div class="stat-value" data-target="${value}">${value}</div>
      <div class="stat-label">${item.label}</div>
    `;
    statsWrap.appendChild(card);
    observer.observe(card);
  });
}

function calculateYears(dateString) {
  if (!dateString) return '0+';
  const [year, month] = dateString.split('-').map(Number);
  const start = new Date(year, month - 1);
  const diff = (new Date() - start) / (1000 * 60 * 60 * 24 * 365.25);
  return `${Math.max(0, Math.floor(diff))}+`;
}

function setAbout() {
  const about = state.profile.about;
  document.getElementById('aboutTitle').textContent = state.site.sectionTitles.about;
  document.getElementById('aboutDesc').innerHTML = about.description;
  document.getElementById('aboutQuote').textContent = `"${about.quote}"`;
  document.getElementById('aboutCvBtn').href = about.cvLink;
  document.getElementById('navCvBtn').href = about.cvLink;
  document.getElementById('mobileCvBtn').href = about.cvLink;
  const avatar = document.getElementById('aboutAvatar');
  if (about.avatar) {
    avatar.innerHTML = '';
    const img = document.createElement('img');
    img.src = about.avatar;
    img.style.transform = `scale(${about.avatarZoom})`;
    avatar.appendChild(img);
  }
}

function renderHighlights() {
  const container = document.getElementById('highlightsList');
  container.innerHTML = '';
  state.projects.highlights.forEach((item, index) => {
    const reverse = index % 2 !== 0;
    const wrapper = document.createElement('div');
    wrapper.className = `highlight-item${reverse ? ' reverse' : ''}`;
    wrapper.innerHTML = `
      <div class="highlight-media reveal ${reverse ? 'from-right' : 'from-left'}" data-highlight-index="${index}">
        <div>${item.emoji || '🎨'}</div>
      </div>
      <div class="highlight-info reveal ${reverse ? 'from-left' : 'from-right'}">
        <div class="highlight-tags">${(item.tech || []).slice(0, 4).map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
        <h3 class="highlight-title">${item.title}</h3>
        <p class="highlight-desc">${item.desc}</p>
        <button class="btn-cyber" data-highlight-index="${index}"><i class="bi bi-arrow-right-circle-fill"></i> Detail</button>
      </div>
    `;
    container.appendChild(wrapper);
    wrapper.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  });
}

function renderSkills() {
  const skills = state.profile.skills;
  const pageSize = 6;
  const start = state.skillsPage * pageSize;
  const current = skills.slice(start, start + pageSize);
  const grid = document.getElementById('skillsGrid');
  grid.innerHTML = '';
  current.forEach((skill, index) => {
    const card = document.createElement('div');
    card.className = `cyber-card skill-card reveal reveal-delay-${(index % 3) + 1}`;
    card.innerHTML = `
      <i class="bi ${skill.icon} skill-icon"></i>
      <div class="skill-title">${skill.title}</div>
      <div class="skill-desc">${skill.desc}</div>
      <div class="skill-bar-wrap"><div class="skill-bar" data-progress="${skill.progress || 70}"></div></div>
    `;
    grid.appendChild(card);
    observer.observe(card);
  });
  renderSkillsPagination(pageSize);
}

function renderSkillsPagination(pageSize) {
  const wrap = document.getElementById('skillsPagination');
  const pages = Math.ceil(state.profile.skills.length / pageSize);
  wrap.innerHTML = '';
  if (pages <= 1) return;
  const prev = document.createElement('button');
  prev.className = 'page-btn nav-page';
  prev.textContent = '‹';
  prev.onclick = () => {
    if (state.skillsPage > 0) { state.skillsPage--; renderSkills(); }
  };
  wrap.appendChild(prev);
  for (let i = 0; i < pages; i += 1) {
    const button = document.createElement('button');
    button.className = `page-btn${state.skillsPage === i ? ' active' : ''}`;
    button.textContent = `${i + 1}`;
    button.onclick = () => { state.skillsPage = i; renderSkills(); };
    wrap.appendChild(button);
  }
  const next = document.createElement('button');
  next.className = 'page-btn nav-page';
  next.textContent = '›';
  next.onclick = () => {
    if (state.skillsPage < pages - 1) { state.skillsPage++; renderSkills(); }
  };
  wrap.appendChild(next);
}

function setupProjectFilters() {
  const categories = state.projects.projectCategories.map(category => ({
    id: category.id,
    label: category.label
  }));
  const bar = document.getElementById('filterBar');
  bar.innerHTML = '';
  categories.forEach((category) => {
    const btn = document.createElement('button');
    btn.className = `filter-btn${state.activeFilter === category.id ? ' active' : ''}`;
    btn.textContent = category.label;
    btn.onclick = () => {
      state.activeFilter = category.id;
      state.projectsPage = 0;
      renderProjects();
      setupProjectFilters();
    };
    bar.appendChild(btn);
  });
}

function getCurrentProjectList() {
  if (state.activeFilter === 'All') {
    return state.projects.projectCategories
      .filter(c => c.id !== 'All')
      .flatMap(c => c.projects.map(project => ({...project, category: c.label})));
  }
  const category = state.projects.projectCategories.find(c => c.id === state.activeFilter);
  return category ? category.projects.map(project => ({...project, category: category.label})) : [];
}

function renderProjects() {
  const all = getCurrentProjectList();
  const pageSize = 6;
  const start = state.projectsPage * pageSize;
  const current = all.slice(start, start + pageSize);
  const grid = document.getElementById('projectsGrid');
  grid.innerHTML = '';
  if (!current.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--text-dim);font-family:var(--font-head);padding:48px;">No projects in this category yet.</div>';
    renderProjectPagination(all.length, pageSize);
    return;
  }
  current.forEach((project, index) => {
    const card = document.createElement('div');
    card.className = `cyber-card project-card reveal reveal-delay-${(index % 3) + 1}`;
    card.innerHTML = `
      <div class="project-thumb"><div class="project-thumb-placeholder">${project.emoji || '🖼️'}</div></div>
      <div class="project-info">
        <div class="project-title">${project.title}</div>
        <div class="project-desc">${project.desc}</div>
        <div class="tech-tags">${(project.tech || []).map(t => `<span class="tag">${t}</span>`).join('')}</div>
        <button class="btn-cyber btn-cyber-sm" data-category="${project.category}" data-index="${start + index}"><i class="bi bi-eye-fill"></i> Detail</button>
      </div>
    `;
    const button = card.querySelector('button');
    button.addEventListener('click', () => openProjectModal(project));
    grid.appendChild(card);
    observer.observe(card);
  });
  renderProjectPagination(all.length, pageSize);
}

function renderProjectPagination(total, pageSize) {
  const wrap = document.getElementById('projectsPagination');
  const pages = Math.ceil(total / pageSize);
  wrap.innerHTML = '';
  if (pages <= 1) return;
  const prev = document.createElement('button');
  prev.className = 'page-btn nav-page';
  prev.textContent = '‹';
  prev.onclick = () => {
    if (state.projectsPage > 0) { state.projectsPage -= 1; renderProjects(); }
  };
  wrap.appendChild(prev);
  for (let i = 0; i < pages; i += 1) {
    const button = document.createElement('button');
    button.className = `page-btn${state.projectsPage === i ? ' active' : ''}`;
    button.textContent = `${i + 1}`;
    button.onclick = () => { state.projectsPage = i; renderProjects(); };
    wrap.appendChild(button);
  }
  const next = document.createElement('button');
  next.className = 'page-btn nav-page';
  next.textContent = '›';
  next.onclick = () => {
    if (state.projectsPage < pages - 1) { state.projectsPage += 1; renderProjects(); }
  };
  wrap.appendChild(next);
}

function renderTimeline() {
  const container = document.getElementById('timeline');
  container.innerHTML = '';
  state.profile.timeline.forEach((item, index) => {
    const side = index % 2 === 0 ? 'left' : 'right';
    const card = document.createElement('div');
    card.className = `timeline-item ${side}`;
    if (side === 'left') {
      card.innerHTML = `
        <div class="timeline-content reveal from-left">
          <div class="timeline-period">${item.period}</div>
          <div class="timeline-role">${item.role}</div>
          <div class="timeline-company"><i class="bi bi-building-fill"></i> ${item.company}</div>
          <div class="timeline-desc">${item.desc}</div>
        </div>
        <div class="timeline-dot-wrap"><div class="timeline-dot"></div></div>
        <div class="timeline-placeholder"></div>
      `;
    } else {
      card.innerHTML = `
        <div class="timeline-placeholder"></div>
        <div class="timeline-dot-wrap"><div class="timeline-dot"></div></div>
        <div class="timeline-content reveal from-right">
          <div class="timeline-period">${item.period}</div>
          <div class="timeline-role">${item.role}</div>
          <div class="timeline-company"><i class="bi bi-building-fill"></i> ${item.company}</div>
          <div class="timeline-desc">${item.desc}</div>
        </div>
      `;
    }
    container.appendChild(card);
    card.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  });
}

function renderFooter() {
  const footerSocials = document.getElementById('footerSocials');
  footerSocials.innerHTML = '';
  state.profile.socials.forEach(social => {
    const anchor = document.createElement('a');
    anchor.href = social.link;
    anchor.target = '_blank';
    anchor.rel = 'noopener';
    anchor.className = 'social-link';
    anchor.innerHTML = `<i class="bi ${social.icon}"></i>`;
    footerSocials.appendChild(anchor);
  });
  document.getElementById('footerCopy').textContent = `© ${state.site.copyright}`;
}

function renderContactSocials() {
  const contactSocials = document.getElementById('contactSocials');
  contactSocials.innerHTML = '';
  const items = [
    { icon: 'bi-envelope-fill', label: 'Email', value: 'alex@email.com' },
    { icon: 'bi-geo-alt-fill', label: 'Location', value: 'Ho Chi Minh City, Vietnam' }
  ];
  items.forEach(item => {
    const block = document.createElement('div');
    block.className = 'contact-info-item';
    block.innerHTML = `
      <div class="contact-info-icon"><i class="bi ${item.icon}"></i></div>
      <div><div style="font-family:var(--font-head);font-size:11px;color:var(--text-dim);letter-spacing:1px;margin-bottom:2px;">${item.label}</div><div style="font-size:14px;color:var(--text);">${item.value}</div></div>
    `;
    contactSocials.appendChild(block);
  });
}

function openProjectModal(project) {
  const modal = document.getElementById('projectModal');
  const videoWrap = document.getElementById('modalVideoWrap');
  if (project.video) {
    videoWrap.innerHTML = `<video src="${project.video}" autoplay muted loop playsinline></video>`;
  } else if (project.image) {
    videoWrap.innerHTML = `<img src="${project.image}" alt="${project.title}" />`;
  } else {
    videoWrap.innerHTML = `<div class="modal-video-placeholder">${project.emoji || '🎨'}</div>`;
  }
  const badges = document.getElementById('modalBadges');
  badges.innerHTML = '';
  if (project.duration) badges.innerHTML += `<span class="modal-badge">${state.uiConfig.modal.badges.duration.icon} ${formatDuration(project.duration)}</span>`;
  if (project.role) badges.innerHTML += `<span class="modal-badge">${state.uiConfig.modal.badges.role.icon} ${project.role}</span>`;
  document.getElementById('modalTitle').textContent = project.title;
  document.getElementById('modalDesc').innerHTML = project.detail || project.desc;
  document.getElementById('modalTags').innerHTML = (project.tech || []).map(tag => `<span class="tag">${tag}</span>`).join('');
  document.getElementById('modalProcess').innerHTML = project.designProcess && project.designProcess.length ? `
    <div class="modal-section-title">${state.uiConfig.modal.sections.designProcess.icon} ${state.uiConfig.modal.sections.designProcess.title}</div>
    <div class="modal-process-steps">
      ${project.designProcess.map((step, stepIndex) => `
        <div class="process-step">
          <div class="process-step-num">0${stepIndex + 1}</div>
          <div><div class="process-step-label">${step.step}</div><div class="process-step-desc">${step.desc}</div></div>
        </div>
      `).join('')}
    </div>
  ` : '';
  document.getElementById('modalImpacts').innerHTML = project.impacts && project.impacts.length ? `
    <div class="modal-section-title">${state.uiConfig.modal.sections.impacts.icon} ${state.uiConfig.modal.sections.impacts.title}</div>
    <div class="modal-impacts">
      ${project.impacts.map(impact => `
        <div class="impact-card"><div class="impact-label">${impact.label}</div><div class="impact-desc">${impact.desc}</div></div>
      `).join('')}
    </div>
  ` : '';
  document.getElementById('modalStoreBtns').innerHTML = '';
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('projectModal');
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

function bindInteractions() {
  document.getElementById('themeToggle').addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    applyTheme(!isDark);
  });
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('show');
  });
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('show');
    });
  });
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
    setActiveNavLink();
  });
  document.getElementById('projectModal').addEventListener('click', (event) => {
    if (event.target.id === 'projectModal') closeModal();
  });
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (event) => {
      const targetId = event.currentTarget.getAttribute('href').replace('#', '');
      const target = document.getElementById(targetId);
      if (target) {
        event.preventDefault();
        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
      }
    });
  });
  document.getElementById('contactForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    const original = button.innerHTML;
    button.innerHTML = '<i class="bi bi-hourglass-split"></i> Sending...';
    setTimeout(() => {
      button.disabled = false;
      button.innerHTML = original;
      document.getElementById('formSuccess').classList.add('show');
      form.reset();
      setTimeout(() => document.getElementById('formSuccess').classList.remove('show'), 4000);
    }, 1400);
  });
}

function setActiveNavLink() {
  const sections = ['hero', 'highlights', 'about', 'skills', 'projects', 'experience', 'contact'];
  let active = sections[0];
  sections.forEach((id) => {
    const section = document.getElementById(id);
    if (!section) return;
    if (window.scrollY >= section.offsetTop - 120) active = id;
  });
  document.querySelectorAll('#navLinks a').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${active}`);
  });
}

function runLoader() {
  const bar = document.getElementById('loadingBar');
  let progress = 0;
  const interval = setInterval(() => {
    progress = Math.min(progress + Math.random() * 18, 96);
    bar.style.width = `${progress}%`;
  }, 120);
  window.addEventListener('load', () => {
    setTimeout(() => {
      clearInterval(interval);
      bar.style.width = '100%';
      setTimeout(() => document.getElementById('loading-screen').classList.add('hidden'), 400);
    }, 800);
  });
}

function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let width = window.innerWidth;
  let height = window.innerHeight;
  const particles = [];
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();
  function createParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 0.5,
      o: Math.random() * 0.5 + 0.1,
      c: Math.random() > 0.5 ? '#00eaff' : '#b14cff'
    };
  }
  for (let i = 0; i < 90; i += 1) particles.push(createParticle());
  function draw() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((particle) => {
      ctx.globalAlpha = particle.o;
      ctx.fillStyle = particle.c;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      ctx.fill();
      particle.x += particle.vx;
      particle.y += particle.vy;
      if (particle.x < 0 || particle.x > width || particle.y < 0 || particle.y > height) {
        Object.assign(particle, createParticle());
      }
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
}

function startTyping() {
  const element = document.getElementById('typingText');
  const config = state.uiConfig.typing;
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const phrase = config.phrases[phraseIndex];
    if (deleting) {
      charIndex -= 1;
      element.textContent = phrase.substring(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % config.phrases.length;
        setTimeout(tick, 300);
        return;
      }
    } else {
      charIndex += 1;
      element.textContent = phrase.substring(0, charIndex);
      if (charIndex === phrase.length) {
        setTimeout(() => { deleting = true; tick(); }, config.pauseDuration);
        return;
      }
    }
    setTimeout(tick, deleting ? config.deleteSpeed : config.typeSpeed);
  }
  setTimeout(tick, config.startDelay);
}

async function loadData() {
  const responses = await Promise.all(Object.values(dataFiles).map(url => fetch(url).then(resp => resp.json())));
  state.site = responses[0];
  state.profile = responses[1];
  state.projects = responses[2];
  state.uiConfig = responses[3];
  state.projects.projectCategories = state.projects.projectCategories.map(category => ({
    ...category,
    projects: category.projects || []
  }));
}

async function init() {
  runLoader();
  initParticles();
  bindInteractions();
  await loadData();
  updateMeta(state.site);
  applyTheme(loadTheme());
  applyFontVariables();
  setHeroContent();
  renderHighlights();
  renderSkills();
  setupProjectFilters();
  renderProjects();
  renderTimeline();
  renderFooter();
  renderContactSocials();
  startTyping();
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  window.addEventListener('load', setActiveNavLink);
}

init().catch((error) => {
  console.error('Failed to initialize portfolio:', error);
  document.getElementById('loading-screen').classList.add('hidden');
});
