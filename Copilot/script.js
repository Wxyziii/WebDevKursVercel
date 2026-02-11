// Portfolio JavaScript

// Smooth scroll animasjon for seksjoner
document.addEventListener('DOMContentLoaded', () => {
    // Legg til fade-in effekt når seksjoner kommer inn i viewport
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Legg til hover-effekt på ferdigheter
    const skills = document.querySelectorAll('.ferdigheter li');
    skills.forEach(skill => {
        skill.addEventListener('mouseenter', () => {
            skill.style.transform = 'translateX(10px) scale(1.02)';
        });
        skill.addEventListener('mouseleave', () => {
            skill.style.transform = 'translateX(0) scale(1)';
        });
    });

    // Typing-effekt for tittel (valgfritt)
    const tittel = document.querySelector('.tittel');
    if (tittel) {
        const originalText = tittel.textContent;
        tittel.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < originalText.length) {
                tittel.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        // Start typing-effekt etter en kort forsinkelse
        setTimeout(typeWriter, 500);
    }

    // Smooth scroll for interne lenker
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Parallax-effekt på header (subtil)
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        const scrolled = window.pageYOffset;
        header.style.backgroundPositionY = scrolled * 0.5 + 'px';
    });

    console.log('Portfolio lastet! 🚀');
});
