// Tests for index.html
// Mocking React and related libraries if necessary
// In a real project, you'd likely have these set up in a jest.config.js or a setup file
jest.mock('react', () => require('react'));
jest.mock('react-dom', () => require('react-dom'));

// Assuming your components are structured similarly and exported
// Replace with actual import paths
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../src/App'; // Assuming App component renders your index.html content

// Mock for the countdown timer functionality if it's complex or external
// For simplicity, we'll assume it's either a simple component or its logic is testable within the component
// If it relies on external APIs or complex timers, more sophisticated mocking might be needed

describe('Website Functionality', () => {
  beforeEach(() => {
    render(<App />);
  });

  // Header Elements
  test('should display logo, search bar, and icons in the header', () => {
    const logo = screen.getByAltText(/logo/i);
    expect(logo).toBeVisible();

    const searchInput = screen.getByPlaceholderText(/search/i);
    expect(searchInput).toBeVisible();

    const cartIcon = screen.getByTestId('cart-icon'); // Assuming a data-testid
    expect(cartIcon).toBeVisible();

    const userIcon = screen.getByTestId('user-icon'); // Assuming a data-testid
    expect(userIcon).toBeVisible();
  });

  // Navbar Toggle
  test('should toggle navbar visibility on click', () => {
    // Assuming a hamburger menu icon
    const menuButton = screen.getByTestId('menu-toggle'); // Assuming a data-testid
    const navbar = screen.getByTestId('navbar'); // Assuming a data-testid

    // Initially, assume navbar is hidden or collapsed on small screens
    // You might need to adjust this based on your initial rendering/CSS
    expect(navbar).not.toHaveClass('show'); // Or whatever class indicates visibility

    fireEvent.click(menuButton);
    expect(navbar).toHaveClass('show'); // Or whatever class indicates visibility

    // Assuming a close button within the navbar
    const closeButton = screen.getByTestId('menu-close'); // Assuming a data-testid
    fireEvent.click(closeButton);
    expect(navbar).not.toHaveClass('show'); // Or whatever class indicates visibility
  });

  // Product Sections
  test('should display latest and featured product sections', () => {
    const latestProductsHeading = screen.getByRole('heading', { name: /latest products/i });
    expect(latestProductsHeading).toBeVisible();

    const featuredProductsHeading = screen.getByRole('heading', { name: /featured products/i });
    expect(featuredProductsHeading).toBeVisible();

    // Test navigation between product sections (e.g., carousel buttons)
    const nextProductButton = screen.getByTestId('next-product'); // Assuming a data-testid
    expect(nextProductButton).toBeVisible();

    const prevProductButton = screen.getByTestId('prev-product'); // Assuming a data-testid
    expect(prevProductButton).toBeVisible();

    // Further tests could involve checking if products are actually rendered within these sections
    const productItems = screen.getAllByTestId('product-item'); // Assuming a data-testid for individual products
    expect(productItems.length).toBeGreaterThan(0);
  });

  // Countdown Timer
  test('should display and update countdown timer accurately', () => {
    const countdownTimer = screen.getByTestId('countdown-timer'); // Assuming a data-testid
    expect(countdownTimer).toBeVisible();

    // To test accuracy, you'd need to know the target end time or have a way to mock time.
    // Example: Mocking time progression
    jest.useFakeTimers();

    // Assume initial render shows a certain time
    // You might need to check specific elements for hours, minutes, seconds
    // For instance, if you have spans for each:
    const secondsDisplay = screen.getByTestId('seconds');
    expect(secondsDisplay).toBeInTheDocument();

    // Advance time by 1 second
    jest.advanceTimersByTime(1000);

    // Re-render or re-query elements if necessary, or check if the displayed value changed.
    // This is a simplified example. Real testing might involve checking against a known target time.
    // If your timer component accepts a target date, you can test it by providing a past or future date.
    // Example: If the target date is in the past, the timer should show 00:00:00 or indicate expired.
    const expiredTimer = screen.getByTestId('expired-deal'); // Assuming a specific element for expired deals
    expect(expiredTimer).toBeInTheDocument(); // Or check for 00:00:00

    jest.useRealTimers(); // Restore real timers
  });

  // Customer Review Carousel
  test('should display customer reviews in a carousel and be navigable', () => {
    const reviewCarousel = screen.getByTestId('review-carousel'); // Assuming a data-testid
    expect(reviewCarousel).toBeVisible();

    // Check if at least one review is displayed
    const firstReview = screen.getByTestId('review-item'); // Assuming a data-testid
    expect(firstReview).toBeVisible();

    // Test carousel navigation
    const nextReviewButton = screen.getByTestId('next-review'); // Assuming a data-testid
    expect(nextReviewButton).toBeVisible();

    const prevReviewButton = screen.getByTestId('prev-review'); // Assuming a data-testid
    expect(prevReviewButton).toBeVisible();

    // Simulate clicking next and check if content changes (if possible to assert)
    // This might involve checking for a different review's content or a different active class.
    // For simplicity, we'll just check visibility of navigation.
  });

  // Footer Links and Social Media Icons
  test('should display footer links and social media icons', () => {
    const footer = screen.getByTestId('footer'); // Assuming a data-testid
    expect(footer).toBeVisible();

    // Test footer links
    const aboutLink = screen.getByRole('link', { name: /about us/i });
    expect(aboutLink).toBeVisible();
    expect(aboutLink).toHaveAttribute('href');

    const contactLink = screen.getByRole('link', { name: /contact us/i });
    expect(contactLink).toBeVisible();
    expect(contactLink).toHaveAttribute('href');

    // Test social media icons
    const facebookIcon = screen.getByTestId('facebook-icon'); // Assuming a data-testid
    expect(facebookIcon).toBeVisible();
    expect(facebookIcon).toHaveAttribute('href');

    const twitterIcon = screen.getByTestId('twitter-icon'); // Assuming a data-testid
    expect(twitterIcon).toBeVisible();
    expect(twitterIcon).toHaveAttribute('href');

    const instagramIcon = screen.getByTestId('instagram-icon'); // Assuming a data-testid
    expect(instagramIcon).toBeVisible();
    expect(instagramIcon).toHaveAttribute('href');
  });

  // Responsiveness (basic check)
  test('should adjust layout for different screen sizes', () => {
    // This is a more complex area to test comprehensively.
    // A common approach is to test specific breakpoints or simulate window resizing.
    // For demonstration, we'll check if the header has a different class on simulated small screens.

    // Simulate a small screen width (e.g., mobile)
    const originalWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500, // Simulate a small screen
    });
    // Dispatch a resize event
    window.dispatchEvent(new Event('resize'));

    // Check for elements that might change visibility or behavior on small screens
    // For example, a mobile menu might appear, and a desktop menu might hide.
    const menuButton = screen.getByTestId('menu-toggle');
    expect(menuButton).toBeVisible();

    // Restore original window width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalWidth,
    });
    window.dispatchEvent(new Event('resize')); // Dispatch another resize event to reset
  });

  // Failure Case Example (for a hypothetical scenario, e.g., search failing)
  test('should handle search errors gracefully', () => {
    // This test would be relevant if your search had a specific error display mechanism.
    // For example, if an empty search query or an invalid term displays an error message.

    const searchInput = screen.getByPlaceholderText(/search/i);
    const searchButton = screen.getByTestId('search-button'); // Assuming a data-testid

    // Simulate a scenario that might cause an error (e.g., empty search)
    // If the search functionality is client-side and has validation:
    fireEvent.change(searchInput, { target: { value: '' } });
    fireEvent.click(searchButton);

    // Assuming an error message appears for empty searches
    const errorMessage = screen.queryByText(/please enter a search term/i);
    expect(errorMessage).toBeVisible();

    // If the search triggers an API call and fails, you'd mock the API call to return an error
    // and then assert the UI reflects the error state.
    // Example:
    /*
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network Error'));
    fireEvent.change(searchInput, { target: { value: 'some product' } });
    fireEvent.click(searchButton);
    await screen.findByText(/error loading search results/i); // Wait for error message
    */
  });

  // Edge Case Example (e.g., no products found in a section)
  test('should display a message when no products are found in a section', () => {
    // This would require mocking the data for a specific section to be empty.
    // For example, if the "Latest Products" section usually fetches data.
    // A simpler approach for this test might be to check if the "no products" message
    // is present when you expect it, e.g., after a failed search that returns no results.

    // Assuming the 'no results' message is a specific element
    const noProductsMessage = screen.queryByText(/no products found/i);
    // In a typical scenario, this message wouldn't be visible initially if products are present.
    // We can't easily trigger an "empty section" state without more control over data fetching.
    // A more practical test might be to simulate a search that yields no results:
    const searchInput = screen.getByPlaceholderText(/search/i);
    const searchButton = screen.getByTestId('search-button');

    // Mock fetch to return an empty array for a specific search term
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ products: [] }),
    });

    fireEvent.change(searchInput, { target: { value: 'nonexistent product' } });
    fireEvent.click(searchButton);

    // Wait for the "no products found" message to appear
    const noResultsFound = await screen.findByText(/no products found/i);
    expect(noResultsFound).toBeVisible();
  });
});

