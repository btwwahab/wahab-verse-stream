let categoriesData = {
  allGenres: [],
  currentlyDisplayed: 0,
  categoriesPerLoad: 5
};

document.addEventListener('DOMContentLoaded', function () {
  initializeNeuroFlix();
});

function initializeNeuroFlix() {
  createParticleField();
  setupScrollEffects();
  setupInteractions();
  setupSearch();

  loadContentLibrary().then(() => {
    populateCategoryPills();
    createDynamicSections();
  }).catch(error => {
    console.error('Failed to initialize:', error);
    showNotification('Failed to load content. Please check your internet connection.', 'danger');
  });
}

function createParticleField() {
  const particleField = document.getElementById('particleField');
  if (!particleField) return;

  const particleCount = window.innerWidth > 768 ? 15 : 8;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 20 + 's';
    particle.style.animationDuration = (15 + Math.random() * 10) + 's';
    particleField.appendChild(particle);
  }
}

function setupScrollEffects() {
  const navbar = document.getElementById('mainNavbar');
  if (!navbar) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 100) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}

function populateCarousel(carouselId, content) {
  const carousel = document.getElementById(carouselId);

  if (!carousel) {
    console.error(`Carousel element ${carouselId} not found`);
    return;
  }

  carousel.innerHTML = '';

  if (content.length === 0) {
    carousel.innerHTML = `
      <div style="padding: 2rem; text-align: center; color: var(--text-muted); width: 100%;">
        <i class="fas fa-film" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
        <br>No content available
      </div>
    `;
    return;
  }

  content.forEach((item) => {
    const card = createMovieCard(item);
    if (card) {
      carousel.appendChild(card);
    }
  });
}

function createMovieCard(item) {
  if (!item) {
    return document.createElement('div');
  }

  const cardDiv = document.createElement('div');
  cardDiv.className = 'movie-card';
  cardDiv.onclick = () => showMovieInfo(item);

  const posterUrl = item.poster || `https://via.placeholder.com/300x400/1a1a1a/ffffff?text=${encodeURIComponent(item.title || 'No Title')}`;

  cardDiv.innerHTML = `
    <img src="${posterUrl}" alt="${item.title || 'Unknown'}" class="movie-poster" 
         onerror="this.src='https://via.placeholder.com/300x400/1a1a1a/ffffff?text=${encodeURIComponent(item.title || 'Error')}'">
    <div class="movie-info">
      <h5 class="movie-title">${item.title || 'Unknown Title'}</h5>
      <p class="movie-genre">${item.genre || 'Unknown Genre'}</p>
      <div class="movie-rating">
        <span class="rating-stars">${generateStars(item.rating || 0)}</span>
        <span class="rating-value">${(item.rating || 0).toFixed(1)}</span>
      </div>
    </div>
  `;

  return cardDiv;
}

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  let stars = '';

  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>';
  }
  if (hasHalfStar) {
    stars += '<i class="fas fa-star-half-alt"></i>';
  }
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star"></i>';
  }

  return stars;
}

function scrollCarousel(carouselId, direction) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) {
    console.error(`Carousel ${carouselId} not found`);
    return;
  }

  const scrollAmount = 350;
  const currentScroll = carousel.scrollLeft;
  const targetScroll = currentScroll + (direction * scrollAmount);
  const maxScroll = carousel.scrollWidth - carousel.clientWidth;
  const finalScroll = Math.max(0, Math.min(targetScroll, maxScroll));

  carousel.scrollTo({
    left: finalScroll,
    behavior: 'smooth'
  });
}

function cleanupDuplicateSections() {
  const allSections = document.querySelectorAll('[id^="genre-"]');
  const seenIds = new Set();

  allSections.forEach(section => {
    if (seenIds.has(section.id)) {
      section.remove();
      console.log(`Removed duplicate section: ${section.id}`);
    } else {
      seenIds.add(section.id);

      const carouselContainer = section.querySelector('.carousel-container');
      if (carouselContainer) {
        const prevButtons = carouselContainer.querySelectorAll('.carousel-btn.prev');
        const nextButtons = carouselContainer.querySelectorAll('.carousel-btn.next');

        for (let i = 1; i < prevButtons.length; i++) {
          prevButtons[i].remove();
        }

        for (let i = 1; i < nextButtons.length; i++) {
          nextButtons[i].remove();
        }
      }
    }
  });
}

