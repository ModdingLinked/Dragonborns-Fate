document.addEventListener('DOMContentLoaded', function () {
    initGrassComparisonSlider();
});

function initGrassComparisonSlider() {
    const grassSlider = document.querySelector('.grass-comparison-slider');
    if (!grassSlider) return;

    const leftSelect = grassSlider.querySelector('.slider-left-select');
    const rightSelect = grassSlider.querySelector('.slider-right-select');
    const beforeImg = grassSlider.querySelector('.slider-before img');
    const afterImg = grassSlider.querySelector('.slider-after');
    const beforeLabel = grassSlider.querySelector('.slider-label-before');
    const afterLabel = grassSlider.querySelector('.slider-label-after');

    // Set selector
    const setSelectContainer = document.createElement('div');
    setSelectContainer.style.marginBottom = '15px';
    setSelectContainer.innerHTML = `
        <label for="set-select" style="display: block; margin-bottom: 5px; color: white;">Image Set:</label>
        <select id="set-select" class="slider-select slider-set-select">
            <option value="1">Set 1 - Whiterun</option>
            <option value="2">Set 2 - The Reach</option>
            <option value="3">Set 3 - Eastmarch</option>
        </select>
    `;
    grassSlider.insertBefore(setSelectContainer, grassSlider.querySelector('.slider-select-container'));

    const setSelect = grassSlider.querySelector('.slider-set-select');

    const imageSets = {
        '1': {
            'vanilla': './img/Grass LOD/Comparisons/1 - Vanilla.webp',
            'dyndolod': './img/Grass LOD/Comparisons/1 - DynDOLOD.webp',
            'grasslod': './img/Grass LOD/Comparisons/1 - DynDOLOD + Grass LOD.webp'
        },
        '2': {
            'vanilla': './img/Grass LOD/Comparisons/2 - Vanilla.webp',
            'dyndolod': './img/Grass LOD/Comparisons/2 - DynDOLOD.webp',
            'grasslod': './img/Grass LOD/Comparisons/2 - DynDOLOD + Grass LOD.webp'
        },
        '3': {
            'vanilla': './img/Grass LOD/Comparisons/3 - Vanilla.webp',
            'dyndolod': './img/Grass LOD/Comparisons/3 - DynDOLOD.webp',
            'grasslod': './img/Grass LOD/Comparisons/3 - DynDOLOD + Grass LOD.webp'
        }
    };

    let currentSet = '1';
    let leftOption = 'vanilla';
    let rightOption = 'grasslod'; // Default to DynDOLOD + Grass LOD for right side
    let lastPosition = 0.5; // Track position (50% default)

    // Initial setup
    updateImages();

    // Update images based on current selections
    function updateImages() {
        beforeImg.src = imageSets[currentSet][leftOption];
        afterImg.src = imageSets[currentSet][rightOption];

        // Update labels
        beforeLabel.textContent = leftSelect.options[leftSelect.selectedIndex].textContent;
        afterLabel.textContent = rightSelect.options[rightSelect.selectedIndex].textContent;

        // Reset slider position when changing images
        resetSliderPosition();
    }

    // Update set selection
    setSelect.addEventListener('change', function () {
        currentSet = this.value;
        updateImages();
    });

    // Update left image when left selection changes
    leftSelect.addEventListener('change', function () {
        leftOption = this.value;
        updateImages();
    });

    // Update right image when right selection changes  
    rightSelect.addEventListener('change', function () {
        rightOption = this.value;
        updateImages();
    });

    // Set initial selected options
    rightSelect.value = 'grasslod';

    setupSlider();

    // Reset slider to middle position
    function resetSliderPosition() {
        const sliderContainer = grassSlider.querySelector('.slider-container');
        const handle = grassSlider.querySelector('.slider-handle');
        const beforeDiv = grassSlider.querySelector('.slider-before');

        const middlePosition = 0.5; // 50%
        const containerWidth = sliderContainer.offsetWidth;

        // Apply all position changes at once to avoid stutter
        Object.assign(beforeDiv.style, {
            width: '50%',
            transition: 'none'
        });

        Object.assign(handle.style, {
            left: '0',
            transform: `translateX(${middlePosition * containerWidth}px) translateX(-50%)`,
            transition: 'none'
        });

        lastPosition = 0.5;

        // Force browser to apply changes immediately
        void beforeDiv.offsetWidth;

        // Remove the transition properties after a short delay
        setTimeout(() => {
            beforeDiv.style.transition = '';
            handle.style.transition = '';
        }, 50);

        // Set proper width for before image
        beforeImg.style.width = sliderContainer.offsetWidth + 'px';
        beforeImg.style.maxWidth = 'none';
    }

    function setupSlider() {
        const sliderContainer = grassSlider.querySelector('.slider-container');
        const handle = grassSlider.querySelector('.slider-handle');
        const beforeDiv = grassSlider.querySelector('.slider-before');

        let isDragging = false;
        let animationFrame = null;

        // Update slider position
        function updateSliderPosition(clientX) {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }

            animationFrame = requestAnimationFrame(() => {
                const rect = sliderContainer.getBoundingClientRect();
                let position = (clientX - rect.left) / rect.width;
                position = Math.max(0, Math.min(1, position));

                if (Math.abs(position - lastPosition) > 0.001) {
                    lastPosition = position;
                    beforeDiv.style.width = (position * 100) + '%';
                    handle.style.transform = `translateX(${position * sliderContainer.offsetWidth}px) translateX(-50%)`;
                    handle.style.left = '0';

                    const containerWidth = sliderContainer.offsetWidth;
                    beforeImg.style.width = `${containerWidth}px`;
                    beforeImg.style.maxWidth = 'none';

                    if (window.innerWidth <= 470) {
                        beforeImg.style.width = `${containerWidth}px`;
                        beforeImg.style.left = '0';
                    }
                }
            });
        }

        // Mouse events
        sliderContainer.addEventListener('mousedown', function (e) {
            e.preventDefault();
            isDragging = true;
            updateSliderPosition(e.clientX);
        });

        handle.addEventListener('mousedown', function (e) {
            e.preventDefault();
            e.stopPropagation();
            isDragging = true;
        });

        document.addEventListener('pointermove', function (e) {
            if (!isDragging) return;
            e.preventDefault();
            updateSliderPosition(e.clientX);
        });

        document.addEventListener('pointerup', function () {
            isDragging = false;
        });

        // Touch events
        sliderContainer.addEventListener('touchstart', function (e) {
            e.preventDefault();
            isDragging = true;
            updateSliderPosition(e.touches[0].clientX);
        }, { passive: false });

        handle.addEventListener('touchstart', function (e) {
            e.preventDefault();
            isDragging = true;
        }, { passive: false });

        document.addEventListener('touchmove', function (e) {
            if (!isDragging) return;
            e.preventDefault();
            updateSliderPosition(e.touches[0].clientX);
        }, { passive: false });

        document.addEventListener('touchend', function () {
            isDragging = false;
        });

        // Prevent dragging of images
        sliderContainer.addEventListener('dragstart', e => e.preventDefault());
        beforeImg.addEventListener('dragstart', e => e.preventDefault());
        afterImg.addEventListener('dragstart', e => e.preventDefault());

        // Window resize
        let resizeTimeout;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function () {
                if (afterImg.complete) {
                    const aspectRatio = afterImg.naturalHeight / afterImg.naturalWidth;
                    sliderContainer.style.height = (sliderContainer.offsetWidth * aspectRatio) + 'px';

                    // Make sure image width is always correct on resize
                    const containerWidth = sliderContainer.offsetWidth;
                    beforeImg.style.width = `${containerWidth}px`;
                    beforeImg.style.maxWidth = 'none';

                    // Update handle position on resize
                    handle.style.transform = `translateX(${lastPosition * containerWidth}px) translateX(-50%)`;
                }
            }, 100);
        });

        // Set initial width and make sure maxWidth doesn't interfere
        beforeImg.style.width = sliderContainer.offsetWidth + 'px';
        beforeImg.style.maxWidth = 'none';

        // Set initial position
        resetSliderPosition();
    }
}