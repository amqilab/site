// Function to load recent images dynamically
async function loadRecentImages() {
    try {
        // Fetch the images list from JSON file
        const response = await fetch('recents/images.json');
        const imageFiles = await response.json();

        if (imageFiles.length === 0) {
            console.log('No images found in recents/images.json');
            return;
        }

        // Group by date
        const dateGroups = {};
        imageFiles.forEach(img => {
            if (!dateGroups[img.date]) {
                dateGroups[img.date] = [];
            }
            dateGroups[img.date].push(img);
        });

        // Get the last 10 dates
        const recentDates = Object.keys(dateGroups).slice(0, 10);

        // Generate carousel items
        const carouselItems = document.getElementById('carouselItems');
        const carouselIndicators = document.getElementById('carouselIndicators');

        // Clear existing content
        carouselItems.innerHTML = '';
        carouselIndicators.innerHTML = '';

        let slideIndex = 0;
        recentDates.forEach(date => {
            const images = dateGroups[date];
            images.forEach(img => {
                // Create carousel item
                const item = document.createElement('div');
                item.className = slideIndex === 0 ? 'carousel-item active' : 'carousel-item';
                item.innerHTML = `<img src="recents/${img.filename}" alt="${img.name}" />`;
                carouselItems.appendChild(item);

                // Create indicator (Bootstrap 5 uses button elements)
                const indicator = document.createElement('button');
                indicator.type = 'button';
                indicator.setAttribute('data-bs-target', '#recenthl');
                indicator.setAttribute('data-bs-slide-to', slideIndex);
                indicator.setAttribute('aria-label', `Slide ${slideIndex + 1}`);
                if (slideIndex === 0) {
                    indicator.className = 'active';
                    indicator.setAttribute('aria-current', 'true');
                }
                carouselIndicators.appendChild(indicator);

                slideIndex++;
            });
        });

        console.log(`Loaded ${slideIndex} images from ${recentDates.length} recent dates`);

        // Reinitialize the carousel to enable functionality
        const carouselElement = document.getElementById('recenthl');
        // Dispose of any existing carousel instance
        const existingCarousel = bootstrap.Carousel.getInstance(carouselElement);
        if (existingCarousel) {
            existingCarousel.dispose();
        }
        // Create new carousel instance
        new bootstrap.Carousel(carouselElement, {
            interval: 3000,  // Auto-advance every 3 seconds
            ride: 'carousel',
            pause: 'hover',
            wrap: true
        });

    } catch (error) {
        console.error('Error loading recent images:', error);
        console.log('Make sure to run: python3 update_recents.py');
    }
}

// Load images when DOM is ready
document.addEventListener('DOMContentLoaded', loadRecentImages);