async function showMovieInfo(movie, directPlay = false) {
  const modalElement = document.getElementById('movieModal');
  if (!modalElement) {
    console.error('Movie modal not found');
    return;
  }

  const modal = new bootstrap.Modal(modalElement);
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  if (modalTitle) modalTitle.textContent = movie.title;

  if (modalBody) {
    modalBody.innerHTML = `
      <div class="loading">
        <i class="fas fa-spinner"></i>
        <p>Neural connection in progress...</p>
      </div>
    `;
  }

  modal.show();

  const videos = await fetchVideos(movie.id, movie.mediaType);
  const trailer = videos.find(video =>
    video.type === 'Trailer' && video.site === 'YouTube') || videos[0];

  if (modalBody) {
    modalBody.innerHTML = `
      <div class="row">
        <div class="col-12 mb-4">
          ${trailer ?
        `<div class="video-container">
              <iframe src="https://www.youtube.com/embed/${trailer.key}${directPlay ? '?autoplay=1' : ''}" 
                      frameborder="0" allowfullscreen
                      class="neural-video"></iframe>
            </div>` :
        `<img src="${movie.backdrop || movie.poster}" alt="${movie.title}" 
                  class="img-fluid rounded glass-effect w-100" 
                  style="box-shadow: var(--glow-primary);">`
      }
        </div>
        <div class="col-md-4">
          <img src="${movie.poster}" alt="${movie.title}" 
               class="img-fluid rounded glass-effect" 
               style="box-shadow: var(--glow-primary);">
        </div>
        <div class="col-md-8">
          <h4 class="mb-3 text-glow" style="color: var(--primary);">${movie.title}</h4>
          <span class="platform-available">
            <i class="fas fa-check-circle me-1"></i>Available on WAHAB VERSE
          </span>
          <p class="mb-2 mt-3"><strong>Genre:</strong> <span style="color: var(--secondary);">${movie.genre}</span></p>
          <div class="mb-3">
            <span style="color: var(--accent);">${generateStars(movie.rating)}</span>
            <span class="ms-2" style="color: var(--text-bright);">${movie.rating.toFixed(1)}/5</span>
          </div>
          <p class="lead" style="color: var(--text-secondary);">${movie.overview}</p>
          <div class="mt-4">
            <span class="badge glass-effect me-2 p-2" style="color: var(--primary);">
              <i class="fas fa-video me-1"></i>${movie.mediaType === 'tv' ? 'Series' : 'Movie'}
            </span>
            <span class="badge glass-effect me-2 p-2" style="color: var(--secondary);">
              <i class="fas fa-calendar me-1"></i>${movie.year}
            </span>
          </div>
        </div>
      </div>
    `;
  }

  // Store movie data for play button
  window.currentMovie = { movie, trailer };
  
  // Auto-play if requested from chat
  if (directPlay && trailer) {
    setTimeout(() => {
      playMoviePreview();
    }, 1000);
  }
}

// New function to handle full-screen preview
function playMoviePreview() {
  const { movie, trailer } = window.currentMovie || {};
  
  if (!movie) {
    showNotification('Movie data not available', 'warning');
    return;
  }

  // Close the current modal first
  const currentModal = bootstrap.Modal.getInstance(document.getElementById('movieModal'));
  if (currentModal) {
    currentModal.hide();
  }

  // Create full-screen preview
  createFullScreenPreview(movie, trailer);
}

