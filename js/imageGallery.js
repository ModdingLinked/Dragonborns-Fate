document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('showcase-gallery');
    if (!gallery) return;

    initNumberedGallery(gallery);
});

function initNumberedGallery(gallery) {
    const totalImages = parseInt(gallery.dataset.totalImages, 10) || 121;
    const basePath = gallery.dataset.imagePath || './img/Showcase/ScreenShot';

    const displayImg = gallery.querySelector('.gallery-display');
    const labelSpan = gallery.querySelector('.gallery-label');
    const prevBtn = gallery.querySelector('.gallery-prev');
    const nextBtn = gallery.querySelector('.gallery-next');

    let currentIndex = 1;

    function updateGallery() {
        // Update image source and alt attributes dynamically
        displayImg.src = `${basePath}${currentIndex}.webp`;
        displayImg.alt = `Showcase screenshot ${currentIndex}`;

        // Update counter label
        labelSpan.textContent = `${currentIndex} / ${totalImages}`;
    }

    // Previous Arrow: Loop to end if at image 1
    prevBtn.addEventListener('click', () => {
        currentIndex = currentIndex === 1 ? totalImages : currentIndex - 1;
        updateGallery();
    });

    // Next Arrow: Loop to start if at max images
    nextBtn.addEventListener('click', () => {
        currentIndex = currentIndex === totalImages ? 1 : currentIndex + 1;
        updateGallery();
    });

    // Keyboard support (Left/Right Arrow keys)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            currentIndex = currentIndex === 1 ? totalImages : currentIndex - 1;
            updateGallery();
        } else if (e.key === 'ArrowRight') {
            currentIndex = currentIndex === totalImages ? 1 : currentIndex + 1;
            updateGallery();
        }
    });

    // Initialize first image
    updateGallery();
}