const API_KEY = '4045ec8941b64e7e933d7d72ff82c447';
const API_URL = 'https://newsapi.org/v2/everything';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const newsResults = document.getElementById('newsResults');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const newsCardTemplate = document.getElementById('newsCardTemplate');

// Event Listeners
searchButton.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Load initial news
document.addEventListener('DOMContentLoaded', () => {
    fetchNews('technology');
});

async function handleSearch() {
    const query = searchInput.value.trim();
    if (query) {
        await fetchNews(query);
    }
}

async function fetchNews(query) {
    try {
        showLoading();
        hideError();

        const response = await fetch(`${API_URL}?q=${encodeURIComponent(query)}&apiKey=${API_KEY}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch news');
        }

        if (data.articles.length === 0) {
            showError('No news articles found for your search.');
            return;
        }

        displayNews(data.articles);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

function displayNews(articles) {
    newsResults.innerHTML = '';
    
    articles.forEach(article => {
        const card = newsCardTemplate.content.cloneNode(true);
        
        // Set image
        const img = card.querySelector('.card-img-top');
        img.src = article.urlToImage || 'https://via.placeholder.com/400x200?text=No+Image';
        img.alt = article.title;

        // Set title
        card.querySelector('.card-title').textContent = article.title;

        // Set description
        card.querySelector('.card-text').textContent = article.description || 'No description available';

        // Set date
        const date = new Date(article.publishedAt);
        card.querySelector('.text-muted').textContent = date.toLocaleDateString();

        // Set read more link
        const readMoreLink = card.querySelector('.btn-primary');
        readMoreLink.href = article.url;

        newsResults.appendChild(card);
    });
}

function showLoading() {
    loadingSpinner.classList.remove('d-none');
    newsResults.innerHTML = '';
}

function hideLoading() {
    loadingSpinner.classList.add('d-none');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('d-none');
}

function hideError() {
    errorMessage.classList.add('d-none');
} 