function createFullScreenPreview(movie, trailer) {
  // Remove existing preview if any
  const existingPreview = document.getElementById('fullScreenPreview');
  if (existingPreview) {
    existingPreview.remove();
  }

  // Create full-screen container
  const fullScreenDiv = document.createElement('div');
  fullScreenDiv.id = 'fullScreenPreview';
  
  // Create content wrapper
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'preview-wrapper';

  // Create header with movie info and controls
  const header = document.createElement('div');
  header.className = 'preview-header';

  header.innerHTML = `
    <div class="preview-title-area">
      <h2 class="preview-title">
        <i class="fas fa-play-circle me-2"></i>${movie.title}
      </h2>
      <p class="preview-subtitle">
        ${movie.genre} • ${movie.year} • ${generateStars(movie.rating)} ${movie.rating.toFixed(1)}/5
      </p>
    </div>
    <div class="preview-controls">
      <button onclick="toggleFullscreen()" class="preview-btn fullscreen-btn">
        <i class="fas fa-expand"></i> <span class="btn-text">Fullscreen</span>
      </button>
      <button onclick="closeFullScreenPreview()" class="preview-btn close-btn">
        <i class="fas fa-times"></i> <span class="btn-text">Exit</span>
      </button>
    </div>
  `;

  // Create video container
  const videoContainer = document.createElement('div');
  videoContainer.className = 'preview-container';

  if (trailer) {
    // Show trailer in full screen with additional parameters for mobile
    videoContainer.innerHTML = `
      <iframe 
        src="https://www.youtube.com/embed/${trailer.key}?autoplay=1&controls=1&modestbranding=1&rel=0&playsinline=1"
        frameborder="0" 
        allowfullscreen
        allow="autoplay; encrypted-media"
        class="preview-video">
      </iframe>
    `;
  } else {
    // Show movie poster with play simulation
    videoContainer.innerHTML = `
      <div class="preview-poster-container">
        <div class="preview-poster-overlay">
          <i class="fas fa-play-circle preview-play-icon"></i>
          <h3 class="preview-mode-title">Preview Mode</h3>
          <p class="preview-description">
            ${movie.overview}
          </p>
          <button onclick="simulatePlayback(event)" class="preview-play-btn">
            <i class="fas fa-play"></i> Start Watching
          </button>
        </div>
      </div>
    `;
    
    // Set background image for poster container
    const posterContainer = videoContainer.querySelector('.preview-poster-container');
    posterContainer.style.backgroundImage = `url('${movie.backdrop || movie.poster}')`;
  }

  // Create bottom overlay with additional info (only for non-trailer view)
  if (!trailer) {
    const bottomOverlay = document.createElement('div');
    bottomOverlay.className = 'preview-bottom-overlay';
    bottomOverlay.innerHTML = `
      <div class="preview-info">
        <p class="preview-overview">${movie.overview}</p>
      </div>
    `;
    contentWrapper.appendChild(bottomOverlay);
  }

  // Assemble the full-screen preview
  contentWrapper.appendChild(header);
  contentWrapper.appendChild(videoContainer);
  fullScreenDiv.appendChild(contentWrapper);

  // Add to body
  document.body.appendChild(fullScreenDiv);

  // Add keyboard controls
  document.addEventListener('keydown', handleFullScreenKeydown);

  // Show notification
  showNotification('🎬 Full-screen preview activated! Press ESC to exit.', 'success');
}

function handleFullScreenKeydown(e) {
  if (e.key === 'Escape') {
    closeFullScreenPreview();
  } else if (e.key === 'f' || e.key === 'F') {
    toggleFullscreen();
  }
}

function closeFullScreenPreview() {
  const preview = document.getElementById('fullScreenPreview');
  if (preview) {
    preview.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => preview.remove(), 300);
  }
  
  // Remove keyboard listener
  document.removeEventListener('keydown', handleFullScreenKeydown);
  
  showNotification('Preview closed', 'info');
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      showNotification('Fullscreen not supported', 'warning');
    });
  } else {
    document.exitFullscreen();
  }
}

// Update simulatePlayback to use event parameter
function simulatePlayback(event) {
  showNotification('🎬 Starting playback simulation...', 'info');
  
  // Add playback simulation here
  const playButton = event.target.closest('.preview-play-btn');
  playButton.innerHTML = '<i class="fas fa-pause"></i> Playing...';
  playButton.style.background = 'var(--secondary)';
  
  setTimeout(() => {
    showNotification('📺 This is a preview. Full content requires subscription.', 'warning');
  }, 3000);
}
function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  let searchTimeout;

  searchInput.addEventListener('input', function (e) {
    clearTimeout(searchTimeout);
    const query = e.target.value.toLowerCase().trim();

    searchTimeout = setTimeout(() => {
      performSearch(query);
    }, 300);
  });

  searchInput.addEventListener('blur', function (e) {
    if (!e.target.value.trim()) {
      showAllSections();
    }
  });

  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      this.value = '';
      showAllSections();
    }
  });
}

