document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const themeToggle = document.querySelector('.theme-toggle');
  const nav = document.querySelector('.main-nav');
  const navLinks = [...nav.querySelectorAll('a')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const skillLevels = ['88%', '82%', '70%', '64%', '76%', '60%', '72%', '58%'];
  document.querySelectorAll('.skill').forEach((skill, index) => skill.style.setProperty('--skill-level', skillLevels[index] || '50%'));

  const setTheme = nightMode => {
    document.body.classList.toggle('night-mode', nightMode);
    themeToggle.setAttribute('aria-pressed', String(nightMode));
    themeToggle.setAttribute('aria-label', nightMode ? 'Switch to day mode' : 'Switch to night mode');
    themeToggle.innerHTML = `<i data-lucide="${nightMode ? 'sun' : 'moon'}"></i>`;
    lucide.createIcons();
  };
  setTheme(localStorage.getItem('sokry-theme') === 'night');
  themeToggle.addEventListener('click', () => {
    const nightMode = !document.body.classList.contains('night-mode');
    setTheme(nightMode);
    localStorage.setItem('sokry-theme', nightMode ? 'night' : 'day');
  });

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.innerHTML = `<i data-lucide="${open ? 'x' : 'menu'}"></i>`;
    lucide.createIcons();
  });
  navLinks.forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<i data-lucide="menu"></i>';
    lucide.createIcons();
  }));
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 30), { passive: true });

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
  sections.forEach(section => sectionObserver.observe(section));

  // CV Download Functions
  window.downloadCVMenu = function() {
    const format = prompt('Choose download format:\n1. HTML\n2. PDF\n3. Print', '1');
    if (format === '1') {
      downloadCVAsHTML();
    } else if (format === '2') {
      downloadCVAsPDF();
    } else if (format === '3') {
      printCV();
    }
  };

  window.downloadCVAsHTML = function() {
    const cvContent = getCVContent();
    const blob = new Blob([cvContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CV_Sokry_Ren_${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  window.downloadCVAsPDF = function() {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = function() {
      const cvContent = getCVContent();
      const element = document.createElement('div');
      element.innerHTML = cvContent;
      const opt = {
        margin: 10,
        filename: `CV_Sokry_Ren_${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
      };
      html2pdf().set(opt).from(element).save();
    };
    document.head.appendChild(script);
  };

  window.printCV = function() {
    const cvWindow = window.open('', '', 'height=1000,width=900');
    cvWindow.document.write(getCVContent());
    cvWindow.document.close();
    cvWindow.print();
  };

  function getCVContent() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV - Sokry Ren</title>
    <style>
        :root {
            --primary-color: #2c3e50;
            --secondary-color: #3498db;
            --accent-color: #e74c3c;
            --text-color: #333;
            --light-bg: #ecf0f1;
            --border-color: #bdc3c7;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: var(--text-color); background-color: white; line-height: 1.6; }
        .cv-container { max-width: 850px; margin: 0 auto; padding: 40px; }
        .cv-header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid var(--secondary-color); }
        .cv-header h1 { font-size: 32px; color: var(--primary-color); margin-bottom: 5px; }
        .job-title { font-size: 18px; color: var(--secondary-color); font-weight: 600; margin-bottom: 15px; }
        .contact-info { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; font-size: 13px; }
        .contact-info span { color: #555; }
        .cv-section { margin-bottom: 30px; }
        .section-title { font-size: 18px; color: var(--primary-color); border-bottom: 2px solid var(--secondary-color); padding-bottom: 8px; margin-bottom: 15px; font-weight: 700; }
        .experience-item, .education-item, .project-item { margin-bottom: 20px; }
        .experience-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px; }
        .experience-header h3 { font-size: 16px; color: var(--primary-color); font-weight: 700; }
        .company { font-style: italic; color: var(--secondary-color); font-weight: 600; }
        .duration { font-size: 13px; color: #666; font-weight: 500; margin-bottom: 8px; }
        .experience-item ul, .education-item ul { margin-left: 20px; margin-top: 8px; }
        .experience-item li, .education-item li { margin-bottom: 5px; color: #444; }
        .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
        .skill-category { background-color: var(--light-bg); padding: 15px; border-radius: 5px; border-left: 4px solid var(--secondary-color); }
        .skill-category h4 { color: var(--primary-color); margin-bottom: 8px; font-weight: 700; }
        .skill-category p { font-size: 14px; color: #555; line-height: 1.5; }
        .project-item h3 { font-size: 15px; color: var(--primary-color); font-weight: 700; margin-bottom: 5px; }
        .project-item p { font-size: 14px; color: #555; margin-bottom: 8px; }
        .cv-footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--border-color); font-size: 12px; color: #999; }
        @media print { .cv-container { margin: 0; padding: 0; } }
    </style>
</head>
<body>
    <div class="cv-container">
        <header class="cv-header">
            <h1>Sokry Ren</h1>
            <p class="job-title">Web Programming Student / Developer</p>
            <div class="contact-info">
                <span>📧 sokry.ren@fellow.passerellesnumeriques.org</span>
                <span>📱 +885 81 468 431</span>
                <span>📍 Phnom Penh, Cambodia</span>
            </div>
        </header>
        <section class="cv-section">
            <h2 class="section-title">Professional Summary</h2>
            <p>Passionate Web Programming student at Passerelles Numériques Cambodia. Focused on learning modern web development technologies and creating useful digital projects. Interested in web development, software development, UI design, and technology solutions.</p>
        </section>
        <section class="cv-section">
            <h2 class="section-title">Education</h2>
            <div class="education-item">
                <div class="experience-header">
                    <h3>Web Programming Student</h3>
                    <span class="company">Passerelles Numériques Cambodia</span>
                </div>
                <p class="duration">Currently Enrolled | Generation 2027</p>
                <ul>
                    <li>Learning web development technologies and best practices</li>
                    <li>Building real-world projects and portfolio</li>
                    <li>Developing skills in UI/UX design and software development</li>
                </ul>
            </div>
        </section>
        <section class="cv-section">
            <h2 class="section-title">Skills</h2>
            <div class="skills-grid">
                <div class="skill-category">
                    <h4>Web Development</h4>
                    <p>HTML5, CSS3, JavaScript, React, Web Design</p>
                </div>
                <div class="skill-category">
                    <h4>Tools & Platforms</h4>
                    <p>Git, VS Code, GitHub, Design Tools</p>
                </div>
                <div class="skill-category">
                    <h4>Soft Skills</h4>
                    <p>Problem Solving, Learning Ability, Teamwork, Communication</p>
                </div>
            </div>
        </section>
        <section class="cv-section">
            <h2 class="section-title">Projects</h2>
            <div class="project-item">
                <h3>Personal Portfolio Website</h3>
                <p class="duration">2026</p>
                <p>Built a responsive portfolio website showcasing skills and projects. Implemented modern web design principles with interactive elements.</p>
            </div>
        </section>
        <footer class="cv-footer">
            <p>References and additional projects available upon request</p>
        </footer>
    </div>
</body>
</html>`;
  }

  const role = document.querySelector('.hero-role');
  const roleText = role.textContent;
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    role.textContent = '';
    let character = 0;
    const typeRole = () => {
      if (character < roleText.length) {
        role.textContent += roleText[character++];
        window.setTimeout(typeRole, 55);
      }
    };
    window.setTimeout(typeRole, 450);
  }

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

  document.querySelector('.contact-form').addEventListener('submit', event => {
    event.preventDefault();
    const status = event.currentTarget.querySelector('.form-status');
    status.textContent = 'Thanks — your message is ready to be connected to Sokry.';
    event.currentTarget.reset();
  });
});