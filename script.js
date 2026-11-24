

const gallery = document.querySelector('.gallery-list');

async function loadGallery() {

    try {

        const response = await fetch('gallery.md');

        if (!response.ok) {
            throw new Error('Markdown file not found');
        }

        const markdown = await response.text();
        const html = marked.parse(markdown);

        const container = document.createElement('div');
        container.innerHTML = html;

        const markdownImages = container.querySelectorAll('img');
        const galleryCards = gallery.querySelectorAll('.gallery-item');

        for (let i = 0; i < Math.min(markdownImages.length, galleryCards.length); i++) {

            const image = galleryCards[i].querySelector('.foto img');
            const path = markdownImages[i].getAttribute('src');

            if (!image || !path) continue;

            const url = new URL(path, new URL('gallery.md', window.location.href));

            // Check if image exists
            try {

                const check = await fetch(url, { method: 'HEAD' });

                console.log(
                    check.ok ? 'FOUND:' : 'NOT FOUND:',
                    url.href,
                    check.status
                );

                if (check.ok) {
                    image.src = url.href;
                    image.alt = markdownImages[i].alt || '';
                }

            } catch (error) {

                console.error('Image check error:', url.href, error);

            }

        }

    } catch (error) {

        console.error('Gallery loading error:', error);

    }

}


// ~ Carousel ~

function initCarousel() {

    const slides = document.querySelectorAll('.carousel-slide');

    const previous = document.querySelector('#carousel-previous');
    const next = document.querySelector('#carousel-next');

    const indicators = document.querySelectorAll(
        '#carousel-indicators button'
    );

    const play = document.querySelector('#carousel-play');

    if (!slides.length || !previous || !next || !play) {
        console.error('Carousel elements not found!');
        return;
    }

    let currentSlide = 0;
    let autoplay = true;
    let timer;

    function showSlide(index) {

        currentSlide = (index + slides.length) % slides.length;

        slides.forEach((slide, i) => {

            slide.style.display = i === currentSlide ? 'grid' : 'none';

        });

        indicators.forEach((button, i) => {

            button.classList.toggle('active', i === currentSlide);

        });

        // Smooth animation using JavaScript
        slides[currentSlide].animate(
            [
                { opacity: 0, transform: 'translateX(20px)' },
                { opacity: 1, transform: 'translateX(0)' }
            ],
            {
                duration: 400,
                easing: 'ease-out'
            }
        );

    }

    function startAutoplay() {

        clearInterval(timer);

        if (autoplay) {

            timer = setInterval(() => {
                showSlide(currentSlide + 1);
            }, 5000);

        }

    }

    // Previous button
    previous.addEventListener('click', () => {

        showSlide(currentSlide - 1);
        startAutoplay();

    });

    // Next button
    next.addEventListener('click', () => {

        showSlide(currentSlide + 1);
        startAutoplay();

    });

    // Indicator buttons
    indicators.forEach(button => {

        button.addEventListener('click', () => {

            showSlide(Number(button.dataset.slide));
            startAutoplay();

        });

    });

    // Autoplay button
    play.addEventListener('click', () => {

        autoplay = !autoplay;

        play.textContent = autoplay
            ? 'Apturēt automātisko pārslēgšanu'
            : 'Turpināt automātisko pārslēgšanu';

        startAutoplay();

    });

    showSlide(0);
    startAutoplay();

}

// ~ Initialize ~

loadGallery();
initCarousel();