function performSearch(query) {
  if (!query) {
    showAllSections();
    return;
  }

  const allContent = [...moviesData.trending, ...moviesData.movies, ...moviesData.series];

  const results = allContent.filter(item =>
    item.title.toLowerCase().includes(query) ||
    item.genre.toLowerCase().includes(query) ||
    item.overview.toLowerCase().includes(query)
  );

  const dynamicContent = searchInAllDynamicSections(query);
  const combinedResults = [...results, ...dynamicContent];
  const uniqueResults = combinedResults.filter((item, index, self) =>
    index === self.findIndex(t => t.id === item.id)
  );

  displaySearchResults(uniqueResults, query);

  showNotification(
    uniqueResults.length > 0
      ? `Found ${uniqueResults.length} neural matches for "${query}"`
      : `No content found for "${query}"`,
    uniqueResults.length > 0 ? 'success' : 'warning'
  );
}

function searchInAllDynamicSections(query) {
  const dynamicCarousels = document.querySelectorAll('[id^="genre-"][id$="-carousel"]');
  let allDynamicContent = [];

  dynamicCarousels.forEach(carousel => {
    const genreMatch = carousel.id.match(/genre-(\d+)-carousel/);
    if (!genreMatch) return;

    const genreId = genreMatch[1];
    const allContent = [...moviesData.trending, ...moviesData.movies, ...moviesData.series];
    const genreContent = allContent.filter(item =>
      item.genre_ids && Array.isArray(item.genre_ids) && item.genre_ids.includes(parseInt(genreId))
    );

    const results = genreContent.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.genre.toLowerCase().includes(query) ||
      item.overview.toLowerCase().includes(query)
    );

    allDynamicContent.push(...results);
  });

  return allDynamicContent;
}

function setupInteractions() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

