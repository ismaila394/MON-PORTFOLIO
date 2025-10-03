// ==================== Variables globales ====================
const header = document.getElementById('header');
const burgerMenu = document.getElementById('burgerMenu');
const navLinks = document.querySelector('.nav-links');
const scrollToTopBtn = document.getElementById('scrollToTop');

// ==================== Menu Burger Toggle ====================
if (burgerMenu) {
    burgerMenu.addEventListener('click', () => {
        burgerMenu.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Fermer le menu quand on clique sur un lien
    const menuLinks = document.querySelectorAll('.nav-links a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            burgerMenu.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Fermer le menu quand on clique en dehors
    document.addEventListener('click', (e) => {
        if (!burgerMenu.contains(e.target) && !navLinks.contains(e.target)) {
            burgerMenu.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// ==================== Effet de scroll sur le header ====================
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Ajouter classe scrolled
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Afficher/masquer le bouton scroll to top
    if (currentScroll > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
    
    lastScroll = currentScroll;
});

// ==================== Scroll to Top ====================
if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==================== Smooth Scroll pour les liens d'ancrage ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Ne pas empêcher le comportement par défaut pour les liens vides
        if (href === '#' || href === '') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== Animation au scroll (Intersection Observer) ====================
const isMobile = window.matchMedia('(max-width: 768px)').matches;
const observerOptions = {
    threshold: 0,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // Animation en cascade pour les éléments de grille
            if (!isMobile && entry.target.classList.contains('project-item')) {
                const items = document.querySelectorAll('.project-item');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }

            // Lancer les compteurs lorsqu'ils entrent en vue
            if (!isMobile && entry.target.classList.contains('stat-number')) {
                // Rendre visible le compteur et lancer l'animation
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'none';
                const targetValue = parseInt(entry.target.getAttribute('data-target')) || 0;
                animateCounter(entry.target, targetValue);
                observer.unobserve(entry.target);
            }

            // Lancer l'animation des barres de compétences
            if (!isMobile && entry.target.classList.contains('skill-progress')) {
                const progress = parseInt(entry.target.getAttribute('data-progress')) || 0;
                entry.target.style.width = progress + '%';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'none';
                observer.unobserve(entry.target);
            }
        }
    });
}, observerOptions);

// Observer tous les éléments à animer
if (!isMobile) {
    // Masquer uniquement les éléments visuels (pas les compteurs)
    const visualElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .project-item');
    visualElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        observer.observe(el);
    });

    // Observer les compteurs sans les masquer d'emblée
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(num => observer.observe(num));

    // Observer les barres de compétences (partent de 0)
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        bar.style.width = '0%';
        observer.observe(bar);
    });
}
// Sur mobile: fixer immédiatement les barres au pourcentage, sans animation
else {
    const applyMobileSkillsAndCounters = () => {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            const progress = parseInt(bar.getAttribute('data-progress')) || 0;
            // Désactiver la transition pour éviter tout clignotement
            bar.style.transition = 'none';
            bar.style.width = progress + '%';
        });

        // Fixer les compteurs directement à leur valeur cible sur mobile
        const mobileCounters = document.querySelectorAll('.stat-number');
        mobileCounters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target')) || 0;
            counter.style.opacity = '1';
            counter.style.transform = 'none';
            counter.textContent = target;
        });
    };

    // Exécuter immédiatement et après le chargement pour garantir l'application
    applyMobileSkillsAndCounters();
    window.addEventListener('load', () => {
        // Petit délai pour laisser le layout s'initialiser
        setTimeout(applyMobileSkillsAndCounters, 50);
    });
}

// Observer séparément les barres de compétences sans masquer leur conteneur
const skillBars = document.querySelectorAll('.skill-progress');
skillBars.forEach(bar => {
    // S'assurer que les barres démarrent bien à 0
    bar.style.width = '0%';
    observer.observe(bar);
});

