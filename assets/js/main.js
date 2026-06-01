document.addEventListener('DOMContentLoaded', () => {

    // 1. Language Switcher Logic
    const langButtons = document.querySelectorAll('.lang-switcher .lang-btn');
    const metaDescription = document.querySelector('meta[name="description"]');
    
    const setLanguage = (lang) => {
        // Toggle body classes
        document.body.classList.remove('lang-pl', 'lang-en');
        document.body.classList.add(`lang-${lang}`);
        
        // Update document title
        const newTitle = document.body.getAttribute(`data-title-${lang}`);
        if (newTitle) {
            document.title = newTitle;
        }
        
        // Update meta description
        const newBio = document.body.getAttribute(`data-bio-${lang}`);
        if (newBio && metaDescription) {
            metaDescription.setAttribute('content', newBio);
        }
        
        // Update form placeholders
        const formInputs = document.querySelectorAll('[data-placeholder-pl]');
        formInputs.forEach(input => {
            const placeholder = input.getAttribute(`data-placeholder-${lang}`);
            if (placeholder) {
                input.placeholder = placeholder;
            }
        });
    };

    // Initialize from localStorage or default 'pl'
    const savedLang = localStorage.getItem('portfolio_lang') || 'pl';
    setLanguage(savedLang);

    // Bind lang buttons click
    langButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = btn.classList.contains('pl') ? 'pl' : 'en';
            localStorage.setItem('portfolio_lang', lang);
            setLanguage(lang);
        });
    });

    // 2. Header Scroll Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Fade-In Animations on Scroll (Intersection Observer)
    const fadeUps = document.querySelectorAll('.fade-up');
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Trigger skill bar animations if inside this element
                const skillFills = entry.target.querySelectorAll('.skill-bar-fill');
                skillFills.forEach(fill => {
                    const progress = fill.getAttribute('data-progress');
                    fill.style.transform = `scaleX(${parseInt(progress) / 100})`;
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeUps.forEach(element => {
        fadeObserver.observe(element);
    });

    // 4. Project Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active from all filters
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active to current filter
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'flex';
                    // Quick fade in
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    // Hide after animation finishes
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // 5. Modal Overlay for Projects
    const modal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    const modalImg = document.getElementById('modalImg');
    const modalCat = document.getElementById('modalCat');
    const modalTitle = document.getElementById('modalTitle');
    const modalTags = document.getElementById('modalTags');
    const modalUrl = document.getElementById('modalUrl');
    const modalDesc = document.getElementById('modalDesc');

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const currentLang = document.body.classList.contains('lang-en') ? 'en' : 'pl';
            const title = card.getAttribute(`data-title-${currentLang}`) || card.getAttribute('data-title') || '';
            const desc = card.getAttribute(`data-desc-${currentLang}`) || card.getAttribute('data-desc') || '';
            const cat = card.getAttribute(`data-cat-${currentLang}`) || card.getAttribute('data-cat') || '';
            const tagsStr = card.getAttribute('data-tags');
            const image = card.getAttribute('data-image');
            const url = card.getAttribute('data-url');

            // Populate Modal
            modalTitle.textContent = title;
            modalDesc.innerHTML = desc.replace(/\n/g, '<br>');
            modalCat.textContent = cat;
            modalImg.src = image;
            modalImg.alt = title;

            // Handle Tags
            modalTags.innerHTML = '';
            if (tagsStr) {
                const tags = tagsStr.split(',');
                tags.forEach(tag => {
                    const cleanTag = tag.trim();
                    if (cleanTag) {
                        const span = document.createElement('span');
                        span.className = 'tag';
                        span.textContent = cleanTag;
                        modalTags.appendChild(span);
                    }
                });
            }

            // Handle URL Button
            if (url) {
                modalUrl.href = url;
                modalUrl.style.display = 'inline-flex';
            } else {
                modalUrl.style.display = 'none';
            }

            // Open Modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close Modal
    const closeModalFunc = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    modalClose.addEventListener('click', closeModalFunc);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalFunc();
        }
    });

    // Close on Escape Key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModalFunc();
        }
    });

    // 6. Contact Form Handler (AJAX Simulator)
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            const submitBtn = contactForm.querySelector('button[type="submit"]');

            // Save default button HTML and disable button
            const originalBtnHTML = submitBtn.innerHTML;
            const currentLang = document.body.classList.contains('lang-en') ? 'en' : 'pl';
            const sendingText = submitBtn.getAttribute(`data-sending-${currentLang}`) || 'Wysyłanie...';
            const successPattern = submitBtn.getAttribute(`data-success-${currentLang}`) || 'Dziękuję {name}!';
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> ${sendingText}`;

            // Simulate AJAX request
            setTimeout(() => {
                formFeedback.style.display = 'block';
                formFeedback.style.background = 'rgba(16, 185, 129, 0.15)';
                formFeedback.style.color = '#10b981';
                formFeedback.style.border = '1px solid rgba(16, 185, 129, 0.3)';
                formFeedback.textContent = successPattern.replace('{name}', name);

                // Reset Form
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;

                // Hide feedback after 5 seconds
                setTimeout(() => {
                    formFeedback.style.display = 'none';
                }, 5000);
            }, 1500);
        });
    }
});