function exploreContent() {
  const firstGenreSection = document.querySelector('[id^="genre-"]');
  if (firstGenreSection) {
    firstGenreSection.scrollIntoView({
      behavior: 'smooth'
    });
  }
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `alert alert-${type} position-fixed`;
  notification.style.cssText = `
    top: 120px; right: 20px; z-index: 9999; min-width: 350px;
    backdrop-filter: blur(15px); border: 2px solid var(--primary);
    border-radius: 15px; animation: slideInRight 0.5s ease-out;
    box-shadow: var(--glow-primary);
  `;

  const iconMap = {
    success: 'check-circle',
    warning: 'exclamation-triangle',
    danger: 'exclamation-circle',
    info: 'info-circle'
  };

  notification.innerHTML = `
    <div class="d-flex align-items-center">
      <i class="fas fa-${iconMap[type]} me-2" style="font-size: 1.5rem;"></i>
      <span style="font-weight: 600;">${message}</span>
      <button type="button" class="btn-close btn-close-white ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
    </div>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'slideOutRight 0.5s ease-out';
      setTimeout(() => notification.remove(), 500);
    }
  }, 4000);
}

async function populateCategoryPills() {
  const categoryContainer = document.querySelector('.category-pills');

  if (!categoryContainer) return;

  categoryContainer.innerHTML = '<span class="category-pill"><i class="fas fa-spinner fa-spin"></i> Loading...</span>';

  try {
    const genres = await fetchGenres();
    categoryContainer.innerHTML = '';

    const allPill = document.createElement('span');
    allPill.className = 'category-pill active';
    allPill.dataset.category = 'all';
    allPill.textContent = 'All';
    categoryContainer.appendChild(allPill);

    genres.sort((a, b) => a.name.localeCompare(b.name));
    const popularGenres = genres.slice(0, 12);

    popularGenres.forEach((genre) => {
      const pill = document.createElement('span');
      pill.className = 'category-pill';
      pill.dataset.category = genre.name.toLowerCase();
      pill.dataset.genreId = genre.id;
      pill.textContent = genre.name;
      categoryContainer.appendChild(pill);
    });

    setupCategoryFilters();

  } catch (error) {
    console.error('Error populating category pills:', error);
    categoryContainer.innerHTML = '<span class="category-pill">Error loading categories</span>';
  }
}

async function createDynamicSections() {
  try {
    const existingGenreSections = document.querySelectorAll('[id^="genre-"]:not(#genre-carousel)');
    existingGenreSections.forEach(section => section.remove());

    cleanupDuplicateSections();

    const genres = await fetchGenres();
    categoriesData.allGenres = genres;
    categoriesData.currentlyDisplayed = 0;

    await loadMoreCategories();

  } catch (error) {
    console.error('Error creating dynamic sections:', error);
  }
}

async function loadMoreCategories() {
  const { allGenres, currentlyDisplayed, categoriesPerLoad } = categoriesData;

  const nextBatch = allGenres.slice(currentlyDisplayed, currentlyDisplayed + categoriesPerLoad);

  if (nextBatch.length === 0) {
    const loadMoreBtn = document.getElementById('load-more-categories');
    if (loadMoreBtn) {
      loadMoreBtn.innerHTML = `
        <i class="fas fa-check-circle me-2"></i>
        All Categories Loaded
      `;
      loadMoreBtn.disabled = true;
      loadMoreBtn.classList.add('btn-success');
      loadMoreBtn.classList.remove('btn-hero');
    }
    return;
  }

  const loadMoreBtn = document.getElementById('load-more-categories');
  const loadingIndicator = document.getElementById('loading-categories');

  if (loadMoreBtn) {
    loadMoreBtn.style.display = 'none';
  }
  if (loadingIndicator) {
    loadingIndicator.style.display = 'block';
  }

  cleanupDuplicateSections();

  nextBatch.forEach(genre => {
    const existingSections = document.querySelectorAll(`#genre-${genre.id}`);
    existingSections.forEach(section => section.remove());
  });

  for (const genre of nextBatch) {
    if (document.getElementById(`genre-${genre.id}`)) {
      console.log(`Section genre-${genre.id} already exists, skipping...`);
      continue;
    }

    const section = document.createElement('section');
    section.className = 'content-section';
    section.id = `genre-${genre.id}`;

    section.innerHTML = `
      <div class="container">
        <h2 class="section-title">
          <i class="fas fa-${getGenreIcon(genre.name)}"></i>
          ${genre.name} Collection
        </h2>
        <div class="carousel-container" data-genre="${genre.id}">
          <button class="carousel-btn prev" data-carousel="genre-${genre.id}-carousel" data-direction="-1">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button class="carousel-btn next" data-carousel="genre-${genre.id}-carousel" data-direction="1">
            <i class="fas fa-chevron-right"></i>
          </button>
          <div class="carousel-track" id="genre-${genre.id}-carousel">
            <div style="padding: 2rem; text-align: center; color: var(--text-muted);">
              <i class="fas fa-spinner fa-spin" style="font-size: 2rem;"></i>
              <p>Loading ${genre.name} content...</p>
            </div>
          </div>
        </div>
      </div>
    `;

    const loadMoreCategoriesSection = document.getElementById('load-more-categories-section');
    if (loadMoreCategoriesSection) {
      loadMoreCategoriesSection.insertAdjacentElement('beforebegin', section);
    } else {
      const allGenreSections = Array.from(document.querySelectorAll('[id^="genre-"]'))
        .filter(s => s.id.match(/^genre-\d+$/));

      if (allGenreSections.length > 0) {
        const lastSection = allGenreSections[allGenreSections.length - 1];
        lastSection.insertAdjacentElement('afterend', section);
      } else {
        const categorySection = document.querySelector('.content-section');
        if (categorySection) {
          categorySection.insertAdjacentElement('afterend', section);
        }
      }
    }

    setupCarouselNavigation(section);
  }

  await populateGenreSections(nextBatch);

  categoriesData.currentlyDisplayed += nextBatch.length;

  if (loadingIndicator) {
    loadingIndicator.style.display = 'none';
  }

  const remainingCategories = allGenres.length - categoriesData.currentlyDisplayed;

  if (remainingCategories > 0) {
    if (!document.getElementById('load-more-categories-section')) {
      createLoadMoreCategoriesSection();
    }

    if (loadMoreBtn) {
      loadMoreBtn.style.display = 'inline-block';
      loadMoreBtn.innerHTML = `
        <i class="fas fa-plus-circle me-2"></i>
        Load More Categories (${remainingCategories} remaining)
      `;
    }
  } else {
    if (loadMoreBtn) {
      loadMoreBtn.innerHTML = `
        <i class="fas fa-check-circle me-2"></i>
        All Categories Loaded
      `;
      loadMoreBtn.disabled = true;
      loadMoreBtn.classList.add('btn-success');
      loadMoreBtn.classList.remove('btn-hero');
    }
  }

  showNotification(`Loaded ${nextBatch.length} new categories`, 'success');
}

