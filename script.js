/* ===========================
   STEP 12 - GITHUB SAMPLE ACTIVITY GRID
   (visual placeholder only)
=========================== */

const grid = document.getElementById("contribution-grid");

if (grid) {
    // 14 weeks x 7 days of muted teal cells.
    // This is a DETERMINISTIC pattern — not real data.
    // It will be replaced when live GitHub data is connected.
    for (let i = 0; i < 14 * 7; i++) {
        const cell = document.createElement("span");
        const level = (i * 7 + i % 3) % 5; // values 0..4
        if (level > 0) {
            cell.className = "c" + level;
        }
        grid.appendChild(cell);
    }
}

/* ===========================
   STEP 16 - CONTACT FORM
   (UI only: opens the visitor's email app with the message pre-filled)
=========================== */

const contactForm = document.getElementById("contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault(); // don't reload the page

        const name = document.getElementById("cf-name").value.trim();
        const email = document.getElementById("cf-email").value.trim();
        const message = document.getElementById("cf-message").value.trim();

        const subject = encodeURIComponent("Portfolio message from " + (name || "someone"));
        const body = encodeURIComponent(
            "Hi Arathana,\n\n" + message + "\n\n— " + name + " (" + email + ")"
        );

        window.location.href = "mailto:arathanark29@gmail.com?subject=" + subject + "&body=" + body;
    });
}

/* ===========================
   STEP 17 - FOOTER YEAR (stays current)
=========================== */

const yearEl = document.getElementById("year");

if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

/* ===========================
   STEP 5.2 - ANIMATED ROLE TEXT
=========================== */

// The list of roles that will rotate, one after another.
const roles = [
    "Java Developer",
    "Software Developer",
    "Python Developer",
    "AI Enthusiast",
    "Data Explorer",
    "Problem Solver",
    "Future AI Engineer",
    "Backend Developer"
];

// The empty <span> in the Hero where the typed text appears.
const typedEl = document.getElementById("typed-role");

// Only run if that element exists on the page.
if (typedEl) {

    // Check if the visitor has asked for reduced motion in their system settings.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
        // Calmer experience: just show the first role, no animation.
        typedEl.textContent = roles[0];
    } else {

        let roleIndex = 0;  // which role we are currently typing
        let charIndex = 0;  // how many letters of that role are shown
        let deleting = false;

        function typeLoop() {

            const current = roles[roleIndex];

            if (!deleting) {
                // TYPE: add one more letter to the screen.
                charIndex++;
                typedEl.textContent = current.slice(0, charIndex);

                if (charIndex === current.length) {
                    // The whole role is shown. Pause, then start deleting.
                    deleting = true;
                    setTimeout(typeLoop, 1800);
                    return;
                }
                setTimeout(typeLoop, 70);

            } else {
                // DELETE: remove one letter from the screen.
                charIndex--;
                typedEl.textContent = current.slice(0, charIndex);

                if (charIndex === 0) {
                    // The role is fully deleted. Move to the next one.
                    deleting = false;
                    roleIndex = (roleIndex + 1) % roles.length;
                    setTimeout(typeLoop, 350);
                    return;
                }
                setTimeout(typeLoop, 35);
            }
        }

        // Start the loop.
        typeLoop();
    }
}

/* ===========================
   STEP 18 - ANIMATIONS
   (scroll reveals, timeline fill, navbar state,
    active-link indicator, custom cursor)
=========================== */

