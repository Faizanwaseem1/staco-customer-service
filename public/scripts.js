//for Headers


  (function () {
    const header = document.getElementById('staco-header');
    const btn = document.getElementById('start-free-btn');
    if (!header) return;
    let lastScrollY = window.pageYOffset || 0;

    const hide  = ['-translate-y-full', 'opacity-0', 'pointer-events-none'];
    const glass = ['bg-white/70', 'backdrop-blur-md', 'shadow-sm'];
    const dark  = ['bg-[#0095FF]', 'text-white'];
    const light = ['bg-[#CCEAFF]', 'text-[#0095FF]'];

    window.addEventListener('scroll', () => {
      const y = window.pageYOffset || 0;

      if (y <= 20) {
        // Bilkul top par: solid white, koi border/shadow nahi, button simple
        header.classList.remove(...hide, ...glass);
        header.classList.add('bg-white');
        if (btn) { btn.classList.remove(...dark); btn.classList.add(...light); }
      } else if (y > lastScrollY && y > 90) {
        // Neeche scroll: header gayab (invisible)
        header.classList.add(...hide);
      } else if (y < lastScrollY) {
        // Upar scroll: header wapas visible, glass effect + button dark
        header.classList.remove(...hide, 'bg-white');
        header.classList.add(...glass);
        if (btn) { btn.classList.remove(...light); btn.classList.add(...dark); }
      }

      lastScrollY = y <= 0 ? 0 : y;
    }, { passive: true });
  })();


  //sticky post
  
    document.addEventListener("DOMContentLoaded", () => {
        const section2 = document.getElementById("section-2");
        const section3 = document.getElementById("section-3");
        const card1 = document.getElementById("card-state-1");
        const card2 = document.getElementById("card-state-2");
        const card3 = document.getElementById("card-state-3");
        const cards = [card1, card2, card3];
        const hideTimers = new Map();

        // Sticky image ka khud element dhoondo (Business team workspace image)
        const stickyImage = document.querySelector('img[alt="Business team workspace"]');

        function getAnchor() {
            if (!stickyImage) return 300; // fallback agar image na mile
            const rect = stickyImage.getBoundingClientRect();
            // Image ke aadhe hisse se thora neeche (60% down)
            return rect.top + rect.height * 0.6;
        }

        function showCard(active) {
            cards.forEach(c => {
                if (!c) return;
                if (hideTimers.has(c)) {
                    clearTimeout(hideTimers.get(c));
                    hideTimers.delete(c);
                }
                if (c === active) {
                    c.classList.remove("hidden");
                    requestAnimationFrame(() => c.classList.remove("opacity-0"));
                } else {
                    c.classList.add("opacity-0");
                    const t = setTimeout(() => {
                        c.classList.add("hidden");
                        hideTimers.delete(c);
                    }, 300);
                    hideTimers.set(c, t);
                }
            });
        }

        let currentCard = null;
        let ticking = false;

        function updateCard() {
            const anchor = getAnchor();
            let target = card1;

            if (section2 && section2.getBoundingClientRect().top <= anchor) {
                target = card2;
            }
            if (section3 && section3.getBoundingClientRect().top <= anchor) {
                target = card3;
            }

            if (target !== currentCard) {
                currentCard = target;
                showCard(target);
            }
            ticking = false;
        }

        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(updateCard);
                ticking = true;
            }
        }

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        updateCard();
    });

    //dotted map
    
    document.addEventListener("DOMContentLoaded", () => {
        const counters = document.querySelectorAll(".counter");
        let hasAnimated = false;

        const startCounting = () => {
            if (hasAnimated) return;
            hasAnimated = true;

            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute("data-target"), 10);
                const suffix = counter.getAttribute("data-suffix") || "";
                let current = 0;
                
                const duration = 2000; // Animation duration in milliseconds (2 seconds)
                const frameRate = 1000 / 60; // 60 FPS smooth update
                const totalFrames = duration / frameRate;
                const increment = target / totalFrames;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target + suffix;
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current) + suffix;
                    }
                }, frameRate);
            });
        };

        // Trigger animation automatically when scrolled into view
        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounting();
                    observerInstance.disconnect(); // Ensures it only runs once
                }
            });
        }, { threshold: 0.3 });

        const section = document.querySelector(".counter").closest("section");
        if (section) {
            observer.observe(section);
        }
    });

//top scroll button

(function () {
    const btn = document.getElementById('scroll-top');
    const ring = document.getElementById('scroll-progress');
    const C = 106.8; // ring ki lambai (2 x 3.14159 x 17)

    function update() {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const progress = total > 0 ? window.scrollY / total : 0;
        ring.style.strokeDashoffset = C - C * progress;

        if (window.scrollY > 200) {
            btn.classList.remove('opacity-0', 'invisible', 'translate-y-4');
        } else {
            btn.classList.add('opacity-0', 'invisible', 'translate-y-4');
        }
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();