function setupCarouselNavigation(section) {
  const prevBtn = section.querySelector('.carousel-btn.prev');
  const nextBtn = section.querySelector('.carousel-btn.next');

  if (prevBtn) {
    prevBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      const carouselId = this.dataset.carousel;
      const direction = parseInt(this.dataset.direction);
      scrollCarousel(carouselId, direction);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      const carouselId = this.dataset.carousel;
      const direction = parseInt(this.dataset.direction);
      scrollCarousel(carouselId, direction);
    });
  }
}

async function populateGenreSections(genres) {
  const allContent = [...moviesData.trending, ...moviesData.movies, ...moviesData.series];

  for (const genre of genres) {
    try {
      let genreContent = allContent.filter(item =>
        item.genre_ids && Array.isArray(item.genre_ids) && item.genre_ids.includes(genre.id)
      );

      const apiContent = await fetchContentByGenre(genre.id, 1);
      genreContent = [...genreContent, ...apiContent];

      const uniqueContent = genreContent.filter((item, index, self) =>
        index === self.findIndex(t => t.id === item.id)
      );

      const finalContent = uniqueContent.slice(0, 20);
      populateCarousel(`genre-${genre.id}-carousel`, finalContent);

    } catch (error) {
      console.error(`Error populating ${genre.name}:`, error);
      const carousel = document.getElementById(`genre-${genre.id}-carousel`);
      if (carousel) {
        carousel.innerHTML = `
          <div style="padding: 2rem; text-align: center; color: var(--text-muted);">
            <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: var(--warning);"></i>
            <p>Error loading ${genre.name} content</p>
          </div>
        `;
      }
    }
  }
}

function createLoadMoreCategoriesSection() {
  const watchlistSection = document.getElementById('watchlist');

  if (document.getElementById('load-more-categories-section')) {
    return;
  }

  const loadMoreSection = document.createElement('section');
  loadMoreSection.className = 'content-section text-center';
  loadMoreSection.id = 'load-more-categories-section';

  loadMoreSection.innerHTML = `
    <div class="container">
      <div class="text-center">
        <button class="btn btn-hero load-more-categories-btn" 
                id="load-more-categories" 
                onclick="loadMoreCategories()">
          <i class="fas fa-plus-circle me-2"></i>
          Load More Categories
        </button>
        <div class="loading-indicator" id="loading-categories" style="display: none;">
          <i class="fas fa-spinner fa-spin me-2"></i>
          Loading more categories...
        </div>
      </div>
    </div>
  `;

  if (watchlistSection) {
    watchlistSection.insertAdjacentElement('beforebegin', loadMoreSection);
  } else {
    const mainContainer = document.querySelector('main.container-fluid');
    if (mainContainer) {
      mainContainer.appendChild(loadMoreSection);
    }
  }
}

function getGenreIcon(genreName) {
  const iconMap = {
    'Action': 'fist-raised', 'Adventure': 'map', 'Animation': 'magic',
    'Comedy': 'laugh', 'Crime': 'user-secret', 'Documentary': 'file-video',
    'Drama': 'theater-masks', 'Family': 'home', 'Fantasy': 'dragon',
    'History': 'scroll', 'Horror': 'ghost', 'Music': 'music',
    'Mystery': 'search', 'Romance': 'heart', 'Science Fiction': 'rocket',
    'Thriller': 'bolt', 'War': 'shield-alt', 'Western': 'hat-cowboy'
  };

  return iconMap[genreName] || 'film';
}

function setupCategoryFilters() {
  const categoryPills = document.querySelectorAll('.category-pill');

  categoryPills.forEach(pill => {
    pill.addEventListener('click', function () {
      categoryPills.forEach(p => p.classList.remove('active'));
      this.classList.add('active');

      const category = this.dataset.category;
      const genreId = this.dataset.genreId;

      if (category === 'all') {
        showAllSections();
      } else {
        filterContentByGenre(genreId);
      }
    });
  });
}

