document.addEventListener('DOMContentLoaded', () => {
    initializeComparisons();
});

function initializeComparisons() {
    const sliders = document.querySelectorAll('.image-slider');

    sliders.forEach(slider => {
        const setSelect = slider.querySelector('.comparison-set-select');
        const leftSelect = slider.querySelector('.comparison-select-left');
        const rightSelect = slider.querySelector('.comparison-select-right');
        const standardSelect = slider.querySelector('.comparison-select');

        if (setSelect && leftSelect && rightSelect) {
            // Three-dropdown comparison slider
            initThreeDropdownComparisonSlider(slider);
        } else if (standardSelect) {
            // Standard comparison slider
            initStandardComparisonSlider(slider);
        }
    });
}

function initStandardComparisonSlider(slider) {
    const handle = slider.querySelector('.comparison-handle');
    const beforeImage = slider.querySelector('.comparison-before');
    const afterImage = slider.querySelector('.comparison-after');
    const select = slider.querySelector('.comparison-select');
    const sliderEl = slider.querySelector('.comparison-slider');
    let isResizing = false;
    let rect;

    // Get the image path from data attribute
    const imagePath = slider.dataset.imagePath;

    // Initialize with first option
    if (select && select.options.length > 0) {
        const firstValue = select.options[0].value;
        beforeImage.src = `${imagePath}/${firstValue} - Before.webp`;
        afterImage.src = `${imagePath}/${firstValue} - After.webp`;
    }

    // Handle image set changes
    if (select) {
        select.addEventListener('change', (e) => {
            const value = e.target.value;
            beforeImage.src = `${imagePath}/${value} - Before.webp`;
            afterImage.src = `${imagePath}/${value} - After.webp`;
            beforeImage.style.clipPath = `polygon(0 0, 50% 0, 50% 100%, 0 100%)`;
            handle.style.left = '50%';
        });
    }

    // Mouse events
    handle.addEventListener('mousedown', (e) => {
        isResizing = true;
        rect = sliderEl.getBoundingClientRect();
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        handleResize(e.clientX);
    });

    document.addEventListener('mouseup', () => {
        isResizing = false;
    });

    // Touch events
    handle.addEventListener('touchstart', (e) => {
        isResizing = true;
        rect = sliderEl.getBoundingClientRect();
        e.preventDefault();
    });

    document.addEventListener('touchmove', (e) => {
        if (!isResizing) return;
        handleResize(e.touches[0].clientX);
    });

    document.addEventListener('touchend', () => {
        isResizing = false;
    });

    function handleResize(clientX) {
        const x = Math.min(Math.max(0, clientX - rect.left), rect.width);
        const percent = (x / rect.width) * 100;

        requestAnimationFrame(() => {
            beforeImage.style.clipPath = `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%)`;
            handle.style.left = `${percent}%`;
        });
    }
}

function initThreeDropdownComparisonSlider(slider) {
    const handle = slider.querySelector('.comparison-handle');
    const beforeImage = slider.querySelector('.comparison-before');
    const afterImage = slider.querySelector('.comparison-after');
    const setSelect = slider.querySelector('.comparison-set-select');
    const leftSelect = slider.querySelector('.comparison-select-left');
    const rightSelect = slider.querySelector('.comparison-select-right');
    const sliderEl = slider.querySelector('.comparison-slider');
    const beforeLabel = slider.querySelector('.label-before');
    const afterLabel = slider.querySelector('.label-after');
    let isResizing = false;
    let rect;

    // Get the image path from data attribute
    const imagePath = slider.dataset.imagePath || './img/Grass LOD/Comparisons';

    // Function to get image path from current selections
    function getImagePath(type) {
        const setNum = setSelect.value;

        const typeMap = {
            'vanilla': 'Vanilla',
            'dyndolod': 'DynDOLOD',
            'grasslod': 'DynDOLOD + Grass LOD'
        };

        return `${imagePath}/${setNum} - ${typeMap[type]}.webp`;
    }

    // Function to update labels
    function updateLabels() {
        if (beforeLabel && leftSelect.selectedOptions[0]) {
            beforeLabel.textContent = leftSelect.selectedOptions[0].dataset.label || leftSelect.selectedOptions[0].textContent;
        }
        if (afterLabel && rightSelect.selectedOptions[0]) {
            afterLabel.textContent = rightSelect.selectedOptions[0].dataset.label || rightSelect.selectedOptions[0].textContent;
        }
    }

    // Function to update images
    function updateImages() {
        beforeImage.src = getImagePath(leftSelect.value);
        afterImage.src = getImagePath(rightSelect.value);
        updateLabels();

        // Reset slider position
        beforeImage.style.clipPath = `polygon(0 0, 50% 0, 50% 100%, 0 100%)`;
        handle.style.left = '50%';
    }

    // Initialize with current selections
    updateImages();

    // Handle dropdown changes
    setSelect.addEventListener('change', updateImages);
    leftSelect.addEventListener('change', updateImages);
    rightSelect.addEventListener('change', updateImages);

    // Mouse events
    handle.addEventListener('mousedown', (e) => {
        isResizing = true;
        rect = sliderEl.getBoundingClientRect();
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        handleResize(e.clientX);
    });

    document.addEventListener('mouseup', () => {
        isResizing = false;
    });

    // Touch events
    handle.addEventListener('touchstart', (e) => {
        isResizing = true;
        rect = sliderEl.getBoundingClientRect();
        e.preventDefault();
    });

    document.addEventListener('touchmove', (e) => {
        if (!isResizing) return;
        handleResize(e.touches[0].clientX);
    });

    document.addEventListener('touchend', () => {
        isResizing = false;
    });

    function handleResize(clientX) {
        const x = Math.min(Math.max(0, clientX - rect.left), rect.width);
        const percent = (x / rect.width) * 100;

        requestAnimationFrame(() => {
            beforeImage.style.clipPath = `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%)`;
            handle.style.left = `${percent}%`;
        });
    }
}