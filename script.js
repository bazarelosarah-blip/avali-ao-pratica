document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const themeToggle = document.getElementById('themeToggle');
    const navLinks = document.querySelectorAll('.nav a');

    // Alternar menu mobile
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Alternar modo de Alto Contraste
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('high-contrast');
    });

    // Rolagem suave e fechar menu ao clicar no link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }

            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });
});