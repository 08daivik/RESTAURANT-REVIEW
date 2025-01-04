let restaurantData = null;
let reviewData = null;

fetch('restaurant.json')
    .then(response => response.json())
    .then(data => {
        restaurantData = data;
        populateLocations();
    });

fetch('review.json')
    .then(response => response.json())
    .then(data => reviewData = data);

function populateLocations() {
    const locationDropdown = document.getElementById('locationDropdown');
    const locations = Array.from(new Set(restaurantData.map(r => r.location)));
    locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        locationDropdown.appendChild(option);
    });
}

function goToPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

function showRestaurants() {
    const selectedLocation = document.getElementById('locationDropdown').value;
    if (!selectedLocation) return;

    const restaurantList = document.getElementById('restaurantList');
    restaurantList.innerHTML = '';

    const filteredRestaurants = restaurantData.filter(r => r.location === selectedLocation);
    filteredRestaurants.forEach(restaurant => {
        const div = document.createElement('div');
        div.classList.add('restaurant');

        const img = document.createElement('img');
        img.src = restaurant.photo;
        img.alt = restaurant.name;

        const name = document.createElement('h3');
        name.textContent = restaurant.name;

        const details = document.createElement('p');
        details.textContent = `Cuisine: ${restaurant.cuisine} | Food Type: ${restaurant.foodtype} | Dining: ${restaurant.diningtype}`;

        const reviewsSection = document.createElement('div');
        reviewsSection.classList.add('reviews-section');
        reviewsSection.style.display = 'none';  // Hide reviews initially

        const button = document.createElement('button');
        button.textContent = 'View Reviews';
        button.onclick = () => toggleReviews(restaurant.id, reviewsSection);

        div.appendChild(img);
        div.appendChild(name);
        div.appendChild(details);
        div.appendChild(button);
        div.appendChild(reviewsSection);  // Add reviews section to the restaurant div

        restaurantList.appendChild(div);
    });

    goToPage('restaurants');
}

function toggleReviews(restaurantId, reviewsSection) {
    const reviews = reviewData.filter(review => review.restaurantId === restaurantId);

    if (reviewsSection.style.display === 'none') {
        reviewsSection.style.display = 'block';
        reviewsSection.innerHTML = '';  // Clear existing reviews

        reviews.forEach(review => {
            const reviewDiv = document.createElement('div');
            reviewDiv.classList.add('review');

            const reviewText = document.createElement('p');
            reviewText.textContent = review.review;

            const reviewRating = document.createElement('p');
            reviewRating.textContent = `Rating: ${review.rating}`;

            reviewDiv.appendChild(reviewText);
            reviewDiv.appendChild(reviewRating);

            reviewsSection.appendChild(reviewDiv);
        });
    } else {
        reviewsSection.style.display = 'none';  // Hide reviews if already visible
    }
}