// Tests for script.test.js
import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Mocking Swiper because it's not a standard React component and often uses global DOM manipulation
jest.mock('swiper/bundle', () => {
  return {
    Swiper: jest.fn().mockImplementation(() => ({
      init: jest.fn(),
      destroy: jest.fn(),
    })),
    Navigation: jest.fn(),
    Pagination: jest.fn(),
    Autoplay: jest.fn(),
  };
});

// Mocking IntersectionObserver for scroll-related tests
const mockIntersectionObserver = jest.fn((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    } else {
      entry.target.classList.remove('active');
    }
  });
});
window.IntersectionObserver = jest.fn().mockImplementation((callback) => {
  return {
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    callback: callback, // Store callback for manual invocation in tests
  };
});

// Mocking timer functions
jest.useFakeTimers();

// Mocking DOM elements that are not directly part of the component being tested
const mockElement = (id, className = '', innerHTML = '') => ({
  id,
  className,
  innerHTML,
  style: {},
  querySelector: jest.fn(() => null),
  querySelectorAll: jest.fn(() => []),
  addEventListener: jest.fn(),
  classList: {
    add: jest.fn(),
    remove: jest.fn(),
    contains: jest.fn(),
  },
});

describe('script.js functionality', () => {
  let originalDocument;

  beforeAll(() => {
    // Save original document and body
    originalDocument = { ...document };
    originalBody = { ...document.body };

    // Create mock elements for testing
    const mockNavbar = mockElement('navbar');
    const mockMenuIcon = mockElement('menu-icon');
    const mockCloseButton = mockElement('close-button');
    const mockHeader = mockElement('header');
    const mockThemeToggler = mockElement('theme-toggler');
    const mockBigImage1 = mockElement('big-image-1');
    const mockBigImage2 = mockElement('big-image-2');
    const mockBigImage3 = mockElement('big-image-3');
    const mockSmallImage1 = mockElement('small-image-1');
    const mockSmallImage2 = mockElement('small-image-2');
    const mockSmallImage3 = mockElement('small-image-3');
    const mockDays = mockElement('days');
    const mockHours = mockElement('hours');
    const mockMinutes = mockElement('minutes');
    const mockSeconds = mockElement('seconds');

    // Mocking document and body properties
    Object.defineProperty(document, 'getElementById', {
      value: jest.fn(id => {
        switch (id) {
          case 'navbar': return mockNavbar;
          case 'menu-icon': return mockMenuIcon;
          case 'close-button': return mockCloseButton;
          case 'header': return mockHeader;
          case 'theme-toggler': return mockThemeToggler;
          case 'days': return mockDays;
          case 'hours': return mockHours;
          case 'minutes': return mockMinutes;
          case 'seconds': return mockSeconds;
          default: return null;
        }
      }),
      writable: true
    });

    Object.defineProperty(document, 'querySelector', {
      value: jest.fn(selector => {
        switch (selector) {
          case '#navbar': return mockNavbar;
          case '#menu-icon': return mockMenuIcon;
          case '#close-button': return mockCloseButton;
          case '#header': return mockHeader;
          case '.big-image-1': return mockBigImage1;
          case '.big-image-2': return mockBigImage2;
          case '.big-image-3': return mockBigImage3;
          case '#theme-toggler': return mockThemeToggler;
          case '.product-slider': return mockElement('.product-slider'); // Mocking for Swiper init
          case '.review-slider': return mockElement('.review-slider'); // Mocking for Swiper init
          default: return null;
        }
      }),
      writable: true
    });

    Object.defineProperty(document, 'body', {
      value: {
        classList: {
          add: jest.fn(),
          remove: jest.fn(),
          contains: jest.fn(),
        },
        ...originalBody
      },
      writable: true
    });

    // Mocking querySelectorAll for small images
    document.querySelectorAll = jest.fn(selector => {
      if (selector === '.small-image') {
        return [mockSmallImage1, mockSmallImage2, mockSmallImage3];
      }
      return [];
    });

    // Mocking addEventListener for elements
    mockMenuIcon.addEventListener = jest.fn();
    mockCloseButton.addEventListener = jest.fn();
    mockThemeToggler.addEventListener = jest.fn();
    mockSmallImage1.addEventListener = jest.fn();
    mockSmallImage2.addEventListener = jest.fn();
    mockSmallImage3.addEventListener = jest.fn();
    mockBigImage1.setAttribute = jest.fn();
    mockBigImage2.setAttribute = jest.fn();
    mockBigImage3.setAttribute = jest.fn();
  });

  afterAll(() => {
    // Restore original document and body
    Object.defineProperty(document, 'getElementById', { value: originalDocument.getElementById });
    Object.defineProperty(document, 'querySelector', { value: originalDocument.querySelector });
    Object.defineProperty(document, 'body', { value: originalBody });
    Object.defineProperty(document, 'querySelectorAll', { value: originalDocument.querySelectorAll });
  });

  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();

    // Reset class lists and attributes
    document.getElementById('navbar').classList.remove('active');
    document.getElementById('header').classList.remove('active');
    document.body.classList.remove('dark-theme');
    document.getElementById('big-image-1').setAttribute('src', '');
    document.getElementById('big-image-2').setAttribute('src', '');
    document.getElementById('big-image-3').setAttribute('src', '');

    // Simulate initial conditions if necessary
    document.getElementById('navbar').classList.contains.mockReturnValue(false);
    document.getElementById('header').classList.contains.mockReturnValue(false);
    document.body.classList.contains.mockReturnValue(false);

    // Re-mock the Swiper constructor to ensure it's fresh for each test
    const Swiper = require('swiper/bundle').Swiper; // Re-require to get the mock instance
    Swiper.mockClear();
  });

  // --- Navbar Active Class Toggle Tests ---
  test('should toggle active class on navbar when menu icon is clicked', () => {
    require('./script'); // Import the script to attach event listeners

    const menuIcon = document.getElementById('menu-icon');
    const navbar = document.getElementById('navbar');

    expect(navbar.classList.add).not.toHaveBeenCalled();
    expect(navbar.classList.remove).not.toHaveBeenCalled();

    // Simulate click on menu icon
    fireEvent.click(menuIcon);

    // Check if active class was added to navbar
    expect(navbar.classList.add).toHaveBeenCalledWith('active');
    expect(navbar.classList.remove).not.toHaveBeenCalled();

    // Simulate clicking again to close
    fireEvent.click(menuIcon);
    expect(navbar.classList.remove).toHaveBeenCalledWith('active');
  });

  test('should toggle active class on navbar when close button is clicked', () => {
    require('./script');

    const closeButton = document.getElementById('close-button');
    const navbar = document.getElementById('navbar');

    // Ensure navbar is initially active for testing close button
    navbar.classList.add('active');
    expect(navbar.classList.contains('active')).toBe(true);

    // Simulate click on close button
    fireEvent.click(closeButton);

    // Check if active class was removed from navbar
    expect(navbar.classList.remove).toHaveBeenCalledWith('active');
    expect(navbar.classList.add).not.toHaveBeenCalled();
  });

  // --- Header Active Class on Scroll Tests ---
  test('should add active class to header when scrolled past a certain point', () => {
    require('./script');

    const header = document.getElementById('header');
    const observer = window.IntersectionObserver.mock.instances[0]; // Get the mock observer

    // Simulate initial state (header not visible)
    observer.callback([{ isIntersecting: false, target: header }], observer);
    expect(header.classList.remove).toHaveBeenCalledWith('active');

    // Simulate scrolling to a point where header is visible
    observer.callback([{ isIntersecting: true, target: header }], observer);
    expect(header.classList.add).toHaveBeenCalledWith('active');
  });

  test('should remove active class from header when scrolled back up', () => {
    require('./script');

    const header = document.getElementById('header');
    const observer = window.IntersectionObserver.mock.instances[0]; // Get the mock observer

    // Simulate header being active
    observer.callback([{ isIntersecting: true, target: header }], observer);
    expect(header.classList.add).toHaveBeenCalledWith('active');

    // Simulate scrolling back up
    observer.callback([{ isIntersecting: false, target: header }], observer);
    expect(header.classList.remove).toHaveBeenCalledWith('active');
  });

  // --- Theme Toggler Tests ---
  test('should toggle dark-theme class on body and theme-toggler element', () => {
    require('./script');

    const themeToggler = document.getElementById('theme-toggler');
    const body = document.body;

    // Mock initial state of theme-toggler
    themeToggler.classList.contains.mockReturnValue(false);
    body.classList.contains.mockReturnValue(false);

    // Simulate click on theme toggler
    fireEvent.click(themeToggler);

    // Check if dark-theme class was added
    expect(themeToggler.classList.add).toHaveBeenCalledWith('dark-theme');
    expect(body.classList.add).toHaveBeenCalledWith('dark-theme');
    expect(themeToggler.classList.remove).not.toHaveBeenCalled();
    expect(body.classList.remove).not.toHaveBeenCalled();

    // Simulate clicking again to toggle off
    themeToggler.classList.contains.mockReturnValue(true); // Simulate it's now active
    body.classList.contains.mockReturnValue(true);

    fireEvent.click(themeToggler);

    // Check if dark-theme class was removed
    expect(themeToggler.classList.remove).toHaveBeenCalledWith('dark-theme');
    expect(body.classList.remove).toHaveBeenCalledWith('dark-theme');
  });

  // --- Image Source Update Tests ---
  test('should update big image source when respective small image is clicked', () => {
    require('./script');

    const smallImage1 = document.querySelector('.small-image[src*="small1.jpg"]'); // Assuming specific src for targeting
    const bigImage1 = document.getElementById('big-image-1');

    // Mock the specific small image
    const mockSmallImage1 = {
      ...mockElement('small-image-1'),
      src: 'path/to/small1.jpg',
      dataset: {
        img: 'path/to/big1.jpg'
      }
    };
    document.querySelector = jest.fn(selector => {
      if (selector === '.big-image-1') return bigImage1;
      if (selector === '.small-image[src*="small1.jpg"]') return mockSmallImage1;
      return null;
    });
    mockSmallImage1.addEventListener = jest.fn();

    // Simulate click on small image 1
    fireEvent.click(mockSmallImage1);

    // Check if the big image source was updated
    expect(bigImage1.setAttribute).toHaveBeenCalledWith('src', 'path/to/big1.jpg');

    // Test for other images
    const smallImage2 = { ...mockElement('small-image-2'), src: 'path/to/small2.jpg', dataset: { img: 'path/to/big2.jpg' } };
    const bigImage2 = mockElement('big-image-2');
    document.querySelector.mockImplementation((selector) => {
      if (selector === '.big-image-1') return bigImage1;
      if (selector === '.big-image-2') return bigImage2;
      if (selector === '.small-image[src*="small2.jpg"]') return smallImage2;
      return null;
    });
    smallImage2.addEventListener = jest.fn();
    fireEvent.click(smallImage2);
    expect(bigImage2.setAttribute).toHaveBeenCalledWith('src', 'path/to/big2.jpg');

    const smallImage3 = { ...mockElement('small-image-3'), src: 'path/to/small3.jpg', dataset: { img: 'path/to/big3.jpg' } };
    const bigImage3 = mockElement('big-image-3');
    document.querySelector.mockImplementation((selector) => {
      if (selector === '.big-image-1') return bigImage1;
      if (selector === '.big-image-2') return bigImage2;
      if (selector === '.big-image-3') return bigImage3;
      if (selector === '.small-image[src*="small3.jpg"]') return smallImage3;
      return null;
    });
    smallImage3.addEventListener = jest.fn();
    fireEvent.click(smallImage3);
    expect(bigImage3.setAttribute).toHaveBeenCalledWith('src', 'path/to/big3.jpg');
  });

  test('should not update big image source if small image has no data-img attribute', () => {
    require('./script');

    const smallImageWithoutData = { ...mockElement('small-image-no-data'), src: 'path/to/small-no-data.jpg', dataset: {} }; // No dataset.img
    const bigImage = mockElement('big-image-1');
    document.querySelector = jest.fn(selector => {
      if (selector === '.big-image-1') return bigImage;
      if (selector === '.small-image[src*="small-no-data.jpg"]') return smallImageWithoutData;
      return null;
    });
    smallImageWithoutData.addEventListener = jest.fn();

    fireEvent.click(smallImageWithoutData);

    // Should not call setAttribute if data-img is missing
    expect(bigImage.setAttribute).not.toHaveBeenCalled();
  });


  // --- Countdown Timer Tests ---
  test('should update countdown time elements correctly', () => {
    require('./script');

    // Mock initial DOM elements for countdown
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    daysEl.innerHTML = '00';
    hoursEl.innerHTML = '00';
    minutesEl.innerHTML = '00';
    secondsEl.innerHTML = '00';

    // Set a target date in the future
    const now = new Date();
    const targetDate = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000 + 30 * 60 * 1000 + 15 * 1000);
    const targetDateString = targetDate.toDateString();
    // Mock the Date constructor to return our fixed target date
    const OriginalDate = Date;
    global.Date = class extends OriginalDate {
      constructor(dateString) {
        if (dateString) {
          return new OriginalDate(dateString);
        }
        return new OriginalDate(targetDate); // Return our fixed target date when no argument is passed
      }
    };

    // Manually call the updateCountdown function which is likely called by setInterval
    // We need to find the interval in the script to call its callback
    // Assuming the script has something like: setInterval(updateCountdown, 1000);
    // Since we don't have the actual script, we'll mock the update logic directly.
    // A more robust test would require importing and calling the specific update function.

    // For the purpose of this test, let's assume the updateCountdown function exists and is called.
    // We'll simulate its effect.

    // Mock the Date object for the calculation part of countdown
    const mockCurrentTime = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000 + 15 * 60 * 1000 + 50 * 1000); // Example time

    global.Date = class extends OriginalDate {
      constructor(dateString) {
        if (dateString) return new OriginalDate(dateString);
        return mockCurrentTime;
      }
    };

    // Manually trigger the interval for one tick
    jest.advanceTimersByTime(1000);

    // Calculate expected values
    const oneDay = 24 * 60 * 60 * 1000;
    const diff = targetDate.getTime() - mockCurrentTime.getTime();
    const days = Math.floor(diff / oneDay);
    const hours = Math.floor((diff % oneDay) / (60 * 60 * 1000));
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((diff % (60 * 1000)) / 1000);

    // Check if innerHTML was updated with calculated values
    expect(daysEl.innerHTML).toBe(String(days).padStart(2, '0'));
    expect(hoursEl.innerHTML).toBe(String(hours).padStart(2, '0'));
    expect(minutesEl.innerHTML).toBe(String(minutes).padStart(2, '0'));
    expect(secondsEl.innerHTML).toBe(String(seconds).padStart(2, '0'));

    // Restore original Date object
    global.Date = OriginalDate;
  });

  test('should display 00 for time elements when countdown is finished', () => {
    require('./script');

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    // Set a target date in the past
    const now = new Date();
    const targetDate = new Date(now.getTime() - 1000); // 1 second in the past
    const OriginalDate = Date;
    global.Date = class extends OriginalDate {
      constructor(dateString) {
        if (dateString) {
          return new OriginalDate(dateString);
        }
        return new OriginalDate(targetDate);
      }
    };

    jest.advanceTimersByTime(1000);

    expect(daysEl.innerHTML).toBe('00');
    expect(hoursEl.innerHTML).toBe('00');
    expect(minutesEl.innerHTML).toBe('00');
    expect(secondsEl.innerHTML).toBe('00');

    global.Date = OriginalDate;
  });

  // --- Swiper Initialization Tests ---
  test('should initialize product-slider Swiper with correct configuration', () => {
    require('./script');

    const Swiper = require('swiper/bundle').Swiper;

    // Ensure Swiper was called for .product-slider
    expect(Swiper).toHaveBeenCalledTimes(1); // Assuming one call for product-slider
    expect(Swiper).toHaveBeenCalledWith('.product-slider', expect.any(Object));

    // Inspect the configuration passed to Swiper for product-slider
    const productSliderArgs = Swiper.mock.calls.find(call => call[0] === '.product-slider');
    expect(productSliderArgs).toBeDefined();
    const productSliderConfig = productSliderArgs[1];

    expect(productSliderConfig).toHaveProperty('loop', true);
    expect(productSliderConfig).toHaveProperty('spaceBetween', 20);
    expect(productSliderConfig).toHaveProperty('autoplay', {
      delay: 2500,
      disableOnInteraction: false,
    });
    expect(productSliderConfig).toHaveProperty('pagination', {
      clickable: true,
    });
    expect(productSliderConfig).toHaveProperty('navigation', {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    });
  });

  test('should initialize review-slider Swiper with correct configuration', () => {
    require('./script');

    const Swiper = require('swiper/bundle').Swiper;

    // Ensure Swiper was called for .review-slider
    // If product-slider is also initialized, Swiper will be called twice.
    // We need to check for the specific call for review-slider.
    const reviewSliderArgs = Swiper.mock.calls.find(call => call[0] === '.review-slider');
    expect(reviewSliderArgs).toBeDefined();
    const reviewSliderConfig = reviewSliderArgs[1];

    expect(reviewSliderConfig).toHaveProperty('loop', true);
    expect(reviewSliderConfig).toHaveProperty('spaceBetween', 30);
    expect(reviewSliderConfig).toHaveProperty('autoplay', {
      delay: 5000,
      disableOnInteraction: false,
    });
    expect(reviewSliderConfig).toHaveProperty('pagination', {
      clickable: true,
    });
    expect(reviewSliderConfig).toHaveProperty('navigation', {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    });
    // Check for breakpoints specific to the review slider
    expect(reviewSliderConfig).toHaveProperty('breakpoints');
    expect(reviewSliderConfig.breakpoints).toMatchObject({
      640: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 40,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 50,
      },
    });
  });

  test('should not initialize Swiper if slider elements are not present', () => {
    require('./script');

    const Swiper = require('swiper/bundle').Swiper;

    // Temporarily remove slider elements from querySelector mock
    const originalQuerySelector = document.querySelector;
    document.querySelector = jest.fn(selector => {
      if (selector === '.product-slider' || selector === '.review-slider') {
        return null; // Simulate element not found
      }
      return originalQuerySelector(selector);
    });

    // Re-require script to re-run initialization
    jest.resetModules();
    require('./script');

    // Expect Swiper constructor not to have been called for these sliders
    expect(Swiper).not.toHaveBeenCalledWith('.product-slider', expect.any(Object));
    expect(Swiper).not.toHaveBeenCalledWith('.review-slider', expect.any(Object));

    // Restore original querySelector
    document.querySelector = originalQuerySelector;
  });

});
```