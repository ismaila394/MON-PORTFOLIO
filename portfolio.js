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
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // Animation en cascade pour les éléments de grille
            if (entry.target.classList.contains('project-item')) {
                const items = document.querySelectorAll('.project-item');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        }
    });
}, observerOptions);

// Observer tous les éléments à animer
const elementsToAnimate = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .project-item');
elementsToAnimate.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    observer.observe(el);
});

// ==================== Effet parallaxe sur les images ====================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.droite img, .gauche1 img');
    
    parallaxElements.forEach(el => {
        const speed = 0.5;
        const yPos = -(scrolled * speed);
        el.style.transform = `translateY(${yPos}px)`;
    });
});

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
        e.preventDefault();

        const success = document.getElementById('formSuccess');
        if (success) {
            success.style.display = 'flex';
        }

        // Optionnel: réinitialiser le formulaire et remonter à l'alerte
        contactForm.reset();
        success && success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}