function filterContentByGenre(genreId) {
  cleanupDuplicateSections();

  const sections = document.querySelectorAll('[id^="genre-"]');

  sections.forEach(section => {
    if (section.id === `genre-${genreId}`) {
      section.style.display = 'block';
    } else {
      section.style.display = 'none';
    }
  });

  const loadMoreSection = document.getElementById('load-more-categories-section');
  if (loadMoreSection) {
    loadMoreSection.style.display = 'none';
  }
}

function createSearchResultsSection() {
  let searchSection = document.getElementById('search-results');

  if (!searchSection) {
    searchSection = document.createElement('section');
    searchSection.className = 'content-section';
    searchSection.id = 'search-results';
    searchSection.style.display = 'none';

    searchSection.innerHTML = `
      <div class="container">
        <h2 class="section-title">
          <i class="fas fa-search"></i>
          Search Results
        </h2>
        <div class="search-results-grid" id="search-results-grid">
        </div>
      </div>
    `;

    const categorySection = document.querySelector('.content-section');
    if (categorySection) {
      categorySection.insertAdjacentElement('afterend', searchSection);
    }
  }

  return searchSection;
}

function hideAllSections() {
  const sections = document.querySelectorAll('.content-section:not(#search-results)');
  sections.forEach(section => {
    section.style.display = 'none';
  });
}

function showAllSections() {
  cleanupDuplicateSections();

  const sections = document.querySelectorAll('.content-section:not(#search-results)');
  sections.forEach(section => {
    section.style.display = 'block';
  });

  const searchSection = document.getElementById('search-results');
  if (searchSection) {
    searchSection.style.display = 'none';
  }

  const loadMoreCategoriesBtn = document.getElementById('load-more-categories');
  if (loadMoreCategoriesBtn && !loadMoreCategoriesBtn.disabled) {
    loadMoreCategoriesBtn.style.display = 'inline-block';
  }
}

function displaySearchResults(results, query) {
  const searchSection = createSearchResultsSection();
  const resultsGrid = document.getElementById('search-results-grid');
  const sectionTitle = searchSection.querySelector('.section-title');

  if (sectionTitle) {
    sectionTitle.innerHTML = `
      <i class="fas fa-search"></i>
      Search Results for "${query}" (${results.length} found)
    `;
  }

  if (resultsGrid) {
    resultsGrid.innerHTML = '';

    if (results.length === 0) {
      resultsGrid.innerHTML = `
        <div style="padding: 4rem; text-align: center; color: var(--text-muted); grid-column: 1 / -1;">
          <i class="fas fa-search" style="font-size: 4rem; margin-bottom: 2rem; opacity: 0.5;"></i>
          <h3>No results found</h3>
          <p>Try searching with different keywords</p>
        </div>
      `;
    } else {
      const initialResults = results.slice(0, 20);
      let remainingResults = results.slice(20);

      initialResults.forEach(item => {
        const card = createMovieCard(item);
        card.classList.add('search-result-card');
        resultsGrid.appendChild(card);
      });

      if (remainingResults.length > 0) {
        const loadMoreContainer = document.createElement('div');
        loadMoreContainer.className = 'text-center mt-4';
        loadMoreContainer.style.gridColumn = '1 / -1';

        const loadMoreBtn = document.createElement('button');
        loadMoreBtn.className = 'btn btn-outline-primary';
        loadMoreBtn.innerHTML = `
          <i class="fas fa-plus-circle me-2"></i>
          Load More Results (${remainingResults.length} remaining)
        `;

        loadMoreBtn.onclick = () => {
          const nextBatch = remainingResults.slice(0, 20);
          remainingResults = remainingResults.slice(20);

          nextBatch.forEach(item => {
            const card = createMovieCard(item);
            card.classList.add('search-result-card');
            resultsGrid.insertBefore(card, loadMoreContainer);
          });

          if (remainingResults.length > 0) {
            loadMoreBtn.innerHTML = `
              <i class="fas fa-plus-circle me-2"></i>
              Load More Results (${remainingResults.length} remaining)
            `;
          } else {
            loadMoreContainer.remove();
          }
        };

        loadMoreContainer.appendChild(loadMoreBtn);
        resultsGrid.appendChild(loadMoreContainer);
      }
    }
  }

  searchSection.style.display = 'block';
  hideAllSections();
}
// Add this function to your main.js file and call it from initializeNeuroFlix()

