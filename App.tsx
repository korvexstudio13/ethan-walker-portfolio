import React, { useEffect, useState, useRef } from 'react';

export default function App() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorLerp, setCursorLerp] = useState({ x: 0, y: 0 });
  const [cursorHover, setCursorHover] = useState(false);
  const [revealCard, setRevealCard] = useState({ show: false, x: 0, y: 0, title: '', icon: '' });

  const customCursorRef = useRef<HTMLDivElement>(null);
  const customCursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    const updateLerp = () => {
      setCursorLerp(prev => {
        const dx = cursorPos.x - prev.x;
        const dy = cursorPos.y - prev.y;
        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15
        };
      });
      animationFrameId = requestAnimationFrame(updateLerp);
    };
    animationFrameId = requestAnimationFrame(updateLerp);
    return () => cancelAnimationFrame(animationFrameId);
  }, [cursorPos]);

  useEffect(() => {
    const interactiveElements = document.querySelectorAll('a, button, .faq-trigger, .work-row, .service-card, .process-block, .why-item');
    const handleMouseEnter = () => setCursorHover(true);
    const handleMouseLeave = () => setCursorHover(false);

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleWorkRowMouseMove = (e: React.MouseEvent) => {
    setRevealCard(prev => ({
      ...prev,
      x: e.clientX + 20,
      y: e.clientY + 20
    }));
  };

  const handleWorkRowMouseEnter = (title: string, icon: string) => {
    setRevealCard(prev => ({
      ...prev,
      show: true,
      title,
      icon
    }));
  };

  const handleWorkRowMouseLeave = () => {
    setRevealCard(prev => ({
      ...prev,
      show: false
    }));
  };

  const toggleFaq = (idx: number) => {
    setActiveFaq(prev => (prev === idx ? null : idx));
  };

  return (
    <>
      {/* Grid Lines Overlay */}
      <div className="bg-grid-overlay"></div>
      <div className="noise-overlay"></div>

      {/* Custom Cursor */}
      <div 
        ref={customCursorRef} 
        className="custom-cursor"
        style={{
          left: `${cursorLerp.x}px`,
          top: `${cursorLerp.y}px`,
          width: cursorHover ? '50px' : '32px',
          height: cursorHover ? '50px' : '32px',
          borderColor: cursorHover ? 'var(--text-primary)' : 'var(--electric-blue)',
          backgroundColor: cursorHover ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
        }}
      ></div>
      <div 
        ref={customCursorDotRef} 
        className="custom-cursor-dot"
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`
        }}
      ></div>

      {/* Hover Reveal Spotlight Image Card */}
      <div 
        className="hover-reveal-card"
        style={{
          left: `${revealCard.x}px`,
          top: `${revealCard.y}px`,
          opacity: revealCard.show ? 1 : 0,
          transform: `translate(-50%, -50%) scale(${revealCard.show ? 1 : 0.85})`,
        }}
      >
        <div className="hover-reveal-inner flex flex-col items-center justify-center p-6 text-center">
          <i className={`fa-solid ${revealCard.icon} text-5xl text-[var(--electric-blue)] mb-3`}></i>
          <p className="font-['Cabinet_Grotesk'] font-bold text-lg uppercase">{revealCard.title}</p>
        </div>
      </div>

      {/* Navigation Header */}
      <header className="w-full px-[8%] py-8 flex justify-between items-center border-b-[1.5px] border-[var(--border-color)] bg-[var(--bg-dark)] z-50 relative">
        <a href="#" className="logo flex items-center font-['Cabinet_Grotesk'] font-extrabold text-[1.6rem] text-[var(--text-primary)] no-underline tracking-tighter">
          <img src="/logo.png" alt="EW Monogram" className="h-7 w-auto rounded border border-[rgba(255,255,255,0.1)] mr-3 align-middle" />
          EW<span className="text-[var(--electric-blue)]">//</span>
        </a>
        <nav className="flex gap-10">
          <a href="#about" className="text-[var(--text-secondary)] no-underline text-[0.85rem] font-medium uppercase transition duration-200 hover:text-[var(--text-primary)]">Philosophy</a>
          <a href="#services" className="text-[var(--text-secondary)] no-underline text-[0.85rem] font-medium uppercase transition duration-200 hover:text-[var(--text-primary)]">Services</a>
          <a href="#work" className="text-[var(--text-secondary)] no-underline text-[0.85rem] font-medium uppercase transition duration-200 hover:text-[var(--text-primary)]">Work</a>
          <a href="#why-me" className="text-[var(--text-secondary)] no-underline text-[0.85rem] font-medium uppercase transition duration-200 hover:text-[var(--text-primary)]">Why Me</a>
          <a href="#process" className="text-[var(--text-secondary)] no-underline text-[0.85rem] font-medium uppercase transition duration-200 hover:text-[var(--text-primary)]">Workflow</a>
          <a href="#faq" className="text-[var(--text-secondary)] no-underline text-[0.85rem] font-medium uppercase transition duration-200 hover:text-[var(--text-primary)]">FAQ</a>
        </nav>
        <a href="https://korvex6.gumroad.com/l/mprfco" target="_blank" className="btn-header px-6 py-2.5 border-[1.5px] border-[var(--text-primary)] text-[var(--text-primary)] no-underline font-semibold text-xs uppercase transition duration-200 hover:bg-[var(--text-primary)] hover:text-[var(--bg-dark)] hover:shadow-[4px_4px_0px_var(--electric-blue)] hover:-translate-x-0.5 hover:-translate-y-0.5">Book a call</a>
      </header>

      {/* Endless Scrolling Marquee */}
      <div className="marquee-container w-full bg-[var(--electric-blue)] text-[var(--bg-dark)] overflow-hidden border-b-[1.5px] border-[var(--border-color)] py-3.5 flex whitespace-nowrap">
        <div className="marquee-content inline-block text-lg font-extrabold tracking-wider uppercase">
          NEXT.JS // FIGMA // UI/UX DESIGN // FULL STACK CODE // REACT // WEB ARCHITECTURE // TYPESCRIPT // SECURE APIS // NEXT.JS // FIGMA // UI/UX DESIGN // FULL STACK CODE // REACT // WEB ARCHITECTURE // TYPESCRIPT // SECURE APIS
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero min-h-[80vh] grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-[60px] items-center px-[8%] py-24 border-b-[1.5px] border-[var(--border-color)] relative" id="hero">
        <div className="hero-content">
          <h1 className="hero-title font-['Cabinet_Grotesk'] text-[3.5rem] md:text-[5.5rem] font-extrabold leading-[0.95] tracking-tighter mb-8 uppercase">
            BUILDING <br />
            <span className="text-transparent" style={{ WebkitTextStroke: '1.5px var(--text-primary)' }}>VISUAL LOGIC</span>
          </h1>
          <p className="hero-desc text-[1.05rem] text-[var(--text-secondary)] mb-10 max-w-[580px] leading-[1.7]">
            I engineer clean, high-performance web applications and design custom interface blueprints. Fusing Figma visual systems with React and Next.js developer logic to launch custom sites.
          </p>
          <div className="hero-actions flex gap-6">
            <a href="https://korvex6.gumroad.com/l/mprfco" target="_blank" className="btn-brutal inline-flex items-center gap-3 bg-[var(--text-primary)] text-[var(--bg-dark)] border-[1.5px] border-[var(--text-primary)] px-9 py-4 font-['Cabinet_Grotesk'] font-extrabold text-[1.1rem] no-underline uppercase transition duration-200 shadow-[6px_6px_0px_var(--electric-blue)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[9px_9px_0px_var(--text-primary)]">Book a call <i className="fa-solid fa-arrow-right"></i></a>
            <a href="#work" className="btn-brutal-sec inline-flex items-center gap-3 bg-transparent text-[var(--text-primary)] border-[1.5px] border-[var(--border-color)] px-9 py-4 font-['Cabinet_Grotesk'] font-extrabold text-[1.1rem] no-underline uppercase transition duration-200 hover:border-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.03)] hover:-translate-x-0.5 hover:-translate-y-0.5">Explore Work</a>
          </div>
        </div>
        <div 
          className="hero-visual border-[1.5px] border-[var(--border-color)] rounded aspect-[0.85] bg-[rgba(255,255,255,0.01)] relative flex items-center justify-center overflow-hidden shadow-[8px_8px_0px_rgba(255,255,255,0.02)]"
          style={{ backgroundImage: `url('/hero.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="w-full h-full p-6 bg-[rgba(0,0,0,0.55)] flex flex-col justify-between rounded-[3px]">
            <div className="text-[0.7rem] text-[var(--text-secondary)] uppercase font-semibold">// LIVE_PORTFOLIO_ENGINE_V1</div>
            <div className="wireframe-box flex items-center justify-between px-4 h-[60px] border-[1.5px] border-[var(--electric-blue)] text-xs text-[var(--electric-blue)] font-bold bg-[rgba(0,210,255,0.02)] backdrop-blur-[8px]">
              <span>INTERFACE_DASHBOARD_LIVE</span>
              <i className="fa-solid fa-desktop"></i>
            </div>
            <div className="flex justify-between text-[0.65rem] text-[var(--text-secondary)] font-semibold">
              <span>[ PORT: 8080 ]</span>
              <span>[ STATUS: ACTIVE ]</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="reveal px-[8%] py-24 border-b-[1.5px] border-[var(--border-color)] relative">
        <div className="section-split grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-20">
          <div className="section-label font-bold text-[0.85rem] text-[var(--electric-blue)] uppercase tracking-wider sticky top-10 self-start">01 / Philosophy</div>
          <div>
            <h2 className="about-headline font-['Cabinet_Grotesk'] text-[2.2rem] md:text-[3.2rem] font-extrabold leading-[1.05] uppercase mb-8">Engineering is design. Design is logic.</h2>
            <p className="about-body text-[1.1rem] text-[var(--text-secondary)] leading-[1.75] mb-6">
              I reject the divide between aesthetics and technical systems. A portfolio or application shouldn't just look visually rich — it must be architected with semantic code, lightning-fast rendering, and interactive fluidity.
            </p>
            <p className="about-body text-[0.95rem] text-[var(--text-secondary)] leading-[1.75] mb-6">
              Working with Next.js, Figma, and robust APIs, I take full ownership of the pipeline. I create clean, structured visual blueprints and develop them into responsive, production-ready web spaces with zero translation loss.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="reveal px-[8%] py-24 border-b-[1.5px] border-[var(--border-color)] relative">
        <div className="section-split grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-20">
          <div className="section-label font-bold text-[0.85rem] text-[var(--electric-blue)] uppercase tracking-wider sticky top-10 self-start">02 / Services</div>
          <div className="services-list grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="service-card border-[1.5px] border-[var(--border-color)] p-10 flex flex-col justify-between aspect-[1.1] transition duration-200 bg-[rgba(255,255,255,0.005)] shadow-[4px_4px_0px_rgba(255,255,255,0.02)] hover:border-[var(--text-primary)] hover:shadow-[8px_8px_0px_var(--electric-blue)] hover:-translate-x-1 hover:-translate-y-1 hover:bg-[rgba(255,255,255,0.015)]">
              <div className="service-num font-['Cabinet_Grotesk'] text-2xl font-extrabold text-[rgba(255,255,255,0.25)]">01//</div>
              <div>
                <h3 className="font-['Cabinet_Grotesk'] text-[1.6rem] font-extrabold uppercase mt-6 mb-3">Next.js Engineering</h3>
                <p className="text-[var(--text-secondary)] text-[0.88rem] leading-[1.6]">Fully responsive, component-driven web applications built with clean TypeScript structure and static-rendering performance.</p>
              </div>
            </div>
            {/* Card 2 */}
            <div className="service-card border-[1.5px] border-[var(--border-color)] p-10 flex flex-col justify-between aspect-[1.1] transition duration-200 bg-[rgba(255,255,255,0.005)] shadow-[4px_4px_0px_rgba(255,255,255,0.02)] hover:border-[var(--text-primary)] hover:shadow-[8px_8px_0px_var(--electric-blue)] hover:-translate-x-1 hover:-translate-y-1 hover:bg-[rgba(255,255,255,0.015)]">
              <div className="service-num font-['Cabinet_Grotesk'] text-2xl font-extrabold text-[rgba(255,255,255,0.25)]">02//</div>
              <div>
                <h3 className="font-['Cabinet_Grotesk'] text-[1.6rem] font-extrabold uppercase mt-6 mb-3">UI/UX Architecture</h3>
                <p className="text-[var(--text-secondary)] text-[0.88rem] leading-[1.6]">Wireframes, style libraries, and interactive design tokens designed inside Figma to match specific client personas.</p>
              </div>
            </div>
            {/* Card 3 */}
            <div className="service-card border-[1.5px] border-[var(--border-color)] p-10 flex flex-col justify-between aspect-[1.1] transition duration-200 bg-[rgba(255,255,255,0.005)] shadow-[4px_4px_0px_rgba(255,255,255,0.02)] hover:border-[var(--text-primary)] hover:shadow-[8px_8px_0px_var(--electric-blue)] hover:-translate-x-1 hover:-translate-y-1 hover:bg-[rgba(255,255,255,0.015)]">
              <div className="service-num font-['Cabinet_Grotesk'] text-2xl font-extrabold text-[rgba(255,255,255,0.25)]">03//</div>
              <div>
                <h3 className="font-['Cabinet_Grotesk'] text-[1.6rem] font-extrabold uppercase mt-6 mb-3">Landing Pages</h3>
                <p className="text-[var(--text-secondary)] text-[0.88rem] leading-[1.6]">Conversion-optimized single-page layouts constructed to showcase capabilities and cleanly integrate database inputs.</p>
              </div>
            </div>
            {/* Card 4 */}
            <div className="service-card border-[1.5px] border-[var(--border-color)] p-10 flex flex-col justify-between aspect-[1.1] transition duration-200 bg-[rgba(255,255,255,0.005)] shadow-[4px_4px_0px_rgba(255,255,255,0.02)] hover:border-[var(--text-primary)] hover:shadow-[8px_8px_0px_var(--electric-blue)] hover:-translate-x-1 hover:-translate-y-1 hover:bg-[rgba(255,255,255,0.015)]">
              <div className="service-num font-['Cabinet_Grotesk'] text-2xl font-extrabold text-[rgba(255,255,255,0.25)]">04//</div>
              <div>
                <h3 className="font-['Cabinet_Grotesk'] text-[1.6rem] font-extrabold uppercase mt-6 mb-3">Performance Audits</h3>
                <p className="text-[var(--text-secondary)] text-[0.88rem] leading-[1.6]">Redesigning lagging, legacy frames into modern, search-optimized web applications scoring 90+ on Lighthouse speeds.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Work Section */}
      <section id="work" className="reveal px-[8%] py-24 border-b-[1.5px] border-[var(--border-color)] relative">
        <div className="section-split grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-20">
          <div className="section-label font-bold text-[0.85rem] text-[var(--electric-blue)] uppercase tracking-wider sticky top-10 self-start">03 / Work</div>
          <div className="work-list flex flex-col w-full">
            {/* Row 1 */}
            <a 
              href="https://ethanwalkerdesigns.com" 
              className="work-row flex justify-between items-center py-10 border-b-[1.5px] border-[var(--border-color)] no-underline text-[var(--text-primary)] transition duration-200" 
              target="_blank"
              onMouseMove={handleWorkRowMouseMove}
              onMouseEnter={() => handleWorkRowMouseEnter('Personal Agency', 'fa-globe')}
              onMouseLeave={handleWorkRowMouseLeave}
            >
              <div className="work-meta flex items-center gap-8">
                <span className="work-num text-sm text-[var(--text-secondary)]">01/</span>
                <h3 className="work-name font-['Cabinet_Grotesk'] text-[1.6rem] md:text-[2.5rem] font-extrabold uppercase transition duration-200">Personal Agency</h3>
              </div>
              <i className="fa-solid fa-arrow-right work-arrow text-3xl text-[var(--text-secondary)] transition duration-300"></i>
            </a>
            {/* Row 2 */}
            <a 
              href="https://dribbble.com/ethanwalker" 
              className="work-row flex justify-between items-center py-10 border-b-[1.5px] border-[var(--border-color)] no-underline text-[var(--text-primary)] transition duration-200" 
              target="_blank"
              onMouseMove={handleWorkRowMouseMove}
              onMouseEnter={() => handleWorkRowMouseEnter('Dribbble Shots', 'fa-dribbble')}
              onMouseLeave={handleWorkRowMouseLeave}
            >
              <div className="work-meta flex items-center gap-8">
                <span className="work-num text-sm text-[var(--text-secondary)]">02/</span>
                <h3 className="work-name font-['Cabinet_Grotesk'] text-[1.6rem] md:text-[2.5rem] font-extrabold uppercase transition duration-200">Dribbble Shots</h3>
              </div>
              <i className="fa-solid fa-arrow-right work-arrow text-3xl text-[var(--text-secondary)] transition duration-300"></i>
            </a>
            {/* Row 3 */}
            <a 
              href="https://behance.net/ethanwalker" 
              className="work-row flex justify-between items-center py-10 border-[var(--border-color)] no-underline text-[var(--text-primary)] transition duration-200" 
              target="_blank"
              onMouseMove={handleWorkRowMouseMove}
              onMouseEnter={() => handleWorkRowMouseEnter('Behance Showcase', 'fa-behance')}
              onMouseLeave={handleWorkRowMouseLeave}
            >
              <div className="work-meta flex items-center gap-8">
                <span className="work-num text-sm text-[var(--text-secondary)]">03/</span>
                <h3 className="work-name font-['Cabinet_Grotesk'] text-[1.6rem] md:text-[2.5rem] font-extrabold uppercase transition duration-200">Behance Showcase</h3>
              </div>
              <i className="fa-solid fa-arrow-right work-arrow text-3xl text-[var(--text-secondary)] transition duration-300"></i>
            </a>
          </div>
        </div>
      </section>

      {/* Why Me Section */}
      <section id="why-me" className="reveal px-[8%] py-24 border-b-[1.5px] border-[var(--border-color)] relative">
        <div className="section-split grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-20">
          <div className="section-label font-bold text-[0.85rem] text-[var(--electric-blue)] uppercase tracking-wider sticky top-10 self-start">04 / Why Me</div>
          <div className="why-me-grid grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Item 1 */}
            <div className="why-item border-[1.5px] border-[var(--border-color)] p-10 bg-[rgba(255,255,255,0.005)]">
              <i className="fa-solid fa-gauge-high text-[2.2rem] text-[var(--electric-blue)] mb-6"></i>
              <h4 className="font-['Cabinet_Grotesk'] font-extrabold text-[1.4rem] uppercase mb-4">Speed First</h4>
              <p className="text-[var(--text-secondary)] text-sm leading-[1.6]">Websites optimized to hit top performance scores, accelerating user navigation and Google SEO indexes.</p>
            </div>
            {/* Item 2 */}
            <div className="why-item border-[1.5px] border-[var(--border-color)] p-10 bg-[rgba(255,255,255,0.005)]">
              <i className="fa-solid fa-laptop-code text-[2.2rem] text-[var(--electric-blue)] mb-6"></i>
              <h4 className="font-['Cabinet_Grotesk'] font-extrabold text-[1.4rem] uppercase mb-4">Hybrid Flow</h4>
              <p className="text-[var(--text-secondary)] text-sm leading-[1.6]">Handling both visual systems and technical codebases, removing designer-developer translation delays.</p>
            </div>
            {/* Item 3 */}
            <div className="why-item border-[1.5px] border-[var(--border-color)] p-10 bg-[rgba(255,255,255,0.005)]">
              <i className="fa-solid fa-shield-halved text-[2.2rem] text-[var(--electric-blue)] mb-6"></i>
              <h4 className="font-['Cabinet_Grotesk'] font-extrabold text-[1.4rem] uppercase mb-4">Strict Quality</h4>
              <p className="text-[var(--text-secondary)] text-sm leading-[1.6]">Clean semantic markups, responsive layout validation, and modular file organization for easy scale.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="process" className="reveal px-[8%] py-24 border-b-[1.5px] border-[var(--border-color)] relative">
        <div className="section-split grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-20">
          <div className="section-label font-bold text-[0.85rem] text-[var(--electric-blue)] uppercase tracking-wider sticky top-10 self-start">05 / Workflow</div>
          <div className="process-flow flex flex-col gap-5 w-full">
            {/* Step 1 */}
            <div className="process-block border-[1.5px] border-[var(--border-color)] px-10 py-8 flex justify-between items-center transition duration-200 bg-[rgba(255,255,255,0.005)] hover:border-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.015)]">
              <div className="process-meta flex items-center gap-10">
                <span className="process-num font-['Cabinet_Grotesk'] text-[1.8rem] font-extrabold text-[var(--electric-blue)]">01//</span>
                <h3 className="process-title font-['Cabinet_Grotesk'] text-[1.4rem] font-extrabold uppercase">Design Systems</h3>
              </div>
              <p className="process-desc text-[var(--text-secondary)] text-sm max-w-[500px] text-right">Wireframing layouts and defining typography in Figma.</p>
            </div>
            {/* Step 2 */}
            <div className="process-block border-[1.5px] border-[var(--border-color)] px-10 py-8 flex justify-between items-center transition duration-200 bg-[rgba(255,255,255,0.005)] hover:border-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.015)]">
              <div className="process-meta flex items-center gap-10">
                <span className="process-num font-['Cabinet_Grotesk'] text-[1.8rem] font-extrabold text-[var(--electric-blue)]">02//</span>
                <h3 className="process-title font-['Cabinet_Grotesk'] text-[1.4rem] font-extrabold uppercase">Component Build</h3>
              </div>
              <p className="process-desc text-[var(--text-secondary)] text-sm max-w-[500px] text-right">Coding UI templates in React and modularizing stylesheet variables.</p>
            </div>
            {/* Step 3 */}
            <div className="process-block border-[1.5px] border-[var(--border-color)] px-10 py-8 flex justify-between items-center transition duration-200 bg-[rgba(255,255,255,0.005)] hover:border-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.015)]">
              <div className="process-meta flex items-center gap-10">
                <span className="process-num font-['Cabinet_Grotesk'] text-[1.8rem] font-extrabold text-[var(--electric-blue)]">03//</span>
                <h3 className="process-title font-['Cabinet_Grotesk'] text-[1.4rem] font-extrabold uppercase">API Integration</h3>
              </div>
              <p className="process-desc text-[var(--text-secondary)] text-sm max-w-[500px] text-right">Connecting UI inputs to secure databases and checking responsive grids.</p>
            </div>
            {/* Step 4 */}
            <div className="process-block border-[1.5px] border-[var(--border-color)] px-10 py-8 flex justify-between items-center transition duration-200 bg-[rgba(255,255,255,0.005)] hover:border-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.015)]">
              <div className="process-meta flex items-center gap-10">
                <span className="process-num font-['Cabinet_Grotesk'] text-[1.8rem] font-extrabold text-[var(--electric-blue)]">04//</span>
                <h3 className="process-title font-['Cabinet_Grotesk'] text-[1.4rem] font-extrabold uppercase">Speed Optimization</h3>
              </div>
              <p className="process-desc text-[var(--text-secondary)] text-sm max-w-[500px] text-right">Finalizing metadata tags, scaling assets, and deploying live production builds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Voice / Testimonials Section */}
      <section id="testimonials" className="reveal px-[8%] py-24 border-b-[1.5px] border-[var(--border-color)] relative">
        <div className="section-split grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-20">
          <div className="section-label font-bold text-[0.85rem] text-[var(--electric-blue)] uppercase tracking-wider sticky top-10 self-start">06 / Voice</div>
          <div className="testimonials-grid grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className="testimonial-box border-[1.5px] border-[var(--border-color)] p-12 flex flex-col justify-between bg-[rgba(255,255,255,0.005)]">
              <p className="quote-text text-[1.15rem] leading-[1.7] italic text-[rgba(255,255,255,0.9)] mb-10">
                "Ethan delivered a stunning portfolio website that helped me get more clients."
              </p>
              <div className="author-meta flex items-center gap-4 border-t-[1.5px] border-[var(--border-color)] pt-6">
                <div className="author-box w-11 h-11 border-[1.5px] border-[var(--text-primary)] flex items-center justify-center font-['Cabinet_Grotesk'] font-extrabold text-[1.1rem] bg-[var(--electric-blue)] text-[var(--bg-dark)]">SM</div>
                <div className="author-details">
                  <h5 className="font-['Cabinet_Grotesk'] font-extrabold text-base uppercase">Sarah M.</h5>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">Brand Strategist</p>
                </div>
              </div>
            </div>
            {/* Testimonial 2 */}
            <div className="testimonial-box border-[1.5px] border-[var(--border-color)] p-12 flex flex-col justify-between bg-[rgba(255,255,255,0.005)]">
              <p className="quote-text text-[1.15rem] leading-[1.7] italic text-[rgba(255,255,255,0.9)] mb-10">
                "Professional, fast, and highly creative work."
              </p>
              <div className="author-meta flex items-center gap-4 border-t-[1.5px] border-[var(--border-color)] pt-6">
                <div className="author-box w-11 h-11 border-[1.5px] border-[var(--text-primary)] flex items-center justify-center font-['Cabinet_Grotesk'] font-extrabold text-[1.1rem] bg-[var(--electric-blue)] text-[var(--bg-dark)]">JC</div>
                <div className="author-details">
                  <h5 className="font-['Cabinet_Grotesk'] font-extrabold text-base uppercase">James Carter</h5>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">Startup Hub Founder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="reveal px-[8%] py-24 border-b-[1.5px] border-[var(--border-color)] relative">
        <div className="section-split grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-20">
          <div className="section-label font-bold text-[0.85rem] text-[var(--electric-blue)] uppercase tracking-wider sticky top-10 self-start">07 / FAQ</div>
          <div className="faq-list flex flex-col w-full">
            {/* FAQ 1 */}
            <div className={`faq-item border-b-[1.5px] border-[var(--border-color)] py-6 ${activeFaq === 0 ? 'active' : ''}`}>
              <div className="faq-trigger cursor-pointer flex justify-between items-center font-['Cabinet_Grotesk'] font-extrabold text-[1.3rem] uppercase" onClick={() => toggleFaq(0)}>
                What technology stack do you use? <i className="fa-solid fa-plus text-[var(--electric-blue)] transition-transform duration-300"></i>
              </div>
              <div className="faq-content overflow-hidden text-[var(--text-secondary)] text-[0.92rem] leading-[1.6] transition-[max-height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ maxHeight: activeFaq === 0 ? '120px' : '0' }}>
                <p className="mt-4">I build using React, Next.js, and TypeScript, styled with customized CSS grids and layout structures. Backends are connected via serverless APIs and headless CMS tools.</p>
              </div>
            </div>
            {/* FAQ 2 */}
            <div className={`faq-item border-b-[1.5px] border-[var(--border-color)] py-6 ${activeFaq === 1 ? 'active' : ''}`}>
              <div className="faq-trigger cursor-pointer flex justify-between items-center font-['Cabinet_Grotesk'] font-extrabold text-[1.3rem] uppercase" onClick={() => toggleFaq(1)}>
                Can you handle both UI design and coding? <i className="fa-solid fa-plus text-[var(--electric-blue)] transition-transform duration-300"></i>
              </div>
              <div className="faq-content overflow-hidden text-[var(--text-secondary)] text-[0.92rem] leading-[1.6] transition-[max-height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ maxHeight: activeFaq === 1 ? '120px' : '0' }}>
                <p className="mt-4">Yes! By designing in Figma and coding in React/Next.js, I handle the full production chain, eliminating standard agency delivery delays.</p>
              </div>
            </div>
            {/* FAQ 3 */}
            <div className={`faq-item border-b-[1.5px] border-[var(--border-color)] py-6 ${activeFaq === 2 ? 'active' : ''}`}>
              <div className="faq-trigger cursor-pointer flex justify-between items-center font-['Cabinet_Grotesk'] font-extrabold text-[1.3rem] uppercase" onClick={() => toggleFaq(2)}>
                What is your turnaround for single-page sites? <i className="fa-solid fa-plus text-[var(--electric-blue)] transition-transform duration-300"></i>
              </div>
              <div className="faq-content overflow-hidden text-[var(--text-secondary)] text-[0.92rem] leading-[1.6] transition-[max-height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ maxHeight: activeFaq === 2 ? '120px' : '0' }}>
                <p className="mt-4">Standard portfolios and custom landing pages take 5 to 7 business days from initial layout approval.</p>
              </div>
            </div>
            {/* FAQ 4 */}
            <div className={`faq-item border-b-none py-6 ${activeFaq === 3 ? 'active' : ''}`}>
              <div className="faq-trigger cursor-pointer flex justify-between items-center font-['Cabinet_Grotesk'] font-extrabold text-[1.3rem] uppercase" onClick={() => toggleFaq(3)}>
                Do you offer revision support? <i className="fa-solid fa-plus text-[var(--electric-blue)] transition-transform duration-300"></i>
              </div>
              <div className="faq-content overflow-hidden text-[var(--text-secondary)] text-[0.92rem] leading-[1.6] transition-[max-height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ maxHeight: activeFaq === 3 ? '120px' : '0' }}>
                <p className="mt-4">Yes, I provide revision cycles during the drafting phase, followed by 30 days of speed audits and maintenance support post-deployment.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action Panel */}
      <section className="cta-section px-[8%] py-24 bg-[var(--bg-dark)] text-center relative" id="cta">
        <div className="cta-panel border-[1.5px] border-[var(--text-primary)] px-10 py-20 relative bg-[rgba(255,255,255,0.005)] shadow-[10px_10px_0px_var(--electric-blue)]">
          <h2 className="cta-title font-['Cabinet_Grotesk'] text-[2.2rem] md:text-[3.8rem] font-extrabold uppercase leading-none mb-6 tracking-tighter">Ready to launch?</h2>
          <p className="cta-desc text-[var(--text-secondary)] text-[1.1rem] max-w-[600px] mx-auto mb-10">Let's blueprint and code a digital space designed specifically for your client pipeline.</p>
          <a href="https://korvex6.gumroad.com/l/mprfco" target="_blank" className="btn-brutal inline-flex items-center gap-3 bg-[var(--text-primary)] text-[var(--bg-dark)] border-[1.5px] border-[var(--text-primary)] px-9 py-4 font-['Cabinet_Grotesk'] font-extrabold text-[1.1rem] no-underline uppercase transition duration-200 shadow-[6px_6px_0px_var(--electric-blue)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[9px_9px_0px_var(--text-primary)]">Book a project call <i className="fa-solid fa-arrow-right"></i></a>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-[8%] py-12 flex justify-between items-center text-xs text-[var(--text-secondary)] bg-[var(--bg-dark)]">
        <a href="#" className="footer-logo font-['Cabinet_Grotesk'] font-extrabold text-base text-[var(--text-primary)] no-underline">
          Ethan Walker<span className="text-[var(--electric-blue)]">//</span>
        </a>
        <div>&copy; 2026 Ethan Walker. All rights reserved.</div>
        <div className="footer-socials flex gap-6">
          <a href="https://dribbble.com/ethanwalker" aria-label="Dribbble" target="_blank" className="text-[var(--text-secondary)] transition duration-200 hover:text-[var(--electric-blue)] text-lg"><i className="fa-brands fa-dribbble"></i></a>
          <a href="https://behance.net/ethanwalker" aria-label="Behance" target="_blank" className="text-[var(--text-secondary)] transition duration-200 hover:text-[var(--electric-blue)] text-lg"><i className="fa-brands fa-behance"></i></a>
        </div>
      </footer>
    </>
  );
}
