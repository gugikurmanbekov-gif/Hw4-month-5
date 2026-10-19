const cardsContainer = document.getElementById('cardsContainer');
const loadingText = document.getElementById('loading');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageIndicator = document.getElementById('pageIndicator');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

const API_URL = 'https://api.openbrewerydb.org/v1/breweries';

let currentPage = 1;
const perPage = 10;
let currentSearchQuery = '';

async function fetchBreweries(page, search = '') {
    loadingText.style.display = 'block';
    cardsContainer.innerHTML = '';

    try {
        let url = `${API_URL}?page=${page}&per_page=${perPage}`;
        
        if (search.trim() !== '') {
            url = `${API_URL}?by_name=${encodeURIComponent(search)}&page=${page}&per_page=${perPage}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error('Ошибка сети');

        const data = await res.json();
        renderCards(data);
        
        prevBtn.disabled = page === 1;
        nextBtn.disabled = data.length < perPage; 

    } catch (error) {
        cardsContainer.innerHTML = `<p style="color: red;">Не удалось загрузить данные: ${error.message}</p>`;
    } finally {
        loadingText.style.display = 'none';
    }
}

function renderCards(breweries) {
    cardsContainer.innerHTML = '';

    if (breweries.length === 0) {
        cardsContainer.innerHTML = '<p>Пивоварни не найдены 🍻</p>';
        return;
    }

    breweries.forEach(brewery => {
        const card = document.createElement('div');
        card.className = 'card';

        const websiteLink = brewery.website_url 
            ? `<p><a href="${brewery.website_url}" target="_blank">Перейти на сайт</a></p>` 
            : '<p><em>Сайт отсутствует</em></p>';

        card.innerHTML = `
            <h3>${brewery.name}</h3>
            <p>📍 Город: ${brewery.city || 'Не указан'}</p>
            ${websiteLink}
        `;

        cardsContainer.appendChild(card);
    });
}

nextBtn.addEventListener('click', () => {
    currentPage++;
    pageIndicator.textContent = `Страница ${currentPage}`;
    fetchBreweries(currentPage, currentSearchQuery);
});

prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        pageIndicator.textContent = `Страница ${currentPage}`;
        fetchBreweries(currentPage, currentSearchQuery);
    }
});

searchBtn.addEventListener('click', () => {
    currentSearchQuery = searchInput.value;
    currentPage = 1;
    pageIndicator.textContent = `Страница ${currentPage}`;
    fetchBreweries(currentPage, currentSearchQuery);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

fetchBreweries(currentPage);