function fixModalAccessibility() {
  // Fix for aria-hidden issues with modals
  const modals = document.querySelectorAll('.modal');
  
  modals.forEach(modal => {
    modal.addEventListener('shown.bs.modal', function() {
      // Remove aria-hidden when modal is shown
      this.removeAttribute('aria-hidden');
    });
    
    modal.addEventListener('hidden.bs.modal', function() {
      // Only add aria-hidden when modal is hidden
      this.setAttribute('aria-hidden', 'true');
    });
  });
}

function enhanceLogoAnimation() {
  const logo = document.querySelector('.custom-logo');
  if (!logo) return;
  
  logo.addEventListener('mouseenter', () => {
    const logoCircle = document.querySelector('.logo-circle');
    if (logoCircle) {
      logoCircle.style.borderColor = 'var(--text-primary)';
      logoCircle.style.boxShadow = '0 0 20px var(--primary), inset 0 0 15px var(--text-primary)';
    }
  });
  
  logo.addEventListener('mouseleave', () => {
    const logoCircle = document.querySelector('.logo-circle');
    if (logoCircle) {
      logoCircle.style.borderColor = 'var(--primary)';
      logoCircle.style.boxShadow = '0 0 15px var(--primary), inset 0 0 10px var(--primary)';
    }
  });
}

function initializeNeuroLogo() {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const particles = [];
  const nodeCount = 8;
  const connectionProbability = 0.6;
  
  // Create neural network nodes
  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * Math.PI * 2;
    const radius = 22 + Math.random() * 5;
    particles.push({
      x: canvas.width / 2 + Math.cos(angle) * radius,
      y: canvas.height / 2 + Math.sin(angle) * radius,
      size: 1 + Math.random() * 1.5,
      speed: 0.02 + Math.random() * 0.03,
      angle: angle,
      radius: radius,
      connections: []
    });
  }
  
  // Establish connections between nodes
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      if (Math.random() < connectionProbability) {
        particles[i].connections.push(j);
      }
    }
  }
  
  function drawNeural() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw connections
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      for (const connIndex of p.connections) {
        const conn = particles[connIndex];
        const gradient = ctx.createLinearGradient(p.x, p.y, conn.x, conn.y);
        gradient.addColorStop(0, 'rgba(255, 0, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0.1)');
        
        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(conn.x, conn.y);
        ctx.stroke();
        
        // Animated pulse along connections
        const pulsePosition = (Date.now() % 3000) / 3000;
        const pulseX = p.x + (conn.x - p.x) * pulsePosition;
        const pulseY = p.y + (conn.y - p.y) * pulsePosition;
        
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.arc(pulseX, pulseY, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Draw particles
    for (const p of particles) {
      // Update position with gentle circular motion
      p.angle += p.speed;
      p.x = canvas.width / 2 + Math.cos(p.angle) * p.radius;
      p.y = canvas.height / 2 + Math.sin(p.angle) * p.radius;
      
      // Draw node
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
      gradient.addColorStop(0, 'rgba(255, 0, 0, 0.8)');
      gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
      
      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.fillStyle = '#ffffff';
      ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    requestAnimationFrame(drawNeural);
  }
  
  // Interactive effects
  canvas.closest('.neural-container').addEventListener('mouseenter', () => {
    particles.forEach(p => {
      p.originalSpeed = p.speed;
      p.speed *= 2;
    });
  });
  
  canvas.closest('.neural-container').addEventListener('mouseleave', () => {
    particles.forEach(p => {
      p.speed = p.originalSpeed || (0.02 + Math.random() * 0.03);
    });
  });
  
  drawNeural();
}

// Update your initializeNeuroFlix function to include this
function initializeNeuroFlix() {
  createParticleField();
  setupScrollEffects();
  setupInteractions();
  setupSearch();
  fixModalAccessibility(); // Add this line
  enhanceLogoAnimation();
   initializeNeuroLogo(); // Add this line
  loadContentLibrary().then(() => {
    populateCategoryPills();
    createDynamicSections();
  }).catch(error => {
    console.error('Failed to initialize:', error);
    showNotification('Failed to load content. Please check your internet connection.', 'danger');
  });
}