(function () {

    // Respect visitors who prefer reduced motion: skip the fancy effects.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- 18.1 Scroll reveal (staggered fade-up) ---------- */

    if (!reduceMotion && "IntersectionObserver" in window) {

        // Every element below that should fade in as it scrolls into view.
        const revealSelectors = [
            ".section-head",
            ".about-grid > .card",
            ".about-traits",
            ".internship-card",
            ".stack-legend",
            ".stack-grid > .card",
            ".project-grid > .project-card",
            ".project-more",
            ".timeline-item",
            ".focus-bar",
            ".focus-legend",
            ".focus-grid > .card",
            ".milestone-grid > .card",
            ".github-dash",
            ".roadmap-phase",
            ".art-tile",
            ".resume-card",
            ".contact-info",
            ".contact-form-card"
        ];

        const revealTargets = [];

        revealSelectors.forEach(function (selector) {
            document.querySelectorAll(selector).forEach(function (el) {
                revealTargets.push(el);
            });
        });

        // Add the starting (hidden) state to every target.
        revealTargets.forEach(function (el) {
            el.classList.add("reveal");
        });

        // Stagger: siblings inside the same parent appear one after another.
        // Group elements by their parent, then give each a small delay.
        const groups = new Map();

        revealTargets.forEach(function (el) {
            const parent = el.parentElement;
            if (!groups.has(parent)) {
                groups.set(parent, []);
            }
            groups.get(parent).push(el);
        });

        groups.forEach(function (group) {
            group.forEach(function (el, index) {
                if (group.length > 1) {
                    const delay = Math.min(index * 90, 450);
                    el.style.transitionDelay = delay + "ms";
                }
            });
        });

        // Watch each target and reveal it when it enters the viewport.
        const revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    el.classList.add("reveal-visible");
                    revealObserver.unobserve(el);

                    // Once the reveal finishes, remove the helper classes so
                    // normal hover transitions (like the card lift) work again.
                    const cleanup = function () {
                        el.classList.remove("reveal", "reveal-visible");
                        el.style.transitionDelay = "";
                    };

                    el.addEventListener("transitionend", function handler(e) {
                        if (e.propertyName === "opacity") {
                            cleanup();
                            el.removeEventListener("transitionend", handler);
                        }
                    });

                    // Safety net in case the event never fires.
                    setTimeout(cleanup, 1400);
                }
            });
        }, { threshold: 0.05, rootMargin: "0px 0px -60px 0px" });

        revealTargets.forEach(function (el) {
            revealObserver.observe(el);
        });

        /* ---------- 18.2 Timeline progress fill ---------- */

        const timeline = document.querySelector(".timeline");

        if (timeline) {
            const updateTimeline = function () {
                const rect = timeline.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const progress = Math.min(1, Math.max(0, (viewportHeight - rect.top) / (rect.height + viewportHeight)));
                timeline.style.setProperty("--timeline-progress", progress.toFixed(3));
            };

            let ticking = false;

            const onScroll = function () {
                if (!ticking) {
                    ticking = true;
                    requestAnimationFrame(function () {
                        updateTimeline();
                        ticking = false;
                    });
                }
            };

            window.addEventListener("scroll", onScroll, { passive: true });
            window.addEventListener("resize", onScroll);
            updateTimeline();
        }
    } else if (document.querySelector(".timeline")) {
        // Reduced motion: show the journey line fully filled, no animation.
        document.querySelector(".timeline").style.setProperty("--timeline-progress", 1);
    }

    /* ---------- 18.3 Navbar: shadow once you scroll ---------- */

    const header = document.getElementById("header");

    if (header) {
        const updateHeader = function () {
            header.classList.toggle("scrolled", window.scrollY > 40);
        };
        window.addEventListener("scroll", updateHeader, { passive: true });
        updateHeader();
    }

    /* ---------- 18.4 Navbar: highlight the section you are viewing ---------- */

    if ("IntersectionObserver" in window) {
        const navLinks = document.querySelectorAll(".nav-links a");
        const spySections = ["home", "about", "tech-stack", "projects", "contact"];

        const spyObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    navLinks.forEach(function (link) {
                        link.classList.remove("active");
                    });
                    const activeLink = document.querySelector('.nav-links a[href="#' + entry.target.id + '"]');
                    if (activeLink) {
                        activeLink.classList.add("active");
                    }
                }
            });
        }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

        spySections.forEach(function (id) {
            const section = document.getElementById(id);
            if (section) {
                spyObserver.observe(section);
            }
        });
    }

    /* ---------- 19.1 Mobile hamburger menu ---------- */

    const navToggle = document.querySelector(".nav-toggle");
    const navbar = document.querySelector(".navbar");

    if (navToggle && navbar) {

        // Open / close the menu.
        navToggle.addEventListener("click", function () {
            const isOpen = navbar.classList.toggle("open");
            navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
            navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
        });

        // Close the menu when a link is chosen.
        navbar.querySelectorAll(".nav-links a").forEach(function (link) {
            link.addEventListener("click", function () {
                navbar.classList.remove("open");
                navToggle.setAttribute("aria-expanded", "false");
                navToggle.setAttribute("aria-label", "Open menu");
            });
        });

        // Close the menu with the Escape key.
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && navbar.classList.contains("open")) {
                navbar.classList.remove("open");
                navToggle.setAttribute("aria-expanded", "false");
                navToggle.setAttribute("aria-label", "Open menu");
            }
        });

        // Close when clicking outside the menu.
        document.addEventListener("click", function (e) {
            if (navbar.classList.contains("open") && !navbar.contains(e.target)) {
                navbar.classList.remove("open");
                navToggle.setAttribute("aria-expanded", "false");
                navToggle.setAttribute("aria-label", "Open menu");
            }
        });
    }

    /* ---------- 18.5 Custom cursor (desktop, fine pointers only) ---------- */

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (finePointer && !reduceMotion) {

        // Build the two cursor layers (a small dot + a soft trailing ring).
        const cursorDot = document.createElement("div");
        cursorDot.className = "cursor-dot";
        cursorDot.setAttribute("aria-hidden", "true");

        const cursorRing = document.createElement("div");
        cursorRing.className = "cursor-ring";
        cursorRing.setAttribute("aria-hidden", "true");

        // Park them off-screen first so they never flash at (0,0).
        cursorDot.style.transform = "translate(-100px, -100px)";
        cursorRing.style.transform = "translate(-100px, -100px)";

        document.body.appendChild(cursorDot);
        document.body.appendChild(cursorRing);
        document.body.classList.add("cursor-on");

        let mouseX = -100;
        let mouseY = -100;
        let ringX = -100;
        let ringY = -100;
        let rafId = null;

        // The dot follows the pointer exactly; the ring trails with a soft lag.
        document.addEventListener("mousemove", function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.transform = "translate(" + mouseX + "px, " + mouseY + "px)";

            if (!rafId) {
                rafId = requestAnimationFrame(ringLoop);
            }
        });

        function ringLoop() {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            cursorRing.style.transform = "translate(" + ringX + "px, " + ringY + "px)";

            if (Math.abs(mouseX - ringX) > 0.5 || Math.abs(mouseY - ringY) > 0.5) {
                rafId = requestAnimationFrame(ringLoop);
            } else {
                rafId = null;
            }
        }

        // The ring grows slightly over interactive elements.
        const interactiveSelector = "a, button, input, textarea, select, .card, [role='button']";

        document.addEventListener("mouseover", function (e) {
            if (e.target.closest(interactiveSelector)) {
                cursorRing.classList.add("cursor-ring--hover");
            }
        });

        document.addEventListener("mouseout", function (e) {
            if (e.target.closest(interactiveSelector)) {
                cursorRing.classList.remove("cursor-ring--hover");
            }
        });

        // Hide the custom cursor while the mouse is outside the window.
        document.documentElement.addEventListener("mouseleave", function () {
            document.body.classList.add("cursor-off");
        });

        document.documentElement.addEventListener("mouseenter", function () {
            document.body.classList.remove("cursor-off");
        });
    }

})();

/* ===========================
   STEP 20.2 - DARK MODE TOGGLE
=========================== */

(function () {

    const themeBtn = document.querySelector(".theme-btn");
    const themeIcon = document.querySelector(".theme-icon");
    const rootEl = document.documentElement;
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');

    // Update the button icon + label + browser bar colour to match the theme.
    function syncThemeUI() {
        const isDark = rootEl.getAttribute("data-theme") === "dark";

        if (themeIcon) {
            themeIcon.textContent = isDark ? "☀️" : "🌙";
        }
        if (themeBtn) {
            themeBtn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
            themeBtn.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
        }
        if (themeColorMeta) {
            themeColorMeta.setAttribute("content", isDark ? "#0B1220" : "#0F766E");
        }
    }

    // Called by the early <head> script too, so icon matches on first paint.
    if (themeBtn) {
        themeBtn.addEventListener("click", function () {
            const next = rootEl.getAttribute("data-theme") === "dark" ? "light" : "dark";
            rootEl.setAttribute("data-theme", next);
            try {
                localStorage.setItem("theme", next);
            } catch (e) {}
            syncThemeUI();
        });
    }

    syncThemeUI();

})();
