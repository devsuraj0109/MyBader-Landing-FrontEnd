// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Sticky header shadow
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Navbar active link on click
    const anchorLinks = document.querySelectorAll('.nav-links a');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active from all
            anchorLinks.forEach(l => l.classList.remove('active'));
            // Add active to clicked
            this.classList.add('active');
            // Smooth scroll
            const targetId = this.getAttribute('href');
            if (targetId.length > 1 && document.querySelector(targetId)) {
                e.preventDefault();
                document.querySelector(targetId).scrollIntoView({ behavior: 'smooth', block: 'start' });
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });
    });
    
    // Navbar active link on scroll (Intersection Observer)
    const sections = document.querySelectorAll('section[id]');
    const navMap = {};
    anchorLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            navMap[href.replace('#', '')] = link;
        }
    });
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active from all
                anchorLinks.forEach(l => l.classList.remove('active'));
                // Add active to the nav link for this section
                const id = entry.target.getAttribute('id');
                if (navMap[id]) navMap[id].classList.add('active');
            }
        });
    }, { threshold: 0.5 });
    sections.forEach(section => sectionObserver.observe(section));
    
    // Portfolio filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Intersection Observer for fade-in animations
    const revealEls = document.querySelectorAll('.service-card, .process-step, .portfolio-item, .testimonial-card, .stat');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealEls.forEach(el => {
        el.classList.add('animate');
        observer.observe(el);
    });
    
    // Testimonial slider (simple horizontal scroll)
    const slider = document.querySelector('.testimonial-slider');
    let isDown = false;
    let startX, scrollLeft;
    if (slider) {
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
        });
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
        });
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });
    }
    
    // Initialize EmailJS
    (function() {
        emailjs.init("W6w4ph6cKick5CXwb");
    })();

    // Contact form with EmailJS
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Get current date and time
            const now = new Date();
            const date = now.toLocaleDateString();
            const time = now.toLocaleTimeString();
            
            // Prepare template parameters
            const templateParams = {
                name: name,
                email: email,
                subject: subject || 'Contact Form Submission',
                message: message,
                date: date,
                time: time
            };
            
            // Send email using EmailJS
            emailjs.send('service_df8cnt8', 'template_2llorvr', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    alert('Thank you for your message! We will get back to you within 24 hours.');
                    contactForm.reset();
                }, function(error) {
                    console.log('FAILED...', error);
                    alert('Sorry, there was an error sending your message. Please try again or contact us directly.');
                })
                .finally(function() {
                    // Reset button state
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }
}); 