// ==================== Effet parallaxe sur les images (ajusté) ====================
// Appliquer la parallaxe sur les conteneurs pour ne pas casser le hover scale des images
if (!isMobile) {
    const applyParallax = () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.droite .image-wrapper, .gauche1');

        parallaxElements.forEach(el => {
            // Vitesse réduite pour éviter que l'élément ne monte trop
            const speed = 0.15;

            // Calcul relatif à la position de l'élément dans la page
            const elTop = el.getBoundingClientRect().top + window.pageYOffset;
            const relativeScroll = scrolled - elTop;

            // Déplacement limité pour rester subtil et maîtrisé
            let yPos = -(relativeScroll * speed);
            if (yPos < -60) yPos = -60; // limite vers le haut
            if (yPos > 30) yPos = 30;   // limite vers le bas

            el.style.transform = `translateY(${yPos}px)`;
            el.style.willChange = 'transform';
        });
    };

    // Utiliser scroll + raf pour fluidité
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                applyParallax();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Premier calcul au chargement
    applyParallax();
}

// ==================== Effet de typing sur le titre (optionnel) ====================
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Activer l'effet typing au chargement de la page (optionnel)
// const mainTitle = document.querySelector('.gauche h1');
// if (mainTitle) {
//     const titleText = mainTitle.textContent;
//     typeWriter(mainTitle, titleText, 50);
// }

// ==================== Compteur animé pour les statistiques ====================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

// Observer les compteurs (si vous en ajoutez)
const counters = document.querySelectorAll('.counter');
counters.forEach(counter => {
    observer.observe(counter);
    counter.addEventListener('animate', () => {
        const target = parseInt(counter.getAttribute('data-target'));
        animateCounter(counter, target);
    });
});

// ==================== Modal pour les projets (optionnel) ====================
const projectButtons = document.querySelectorAll('.view-project');

projectButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const projectItem = button.closest('.project-item');
        const projectTitle = projectItem.querySelector('h3').textContent;
        
        // Ici vous pouvez ouvrir une modale ou rediriger vers une page de détail
        console.log(`Voir le projet: ${projectTitle}`);
        
        // Exemple d'alerte (à remplacer par une vraie modale)
        alert(`Fonctionnalité en développement pour: ${projectTitle}`);
    });
});

// ==================== Gestion du focus pour l'accessibilité ====================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('user-is-tabbing');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('user-is-tabbing');
});

// ==================== Lazy Loading des images ====================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ==================== Effet de curseur personnalisé (optionnel) ====================
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    const speed = 0.2;
    
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    requestAnimationFrame(animateCursor);
}

// Décommenter pour activer le curseur personnalisé
// animateCursor();

// ==================== Préchargement des images ====================
function preloadImages() {
    const images = document.querySelectorAll('img');
    let loadedCount = 0;
    
    images.forEach(img => {
        if (img.complete) {
            loadedCount++;
        } else {
            img.addEventListener('load', () => {
                loadedCount++;
                if (loadedCount === images.length) {
                    document.body.classList.add('images-loaded');
                }
            });
        }
    });
    
    if (loadedCount === images.length) {
        document.body.classList.add('images-loaded');
    }
}

// Lancer le préchargement
preloadImages();

// ==================== Gestion des erreurs d'images ====================
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.style.display = 'none';
        console.error(`Erreur de chargement de l'image: ${this.src}`);
    });
});

// ==================== Animation de chargement ====================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Lancer les animations après le chargement
    setTimeout(() => {
        document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }, 100);

    // Afficher le message de succès après redirection (?success=1)
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === '1') {
        const success = document.getElementById('formSuccess');
        if (success) {
            success.style.display = 'flex';
            // Nettoyer l'URL pour enlever le paramètre
            history.replaceState({}, '', window.location.pathname);
        }
    }
});

// ==================== Console Message ====================
console.log('%c✨ Portfolio développé par Ismaila Diakhate', 'color: #2be1e1; font-size: 16px; font-weight: bold;');
console.log('%c🚀 Développeur Frontend passionné', 'color: #666; font-size: 14px;');

// ==================== Service Worker (pour PWA - optionnel) ====================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Décommenter pour activer le service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered:', registration))
        //     .catch(error => console.log('SW registration failed:', error));
    });
}

// ==================== Contact form handling ====================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        // Laisser le formulaire soumettre vers FormSubmit
        const success = document.getElementById('formSuccess');
        success && (success.style.display = 'flex');
    });
}