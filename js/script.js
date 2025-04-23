document.addEventListener('DOMContentLoaded', () => {
    // --- Smooth Scrolling --- //
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"], .mobile-menu a[href^="#"], .footer-quick-links a[href^="#"], .logo a[href^="#"], .cta-buttons a[href^="#"], .btn[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            // Ensure targetId is a valid selector (starts with #)
            if (!targetId || targetId === '#' || !targetId.startsWith('#')) return;
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const header = document.getElementById('header');
                const headerOffset = header ? header.offsetHeight : 70; // Default offset if header not found
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                // Close mobile menu if open
                const mobileMenu = document.querySelector('.mobile-menu');
                if (document.body.classList.contains('mobile-menu-active') && mobileMenu) {
                    document.body.classList.remove('mobile-menu-active');
                    mobileMenu.style.transform = 'translateX(100%)';
                }

                // Update active link state
                updateActiveLink(targetId);
            }
        });
    });

    // --- Active Link Highlighting on Scroll --- //
    const sections = document.querySelectorAll('main section[id]'); // Target only main sections
    const header = document.getElementById('header');

    function updateActiveLinkOnScroll() {
        const headerHeight = header ? header.offsetHeight : 70;
        let currentSectionId = null;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50; // Adjust buffer as needed
            const sectionBottom = sectionTop + section.offsetHeight;

            // Check if current scroll position is within the section bounds
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionBottom) {
                currentSectionId = '#' + section.getAttribute('id');
            }
        });

        // If no section is currently active (e.g., very top or between sections), default to hero or nearest
        if (!currentSectionId && sections.length > 0 && window.pageYOffset < sections[0].offsetTop - headerHeight) {
            currentSectionId = '#hero'; // Default to hero if scrolled to the top
        }

        // Fallback if still null (might happen at the very bottom)
        if (!currentSectionId && sections.length > 0) {
            // Check if scrolled past the last section
             const lastSection = sections[sections.length - 1];
             if (window.pageYOffset >= lastSection.offsetTop - headerHeight - 50) {
                 currentSectionId = '#' + lastSection.getAttribute('id');
             }
        }

        updateActiveLink(currentSectionId);
    }

    window.addEventListener('scroll', updateActiveLinkOnScroll);

    function updateActiveLink(targetId) {
        document.querySelectorAll('.nav-menu a, .mobile-menu a').forEach(link => {
            link.classList.remove('active');
            if (targetId && link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
        // Special case for hero when scrolled near top
        if (targetId === '#hero') {
             document.querySelectorAll('.nav-menu a[href="#hero"], .mobile-menu a[href="#hero"]').forEach(l => l.classList.add('active'));
        }
    }

    // --- Mobile Menu Toggle --- //
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const closeMenuButton = document.querySelector('.close-menu');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            document.body.classList.add('mobile-menu-active');
            mobileMenu.style.transform = 'translateX(0)';
        });
    }

    if (closeMenuButton && mobileMenu) {
        closeMenuButton.addEventListener('click', () => {
            document.body.classList.remove('mobile-menu-active');
            mobileMenu.style.transform = 'translateX(100%)';
        });
    }

    // Close mobile menu if clicking outside of it or on a link
    document.addEventListener('click', (event) => {
        const isMobileMenuLink = event.target.closest('.mobile-menu a[href^="#"]');
        const isOutsideClick = !mobileMenu.contains(event.target) && !menuToggle.contains(event.target);

        if ((isMobileMenuLink || isOutsideClick) && document.body.classList.contains('mobile-menu-active')) {
            document.body.classList.remove('mobile-menu-active');
            mobileMenu.style.transform = 'translateX(100%)';
        }
    });

    // --- Sticky Header --- //
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        if (!header) return; // Exit if header doesn't exist
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 50) { // Add class when scrolled down a bit
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // --- Fade-in Animation on Scroll --- //
    // Wait 3.5 seconds before setting up the observer
    setTimeout(() => {
        const animatedElements = document.querySelectorAll('.animated-slide-item');

        if ("IntersectionObserver" in window) {
            const observerOptions = {
                root: null, // viewport
                rootMargin: '0px',
                threshold: 0.1 // Trigger when 10% of the element is visible
            };

            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        // DO NOT unobserve here, we want it to trigger again
                        // observer.unobserve(entry.target);
                    } else {
                        // Remove class when element is NOT intersecting
                        entry.target.classList.remove('visible');
                    }
                });
            }, observerOptions);

            animatedElements.forEach(el => {
                observer.observe(el);
            });
        } else {
            // Fallback for older browsers: Make all animated items visible immediately
            document.querySelectorAll('.animated-slide-item').forEach(el => {
                el.classList.add('visible');
            });
        }
    }, 3500); // 3.5 second delay

    // --- Testimonial Slider (REMOVED) --- //
    /*
    const slidesContainer = document.querySelector('.testimonial-slides');
    const slides = document.querySelectorAll('.testimonial-slides .testimonial-card');
    let currentSlide = 0;
    let slideInterval;
    const slidesToScroll = 2; // Number of slides to show/scroll

    function showSlide(index) {
        if (!slidesContainer || slides.length === 0) return;
        // Ensure index is valid and aligned to the scroll group
        index = Math.max(0, Math.min(index, slides.length - slidesToScroll));
        index = Math.floor(index / slidesToScroll) * slidesToScroll;
        
        const slideWidth = slides[0].offsetWidth;
        // Calculate offset based on the index and number of slides shown
        // Assuming 50% width per slide, offset is index * 50% of container width
        const totalWidth = slidesContainer.scrollWidth;
        const containerWidth = slidesContainer.offsetWidth;
        // We translate by the width of *one* slide multiplied by the index
        // Since each slide is 50% width, offset = index * (containerWidth / 2)
        // More robustly: use slideWidth directly
        let offset = index * slideWidth; 
        
        // Boundary check to prevent overscrolling if not perfectly divisible
        const maxOffset = totalWidth - containerWidth;
        offset = Math.min(offset, maxOffset);

        slidesContainer.style.transform = `translateX(-${offset}px)`;
        currentSlide = index;
    }

    function nextSlide() {
        if (slides.length <= slidesToScroll) return; // Don't scroll if not enough slides

        let nextIndex = currentSlide + slidesToScroll;
        // If next index goes beyond or equals the total number of slides,
        // loop back to the beginning.
        if (nextIndex >= slides.length) {
             nextIndex = 0;
        }
        // Ensure the next index doesn't go beyond the last possible starting slide
        // nextIndex = Math.min(nextIndex, slides.length - slidesToScroll);
        
        showSlide(nextIndex);
    }

    function startSlider() {
        // Clear existing interval if any
        if (slideInterval) clearInterval(slideInterval);
        // Start new interval
        if (slides.length > 1) { // Only start if more than one slide
             slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
        }
    }

    function stopSlider() {
        clearInterval(slideInterval);
    }

    if (slidesContainer && slides.length > 1) {
        // Optional: Pause slider on hover
        slidesContainer.addEventListener('mouseenter', stopSlider);
        slidesContainer.addEventListener('mouseleave', startSlider);

        // Initialize slider
        showSlide(0);
        startSlider();

         // Re-initialize slider on window resize to recalculate width
        window.addEventListener('resize', () => {
             showSlide(currentSlide); // Recalculate transform based on new width
        });
    } else {
         console.log("Testimonial slider requires more than one slide or elements not found.");
    }
    */

     // --- Form Submission Placeholder --- //
     const contactForm = document.querySelector('.contact-form form');
     if(contactForm) {
         contactForm.addEventListener('submit', (e) => {
             e.preventDefault(); // Prevent default form submission
             // Basic validation example (can be expanded)
             const nameInput = contactForm.querySelector('#name');
             const emailInput = contactForm.querySelector('#email');
             const messageInput = contactForm.querySelector('#message');
             const name = nameInput ? nameInput.value : '';
             const email = emailInput ? emailInput.value : '';
             const message = messageInput ? messageInput.value : '';

             if (!name || !email || !message) {
                 alert('Please fill in all required fields (Name, Email, Message).');
                 // Highlight missing fields (optional)
                 if (!name) nameInput?.classList.add('input-error'); else nameInput?.classList.remove('input-error');
                 if (!email) emailInput?.classList.add('input-error'); else emailInput?.classList.remove('input-error');
                 if (!message) messageInput?.classList.add('input-error'); else messageInput?.classList.remove('input-error');
                 return;
             }
             // Remove error classes on success
             nameInput?.classList.remove('input-error');
             emailInput?.classList.remove('input-error');
             messageInput?.classList.remove('input-error');

             alert('Thank you for your message! (Form submission logic not implemented)');
             // TODO: Implement actual form submission (e.g., using Fetch API to send data)
             console.log('Form submitted (simulated):', { name, email, message });
             contactForm.reset();
         });
     }

     // Initial update for active link and animations on page load
     updateActiveLinkOnScroll();
     // Trigger scroll event slightly after load to ensure animations are checked
     setTimeout(() => window.dispatchEvent(new Event('scroll')), 100);

}); 