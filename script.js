// Get DOM Elements
const searchForm = document.getElementById('search-form');
const searchBox = document.getElementById('search-box');
const listView = document.getElementById('list-view');
const mapView = document.getElementById('map-view');
const searchMoreBtn = document.getElementById('search-more-btn');

// State variables
let currentResults = [];
let currentPage = 0;
const itemsPerPage = 5;

// Fetch JSON Data & Search Function
async function searchJSON() {
    const query = searchBox.value.toLowerCase().trim(); // Convert search input to lowercase
    const url = `https://jsonplaceholder.typicode.com/todos`; // API URL
    try {
        const response = await fetch(url);
        const data = await response.json(); // Get JSON data

        // Filter results that match the search query
        currentResults = data.filter(item => item.title.toLowerCase().includes(query));
        currentPage = 0; // Reset pagination

        // Display initial results
        displayResults();
    } catch (error) {
        console.error('Error fetching data:', error);
        listView.innerHTML = "<p>Error fetching data.</p>";
        mapView.innerHTML = "<p>Error fetching data.</p>";
    }
}

// Display results in both list and map views
function displayResults() {
    listView.innerHTML = ''; // Clear previous list results
    mapView.innerHTML = ''; // Clear previous map results

    if (currentResults.length === 0) {
        listView.innerHTML = "<p>No matching results found.</p>";
        mapView.innerHTML = "<p>No matching results found.</p>";
        searchMoreBtn.style.display = 'none';
        return;
    }

    // Calculate pagination slice
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedResults = currentResults.slice(start, end);

    // Display List View
    const list = document.createElement('ul');
    list.classList.add('list-group');

    paginatedResults.forEach(item => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        listItem.textContent = item.title;
        list.appendChild(listItem);
    });
    listView.appendChild(list);

    // Display Map View (key-value pairs)
    const mapContainer = document.createElement('div');
    paginatedResults.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('card', 'mb-2');
        itemDiv.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <p class="card-text">
                    ID: ${item.id}<br>
                    User ID: ${item.userId}<br>
                    Completed: ${item.completed}
                </p>
            </div>
        `;
        mapContainer.appendChild(itemDiv);
    });
    mapView.appendChild(mapContainer);

    // Show "Show More" button if there are more results
    searchMoreBtn.style.display = end < currentResults.length ? 'block' : 'none';
}

// Load saved data on page load
function loadSavedData() {
    const savedQuery = localStorage.getItem('searchQuery');
    const savedResults = localStorage.getItem('searchResults');

    if (savedQuery && savedResults) {
        searchBox.value = savedQuery;
        currentResults = JSON.parse(savedResults);
        displayResults();
    }
}

// Event Listener for Search
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchJSON();
});

// Event Listener for Show More
searchMoreBtn.addEventListener('click', () => {
    currentPage++;
    displayResults();
});

// Load saved data when the page loads
window.addEventListener('load', loadSavedData);