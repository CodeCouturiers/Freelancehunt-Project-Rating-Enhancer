// ==UserScript==
// @name         Freelancehunt Project Rating
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Adds a rating based on budget, bids, and reviews to Freelancehunt projects, and shows the last online time of the employer (including offline status) and reviews.
// @author       You
// @match        *://*.freelancehunt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freelancehunt.com
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    // Currency coefficients for conversion
    const currencyCoefficients = {
        'UAH': 1,
        'USD': 40,
        'PLN': 10
    };

    // Fetch employer status and reviews
    function getEmployerStatus(projectLink, projectElement) {
        GM_xmlhttpRequest({
            method: "GET",
            url: projectLink,
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");

                    const widgetElement = doc.querySelector('.widget');

                    if (widgetElement && widgetElement.textContent.includes('Замовник')) {
                        const statusElement = widgetElement.querySelector('.profile-status');
                        let statusText = '';
                        let statusStyle = '';

                        if (statusElement) {
                            const isOffline = statusElement.classList.contains('offline');

                            if (isOffline) {
                                const lastSeenElement = widgetElement.querySelector('.avatar-container');
                                if (lastSeenElement && lastSeenElement.title) {
                                    statusText = ` - ${lastSeenElement.title}`;
                                    statusStyle = 'color: #D1D1D6; font-size: 12px;';
                                }
                            } else {
                                statusText = ` - Зараз онлайн`;
                                statusStyle = 'color: #34C759; font-size: 12px;';
                            }
                        }

                        const reviewsElement = widgetElement.querySelector('.nowrap');
                        let reviewsText = '';
                        let positiveReviews = 0;
                        let negativeReviews = 0;

                        if (reviewsElement) {
                            const positiveReviewsElement = reviewsElement.querySelector('a .text-green');
                            const negativeReviewsElement = reviewsElement.querySelector('a .text-red');

                            positiveReviews = positiveReviewsElement ? parseInt(positiveReviewsElement.textContent.trim()) : 0;
                            negativeReviews = negativeReviewsElement ? parseInt(negativeReviewsElement.textContent.trim()) : 0;

                            let negativeColor = 'gray';
                            if (negativeReviews > 0) {
                                negativeColor = 'red';
                            }

                            reviewsText = ` (<span style="color: #34C759;">${positiveReviews}</span>/<span style="color: ${negativeColor};">${negativeReviews}</span>)`;
                        }

                        const insertBeforeElement = projectElement.querySelector('a.visitable') || projectElement.querySelector('.price');
                        if (insertBeforeElement) {
                            const statusSpan = document.createElement('span');
                            statusSpan.textContent = statusText;
                            statusSpan.style.cssText = statusStyle;

                            const reviewsSpan = document.createElement('span');
                            reviewsSpan.innerHTML = reviewsText;
                            reviewsSpan.style.cssText = 'color: #6C757D; font-size: 12px;';

                            insertBeforeElement.parentNode.insertBefore(statusSpan, insertBeforeElement.nextSibling);
                            insertBeforeElement.parentNode.insertBefore(reviewsSpan, statusSpan.nextSibling);
                        }

                        processProject(projectElement, positiveReviews, negativeReviews);
                    }
                } else {
                    console.error("Error fetching project page:", response.status);
                }
            },
            onerror: function(error) {
                console.error("Error fetching project page:", error);
            }
        });
    }

    // Process each project in the list
    function processProject(project, positiveReviews = 0, negativeReviews = 0) {
        const linkElement = project.querySelector('a.visitable');

        if (linkElement) {
            const budgetElement = project.querySelector('.price');
            const bidsElement = project.querySelector('small');

            if (budgetElement) {
                let budget = parseFloat(budgetElement.textContent.replace(/\s|UAH|PLN|USD/g, '')) || 0;
                const currency = budgetElement.textContent.match(/UAH|PLN|USD/)[0] || 'UAH';

                let bidsCount = 0;
                if (bidsElement && bidsElement.textContent.match(/\d+/)) {
                    bidsCount = parseInt(bidsElement.textContent.match(/\d+/)[0]);
                }

                const rating = calculateRating(budget, bidsCount, currency, positiveReviews, negativeReviews);
                const stars = displayRatingStars(rating, 10);

                const ratingElement = document.createElement('span');
                ratingElement.innerHTML = ` ${stars} (${rating.toFixed(1)}) ${currency}`;
                ratingElement.style.cssText = 'color: #FF9500; font-size: 14px; margin-left: 10px; font-weight: 500;';
                linkElement.parentNode.insertBefore(ratingElement, linkElement.nextSibling);
            }
        }
    }

    // Calculate project rating based on various factors
    function calculateRating(budget, bidsCount, currency, positiveReviews, negativeReviews) {
        const normalizedBudget = budget * currencyCoefficients[currency];
        const reviewScore = (positiveReviews - negativeReviews) / (positiveReviews + negativeReviews + 1);
        const rating = Math.log10(normalizedBudget / (bidsCount + 1) + 1) * 2 * (1 + reviewScore);
        return Math.min(rating, 10);
    }

    // Display rating stars based on the calculated rating
    function displayRatingStars(rating, maxStars = 10) {
        const fullStars = Math.floor(rating);
        const halfStar = rating - fullStars >= 0.5 ? 1 : 0;
        const emptyStars = maxStars - fullStars - halfStar;

        let starsHTML = '';
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        if (halfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        return starsHTML;
    }

    // Wait for the page to load before processing projects
    window.addEventListener('load', () => {
        const projects = Array.from(document.querySelectorAll('.project-list tr'));
        projects.forEach(project => {
            const linkElement = project.querySelector('a.visitable');
            if (linkElement) {
                getEmployerStatus(linkElement.href, project);
            }
        });
    });

    // Include Font Awesome for star icons
    const faScript = document.createElement('script');
    faScript.src = 'https://kit.fontawesome.com/a076d05399.js';
    faScript.crossOrigin = 'anonymous';
    document.head.appendChild(faScript);

})();
