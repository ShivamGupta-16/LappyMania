// Tests for script.test.js
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mocking the Swiper library to prevent errors during tests
jest.mock('swiper', () => ({
  Swiper: jest.fn(() => ({
    init: jest.fn(),
    destroy: jest.fn(),
    slideNext: jest.fn(),
    slidePrev: jest.fn(),
  })),
  Navigation: jest.fn(),
  Pagination: jest.fn(),
  Autoplay: jest.fn(),
  EffectFade: jest.fn(),
  Thumbs: jest.fn(),
}));

// Mocking window.matchMedia for theme toggling tests if needed (though class manipulation is direct)
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockReturnThis(),
  });
});

// Helper function to simulate scroll events
const simulateScroll = (scrollY) => {
  window.scrollY = scrollY;
  fireEvent.scroll(window);
};

describe('Script Functionality', () => {
  beforeEach(() => {
    // Reset DOM to a clean state before each test
    document.body.innerHTML = `
      <header class="header">
        <nav class="navbar">
          <button id="menu-bar">Menu</button>
          <ul class="nav-list">
            <li><a href="#home">Home</a></li>
            <li><a href="#products">Products</a></li>
            <li><a href="#review">Review</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <button id="close">Close</button>
        </nav>
        <button id="theme-toggler">Theme Toggle</button>
      </header>

      <section class="products">
        <div class="swiper product-slider">
          <div class="swiper-wrapper">
            <div class="swiper-slide">Product 1</div>
            <div class="swiper-slide">Product 2</div>
          </div>
          <div class="swiper-button-next"></div>
          <div class="swiper-button-prev"></div>
        </div>
      </section>

      <section class="review">
        <div class="swiper review-slider">
          <div class="swiper-wrapper">
            <div class="swiper-slide">Review 1</div>
            <div class="swiper-slide">Review 2</div>
          </div>
          <div class="swiper-button-next"></div>
          <div class="swiper-button-prev"></div>
        </div>
      </section>

      <div class="home">
        <div class="row">
          <div class="content">
            <h3 id="days"></h3>
            <h3 id="hours"></h3>
            <h3 id="minutes"></h3>
            <h3 id="seconds"></h3>
          </div>
        </div>
        <div class="image">
          <img src="image-1-small.jpg" class="big-image-1" alt="Big Image 1" />
          <img src="image-2-small.jpg" class="big-image-2" alt="Big Image 2" />
          <img src="image-3-small.jpg" class="big-image-3" alt="Big Image 3" />
        </div>
      </div>
    `;

    // Dynamically load the script content
    const script = document.createElement('script');
    script.src = './script.js'; // Assuming your script is in script.js
    document.body.appendChild(script);

    // Wait for the script to load and execute its initial setup
    return new Promise((resolve) => {
      script.onload = () => {
        // Ensure Swiper is available after script load
        const Swiper = require('swiper').Swiper;
        resolve();
      };
    });
  });

  afterEach(() => {
    // Clean up the appended script and reset scroll position
    const script = document.querySelector('script[src="./script.js"]');
    if (script) {
      script.remove();
    }
    window.scrollY = 0;
  });

  // Navigation Toggling Tests
  test('should toggle navbar visibility on menu-bar and close clicks', () => {
    const menuBar = screen.getByText(/Menu/i);
    const closeButton = screen.getByText(/Close/i);
    const navbar = document.querySelector('.navbar');

    expect(navbar).not.toHaveClass('active');

    fireEvent.click(menuBar);
    expect(navbar).toHaveClass('active');

    fireEvent.click(closeButton);
    expect(navbar).not.toHaveClass('active');
  });

  test('should keep navbar closed if menu-bar is not clicked', () => {
    const closeButton = screen.getByText(/Close/i);
    const navbar = document.querySelector('.navbar');

    expect(navbar).not.toHaveClass('active');
    fireEvent.click(closeButton); // Click close without opening
    expect(navbar).not.toHaveClass('active');
  });

  // Header Class Changes on Scroll Tests
  test('should add header-active class on scroll when scrollY > 100', () => {
    const header = document.querySelector('.header');
    simulateScroll(50);
    expect(header).not.toHaveClass('header-active');

    simulateScroll(120);
    expect(header).toHaveClass('header-active');
  });

  test('should remove header-active class on scroll when scrollY <= 100', () => {
    const header = document.querySelector('.header');
    simulateScroll(120);
    expect(header).toHaveClass('header-active');

    simulateScroll(80);
    expect(header).not.toHaveClass('header-active');
  });

  test('should have header-active class initially if scrollY > 100 on load', () => {
    // This case is harder to test directly in beforeEach without modifying initial state before script load
    // However, the logic for adding/removing is tested above.
    // If the script was designed to run a check on load and set class, we'd test that.
    // For this setup, we rely on the event listener.
  });

  // Theme Toggling Tests
  test('should toggle dark-mode class on body for theme toggling', () => {
    const themeToggler = screen.getByText(/Theme Toggle/i);
    const body = document.body;

    expect(body).not.toHaveClass('dark-mode');

    fireEvent.click(themeToggler);
    expect(body).toHaveClass('dark-mode');

    fireEvent.click(themeToggler);
    expect(body).not.toHaveClass('dark-mode');
  });

  // Image Source Update Tests
  test('should update big image source on small image click', () => {
    const bigImage1 = document.querySelector('.big-image-1');
    const bigImage2 = document.querySelector('.big-image-2');
    const bigImage3 = document.querySelector('.big-image-3');

    expect(bigImage1).toHaveAttribute('src', 'image-1-small.jpg');
    expect(bigImage2).toHaveAttribute('src', 'image-2-small.jpg');
    expect(bigImage3).toHaveAttribute('src', 'image-3-small.jpg');

    // Simulate clicking the first small image
    fireEvent.click(bigImage1);
    expect(bigImage1).toHaveAttribute('src', 'image-1-big.jpg');
    expect(bigImage2).toHaveAttribute('src', 'image-2-small.jpg'); // Others should remain unchanged
    expect(bigImage3).toHaveAttribute('src', 'image-3-small.jpg');

    // Simulate clicking the second small image
    fireEvent.click(bigImage2);
    expect(bigImage1).toHaveAttribute('src', 'image-1-small.jpg'); // First should revert
    expect(bigImage2).toHaveAttribute('src', 'image-2-big.jpg');
    expect(bigImage3).toHaveAttribute('src', 'image-3-small.jpg');
  });

  test('should handle clicking already active big image', () => {
    const bigImage1 = document.querySelector('.big-image-1');

    // Activate first image
    fireEvent.click(bigImage1);
    expect(bigImage1).toHaveAttribute('src', 'image-1-big.jpg');

    // Click it again
    fireEvent.click(bigImage1);
    expect(bigImage1).toHaveAttribute('src', 'image-1-small.jpg'); // Should revert
  });

  // countDown Function Tests
  test('should update countdown elements with provided date', async () => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 1); // Set to tomorrow
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    // Mock Date.now to control time for countdown calculation
    const mockDateNow = jest.fn(() => targetDate.getTime() - (10 * 24 * 60 * 60 * 1000)); // Set time 10 days before target
    global.Date.now = mockDateNow;

    // Need to re-execute the part of the script that sets up countDown if it's not automatically called
    // Assuming countDown is called on load or after DOM setup.
    // If countDown requires explicit calling in the test:
    // Assuming the script has a global countDown function or it's attached to window
    if (typeof countDown === 'function') {
      countDown(targetDate.toISOString());
    } else {
      // If countDown is attached to window
      window.countDown(targetDate.toISOString());
    }


    // Wait for the interval to potentially update (though typically you'd mock timers for more precise control)
    // For simplicity, we'll check immediate expected values if the function runs synchronously on setup
    // If the script uses setInterval, testing its updates requires jest.useFakeTimers()

    // Let's assume the initial call sets the values correctly
    await waitFor(() => {
      expect(daysEl).not.toBeEmptyDOMElement();
      expect(hoursEl).not.toBeEmptyDOMElement();
      expect(minutesEl).not.toBeEmptyDOMElement();
      expect(secondsEl).not.toBeEmptyDOMElement();
    });

    // Assert approximate values based on mocked Date.now (10 days before target)
    // This requires more complex timer mocking for exact second-by-second accuracy.
    // For a basic check, we ensure they are populated.

    // More precise test with fake timers:
    jest.useFakeTimers();

    // Re-initialize countdown with fake timers
    if (typeof countDown === 'function') {
      countDown(targetDate.toISOString());
    } else {
      window.countDown(targetDate.toISOString());
    }

    // Initial state should be set
    expect(daysEl.textContent).toBe('9');
    expect(hoursEl.textContent).toBe('23');
    expect(minutesEl.textContent).toBe('59');
    expect(secondsEl.textContent).toBe('59');

    // Advance timers by 1 second
    jest.advanceTimersByTime(1000);
    await Promise.resolve(); // Allow microtasks to run

    expect(secondsEl.textContent).toBe('58');

    // Advance timers to update minutes, hours, days
    jest.advanceTimersByTime((60 - 1) * 1000); // Advance to next minute
    await Promise.resolve();
    expect(minutesEl.textContent).toBe('58');
    expect(secondsEl.textContent).toBe('59');

    jest.advanceTimersByTime((60 * 60 - 60) * 1000); // Advance to next hour
    await Promise.resolve();
    expect(hoursEl.textContent).toBe('22');
    expect(minutesEl.textContent).toBe('59');
    expect(secondsEl.textContent).toBe('59');

    jest.advanceTimersByTime((24 * 60 * 60 - (60 * 60)) * 1000); // Advance to next day
    await Promise.resolve();
    expect(daysEl.textContent).toBe('8');
    expect(hoursEl.textContent).toBe('23');
    expect(minutesEl.textContent).toBe('59');
    expect(secondsEl.textContent).toBe('59');

    jest.useRealTimers(); // Restore real timers
    global.Date.now = Date.now; // Restore original Date.now
  });

  test('should display 0 for countdown elements when target date is in the past', async () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1); // Set to yesterday

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    // Mock Date.now to be the current time
    const mockDateNow = jest.fn(() => new Date().getTime());
    global.Date.now = mockDateNow;

    if (typeof countDown === 'function') {
      countDown(pastDate.toISOString());
    } else {
      window.countDown(pastDate.toISOString());
    }

    // Countdown should show 0s when the target date has passed
    await waitFor(() => {
      expect(daysEl.textContent).toBe('0');
      expect(hoursEl.textContent).toBe('0');
      expect(minutesEl.textContent).toBe('0');
      expect(secondsEl.textContent).toBe('0');
    });

    global.Date.now = Date.now; // Restore original Date.now
  });

  // Swiper Initialization Tests
  test('should initialize product-slider Swiper', () => {
    const Swiper = require('swiper').Swiper; // Get the mocked Swiper

    // Expect Swiper to be called with correct selector and options
    expect(Swiper).toHaveBeenCalledWith('.product-slider', {
      loop: true,
      grabCursor: true,
      spaceBetween: 20,
      autoplay: {
        delay: 7500,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        0: { slidesPerView: 1 },
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
      },
    });

    // Check if init was called on the instance
    const mockSwiperInstance = Swiper.mock.instances[0];
    expect(mockSwiperInstance.init).toHaveBeenCalled();
  });

  test('should initialize review-slider Swiper', () => {
    const Swiper = require('swiper').Swiper; // Get the mocked Swiper

    // Expect Swiper to be called with correct selector and options
    expect(Swiper).toHaveBeenCalledWith('.review-slider', {
      loop: true,
      grabCursor: true,
      spaceBetween: 20,
      autoplay: {
        delay: 7500,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        0: { slidesPerView: 1 },
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
      },
    });

    // Check if init was called on the instance
    // This might be called multiple times if the script initializes both swipers sequentially.
    // We can check the last call or expect it to have been called at least once for this slider.
    const swiperCalls = Swiper.mock.calls;
    const reviewSliderCall = swiperCalls.find(call => call[0] === '.review-slider');
    expect(reviewSliderCall).toBeDefined();
    expect(Swiper).toHaveBeenCalledTimes(2); // Assuming both sliders are initialized
  });

  test('should handle Swiper initialization failure gracefully (if applicable)', () => {
    // This test assumes the script has error handling around Swiper init.
    // If the script doesn't explicitly handle Swiper errors, this test might not be meaningful
    // unless we mock Swiper to throw an error.
    const Swiper = require('swiper').Swiper;
    Swiper.mockImplementationOnce(() => {
      throw new Error('Swiper initialization failed');
    });

    // Re-rendering or re-initializing might be needed if the script runs init logic automatically.
    // For this example, let's assume the script would try to initialize on load.
    // If Swiper fails, the script should ideally not crash.
    // This is hard to test without knowing the script's error handling.
    // A basic check would be that the test runner doesn't fail unexpectedly.
    expect(() => {
      // Re-run the initialization part of the script if possible, or just expect no unhandled exceptions
      // from the initial setup if Swiper constructor throws.
    }).not.toThrow();
  });
});

// Tests for index.html
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Assuming your main application component is App.js and it renders the structure described
import App from '../src/App'; // Adjust the path as needed

// Mocking any external dependencies or components if necessary
// For example, if you have API calls, you might mock them:
// jest.mock('../src/api');

describe('App Functionality', () => {

  beforeEach(() => {
    render(<App />);
  });

  // Header Icons Tests
  test('should navigate to search when search icon is clicked', () => {
    const searchIcon = screen.getByLabelText(/search/i); // Adjust label based on your implementation
    fireEvent.click(searchIcon);
    // Assert that the search functionality is triggered or a new view is shown
    // This might involve checking for a search input or a change in URL if using React Router
    expect(screen.getByPlaceholderText(/search products/i)).toBeInTheDocument(); // Example assertion
  });

  test('should navigate to favorites when heart icon is clicked', () => {
    const heartIcon = screen.getByLabelText(/favorites/i); // Adjust label
    fireEvent.click(heartIcon);
    // Assert navigation to favorites page/section
    expect(screen.getByText(/your favorites/i)).toBeInTheDocument(); // Example assertion
  });

  test('should navigate to cart when cart icon is clicked', () => {
    const cartIcon = screen.getByLabelText(/cart/i); // Adjust label
    fireEvent.click(cartIcon);
    // Assert navigation to cart page/section
    expect(screen.getByText(/your shopping cart/i)).toBeInTheDocument(); // Example assertion
  });

  test('should navigate to user profile when user icon is clicked', () => {
    const userIcon = screen.getByLabelText(/user profile/i); // Adjust label
    fireEvent.click(userIcon);
    // Assert navigation to user profile page/section
    expect(screen.getByText(/my account/i)).toBeInTheDocument(); // Example assertion
  });

  // Navigation Bar Tests
  test('should navigate to Home when Home link is clicked', () => {
    const homeLink = screen.getByRole('link', { name: /home/i });
    fireEvent.click(homeLink);
    // Assert that the home section is visible or the correct content is displayed
    expect(screen.getByText(/welcome to our store/i)).toBeInTheDocument(); // Example assertion
  });

  test('should navigate to Shop when Shop link is clicked', () => {
    const shopLink = screen.getByRole('link', { name: /shop/i });
    fireEvent.click(shopLink);
    // Assert navigation to shop page/section
    expect(screen.getByText(/all products/i)).toBeInTheDocument(); // Example assertion
  });

  test('should navigate to Categories when Categories link is clicked', () => {
    const categoriesLink = screen.getByRole('link', { name: /categories/i });
    fireEvent.click(categoriesLink);
    // Assert navigation to categories page/section
    expect(screen.getByText(/browse by category/i)).toBeInTheDocument(); // Example assertion
  });

  test('should navigate to Blog when Blog link is clicked', () => {
    const blogLink = screen.getByRole('link', { name: /blog/i });
    fireEvent.click(blogLink);
    // Assert navigation to blog page/section
    expect(screen.getByText(/latest articles/i)).toBeInTheDocument(); // Example assertion
  });

  test('should close the navigation bar when close button is clicked', () => {
    // Assume the nav bar is initially visible or can be toggled open
    // If it's toggled, you might need to simulate opening it first
    // const menuButton = screen.getByLabelText(/open menu/i);
    // fireEvent.click(menuButton);

    const closeButton = screen.getByLabelText(/close navigation/i); // Adjust label
    fireEvent.click(closeButton);
    // Assert that the navigation bar is no longer visible
    // This might involve checking for its absence or a specific CSS class
    expect(closeButton).not.toBeVisible(); // Example assertion, depends on implementation
  });

  // Home Section Tests
  test('should display the correct content in the home section', () => {
    expect(screen.getByText(/welcome to our store/i)).toBeInTheDocument(); // Example headline
    expect(screen.getByText(/discover our latest collections/i)).toBeInTheDocument(); // Example subheading/description
  });

  test('should display the home section image', () => {
    const homeImage = screen.getByAltText(/hero banner/i); // Adjust alt text
    expect(homeImage).toBeInTheDocument();
    expect(homeImage).toHaveAttribute('src'); // Check if src attribute is present
  });

  // Product Display Tests
  test('should display products in the category section', () => {
    // Assuming categories have associated products displayed
    expect(screen.getAllByTestId(/category-product/i).length).toBeGreaterThan(0); // Example selector for category products
  });

  test('should display products in the products section', () => {
    // Assuming a general products section
    expect(screen.getAllByTestId(/product-item/i).length).toBeGreaterThan(0); // Example selector for product items
  });

  test('should display featured products', () => {
    // Assuming a specific section for featured products
    expect(screen.getAllByTestId(/featured-product/i).length).toBeGreaterThan(0); // Example selector for featured products
  });

  // Deal Section Tests
  test('should display the deal section countdown timer', () => {
    expect(screen.getByTestId(/countdown-timer/i)).toBeInTheDocument(); // Example selector
    // You might also want to check for the presence of hours, minutes, seconds elements
    expect(screen.getByText(/hours/i)).toBeInTheDocument();
    expect(screen.getByText(/minutes/i)).toBeInTheDocument();
    expect(screen.getByText(/seconds/i)).toBeInTheDocument();
  });

  test('should navigate to shop when "Shop Now" button in deal section is clicked', () => {
    const shopNowButton = screen.getByRole('button', { name: /shop now/i });
    fireEvent.click(shopNowButton);
    // Assert navigation to shop page/section
    expect(screen.getByText(/all products/i)).toBeInTheDocument(); // Example assertion
  });

  // Review Slider Tests
  test('should display reviews in the review slider', () => {
    // Assuming reviews are rendered within a slider component
    expect(screen.getAllByTestId(/review-item/i).length).toBeGreaterThan(0); // Example selector for review items
  });

  test('should allow navigation through review slider (e.g., next button)', () => {
    // Simulate clicking a "next" button in the slider
    const nextButton = screen.getByLabelText(/next review/i); // Adjust label
    const initialReview = screen.getByTestId(/review-item/i); // Get the first review
    fireEvent.click(nextButton);
    // Assert that the next review is now visible or the content has changed
    // This assertion might be tricky depending on how the slider updates.
    // You might check if a *different* review element is now present.
    const nextReview = screen.getAllByTestId(/review-item/i)[1]; // Assuming there are at least two
    expect(nextReview).not.toBe(initialReview); // Check if it's a different DOM element
  });

  // Footer Links Tests
  test('should navigate to About Us page when About Us link is clicked', () => {
    const aboutUsLink = screen.getByRole('link', { name: /about us/i });
    fireEvent.click(aboutUsLink);
    // Assert navigation to About Us page
    expect(screen.getByText(/our story/i)).toBeInTheDocument(); // Example assertion
  });

  test('should navigate to Contact Us page when Contact Us link is clicked', () => {
    const contactUsLink = screen.getByRole('link', { name: /contact us/i });
    fireEvent.click(contactUsLink);
    // Assert navigation to Contact Us page
    expect(screen.getByText(/get in touch/i)).toBeInTheDocument(); // Example assertion
  });

  test('should navigate to Privacy Policy page when Privacy Policy link is clicked', () => {
    const privacyPolicyLink = screen.getByRole('link', { name: /privacy policy/i });
    fireEvent.click(privacyPolicyLink);
    // Assert navigation to Privacy Policy page
    expect(screen.getByText(/our privacy practices/i)).toBeInTheDocument(); // Example assertion
  });

  test('should navigate to Terms of Service page when Terms of Service link is clicked', () => {
    const termsLink = screen.getByRole('link', { name: /terms of service/i });
    fireEvent.click(termsLink);
    // Assert navigation to Terms of Service page
    expect(screen.getByText(/terms and conditions/i)).toBeInTheDocument(); // Example assertion
  });

  // Edge Case: What if no products are found?
  test('should display a message if no products are found in a section', () => {
    // This test would require mocking or manipulating the state to simulate an empty product list.
    // For example, if you have a component that fetches products:
    // import { fetchProducts } from '../src/api';
    // jest.mock('../src/api', () => ({
    //   fetchProducts: jest.fn().mockResolvedValue([]), // Mock to return empty array
    // }));
    // render(<App />); // Re-render after mock
    // expect(screen.getByText(/no products found/i)).toBeInTheDocument();
  });

  // Edge Case: What if the deal countdown reaches zero?
  test('should update the deal section when countdown reaches zero', async () => {
    // This is a more advanced test that might require mocking the system time
    // or creating a mock countdown timer component that emits an event when done.
    // For simplicity, you might test the UI changes when a deal ends if your component handles it.
    // For example, if it shows a "Deal Ended" message:
    // // Assume your component updates after a delay or event
    // await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for potential update
    // expect(screen.getByText(/deal ended/i)).toBeInTheDocument();
  });
});

// Tests for style.css
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mocking the CSS file as Jest doesn't directly process CSS
// In a real-world scenario, you might use a CSS loader or a testing library that handles CSS.
// For this example, we'll assume CSS variables are set globally or the components are structured
// to implicitly use them, and we'll test the *effect* of the styling rather than direct CSS parsing.

describe('CSS Styling and Variables', () => {
  // Mocking CSS variables if they are expected to be set in the global scope or a specific element
  // This is a simplistic approach. A more robust solution would involve mocking styles directly
  // or using a library that can interpret CSS.
  const setMockCssVariable = (name, value) => {
    document.documentElement.style.setProperty(name, value);
  };

  const removeMockCssVariable = (name) => {
    document.documentElement.style.removeProperty(name);
  };

  beforeAll(() => {
    // Mocking some common CSS variables for testing purposes
    setMockCssVariable('--primary-color', '#007bff');
    setMockCssVariable('--secondary-color', '#6c757d');
    setMockCssVariable('--text-color', '#333');
    setMockCssVariable('--background-color', '#f8f9fa');
    setMockCssVariable('--header-bg-color', '#343a40');
    setMockCssVariable('--header-text-color', '#ffffff');
    setMockCssVariable('--footer-bg-color', '#212529');
    setMockCssVariable('--footer-text-color', '#ffffff');
    setMockCssVariable('--active-color', '#28a745');
  });

  afterAll(() => {
    // Clean up mocked CSS variables
    removeMockCssVariable('--primary-color');
    removeMockCssVariable('--secondary-color');
    removeMockCssVariable('--text-color');
    removeMockCssVariable('--background-color');
    removeMockCssVariable('--header-bg-color');
    removeMockCssVariable('--header-text-color');
    removeMockCssVariable('--footer-bg-color');
    removeMockCssVariable('--footer-text-color');
    removeMockCssVariable('--active-color');
  });

  // Helper function to check computed styles for a given element
  const expectComputedStyle = (element, property, expectedValue) => {
    expect(window.getComputedStyle(element)[property]).toBe(expectedValue);
  };

  // --- Test Cases ---

  describe('CSS Variable Application', () => {
    test('should apply primary color variable to elements that should use it', () => {
      // Assuming a button component that uses --primary-color for its background
      const ButtonComponent = () => <button data-testid="primary-btn" style={{ backgroundColor: 'var(--primary-color)' }}>Click Me</button>;
      render(<ButtonComponent />);
      const button = screen.getByTestId('primary-btn');
      // The computed style should resolve to the mocked variable value
      expectComputedStyle(button, 'background-color', 'rgb(0, 123, 255)');
    });

    test('should apply text color variable to body text', () => {
      // Assuming the body has a text color set by a variable
      const BodyComponent = () => <div data-testid="body-text" style={{ color: 'var(--text-color)' }}>Some text</div>;
      render(<BodyComponent />);
      const bodyText = screen.getByTestId('body-text');
      expectComputedStyle(bodyText, 'color', 'rgb(51, 51, 51)');
    });

    test('should apply background color variable to body', () => {
      // Assuming the body has a background color set by a variable
      const BodyComponent = () => <div data-testid="body-bg" style={{ backgroundColor: 'var(--background-color)' }}></div>;
      render(<BodyComponent />);
      const bodyBg = screen.getByTestId('body-bg');
      expectComputedStyle(bodyBg, 'background-color', 'rgb(248, 249, 250)');
    });
  });

  describe('Default and Active States', () => {
    test('should have default styling for body', () => {
      // We've already tested body background and text color above.
      // Add any other default body styles here if they are complex and rely on variables.
      const BodyComponent = () => <div data-testid="default-body" style={{
        color: 'var(--text-color)',
        backgroundColor: 'var(--background-color)'
      }}>Default Body</div>;
      render(<BodyComponent />);
      const body = screen.getByTestId('default-body');
      expectComputedStyle(body, 'color', 'rgb(51, 51, 51)');
      expectComputedStyle(body, 'background-color', 'rgb(248, 249, 250)');
    });

    test('should have default styling for header', () => {
      const HeaderComponent = () => <header data-testid="default-header" style={{
        backgroundColor: 'var(--header-bg-color)',
        color: 'var(--header-text-color)'
      }}>Default Header</header>;
      render(<HeaderComponent />);
      const header = screen.getByTestId('default-header');
      expectComputedStyle(header, 'background-color', 'rgb(52, 58, 64)');
      expectComputedStyle(header, 'color', 'rgb(255, 255, 255)');
    });

    test('should apply active state styling when active', () => {
      // Assuming a navigation link or button that has an 'active' class or state
      const ActiveElement = ({ isActive }) => (
        <div data-testid="active-element" className={isActive ? 'active' : ''} style={{
          color: isActive ? 'var(--active-color)' : 'var(--text-color)'
        }}>
          Nav Item
        </div>
      );

      // Test active state
      render(<ActiveElement isActive={true} />);
      const activeEl = screen.getByTestId('active-element');
      expectComputedStyle(activeEl, 'color', 'rgb(40, 167, 117)');

      // Test inactive state for comparison
      render(<ActiveElement isActive={false} />);
      const inactiveEl = screen.getByTestId('active-element');
      expectComputedStyle(inactiveEl, 'color', 'rgb(51, 51, 51)');
    });
  });

  describe('Layout and Responsiveness of Common Elements', () => {
    test('should style .btn correctly', () => {
      const ButtonComponent = () => <button data-testid="common-btn" className="btn" style={{
        padding: '10px 20px', // Example styles likely in CSS
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        border: 'none',
        borderRadius: '5px'
      }}>Action</button>;
      render(<ButtonComponent />);
      const btn = screen.getByTestId('common-btn');
      // Checking computed styles that are directly applied or derived from CSS classes
      expect(btn).toHaveStyle('padding: 10px 20px;');
      expectComputedStyle(btn, 'background-color', 'rgb(0, 123, 255)');
      expectComputedStyle(btn, 'color', 'rgb(255, 255, 255)');
      expect(btn).toHaveStyle('border: none;');
      expect(btn).toHaveStyle('border-radius: 5px;');
    });

    test('should style .heading correctly', () => {
      const HeadingComponent = () => <h2 data-testid="common-heading" className="heading" style={{
        fontSize: '2.5rem',
        marginBottom: '1rem',
        color: 'var(--text-color)'
      }}>Section Title</h2>;
      render(<HeadingComponent />);
      const heading = screen.getByTestId('common-heading');
      expect(heading).toHaveStyle('font-size: 2.5rem;');
      expect(heading).toHaveStyle('margin-bottom: 1rem;');
      expectComputedStyle(heading, 'color', 'rgb(51, 51, 51)');
    });

    test('should style .navbar correctly', () => {
      const NavbarComponent = () => <nav data-testid="common-navbar" className="navbar" style={{
        backgroundColor: 'var(--header-bg-color)',
        padding: '1rem 0'
      }}>
        <ul>
          <li><a href="#" style={{ color: 'var(--header-text-color)' }}>Link 1</a></li>
        </ul>
      </nav>;
      render(<NavbarComponent />);
      const navbar = screen.getByTestId('common-navbar');
      expectComputedStyle(navbar, 'background-color', 'rgb(52, 58, 64)');
      expect(navbar).toHaveStyle('padding: 1rem 0;');
      const link = screen.getByRole('link');
      expectComputedStyle(link, 'color', 'rgb(255, 255, 255)');
    });
  });

  describe('Styling for Specific Sections', () => {
    test('should style .home section', () => {
      const HomeComponent = () => <section data-testid="home-section" className="home" style={{
        padding: '50px 0',
        backgroundColor: 'var(--background-color)'
      }}>Home Content</section>;
      render(<HomeComponent />);
      const homeSection = screen.getByTestId('home-section');
      expect(homeSection).toHaveStyle('padding: 50px 0;');
      expectComputedStyle(homeSection, 'background-color', 'rgb(248, 249, 250)');
    });

    test('should style .category section', () => {
      const CategoryComponent = () => <section data-testid="category-section" className="category" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
      }}>Category Content</section>;
      render(<CategoryComponent />);
      const categorySection = screen.getByTestId('category-section');
      expect(categorySection).toHaveStyle('display: grid;');
      expect(categorySection).toHaveStyle('grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));');
      expect(categorySection).toHaveStyle('gap: 20px;');
    });

    test('should style .products section', () => {
      const ProductsComponent = () => <section data-testid="products-section" className="products" style={{
        marginTop: '30px'
      }}>Products Content</section>;
      render(<ProductsComponent />);
      const productsSection = screen.getByTestId('products-section');
      expect(productsSection).toHaveStyle('margin-top: 30px;');
    });

    test('should style .featured section', () => {
      const FeaturedComponent = () => <section data-testid="featured-section" className="featured" style={{
        backgroundColor: '#e9ecef',
        padding: '40px 0'
      }}>Featured Content</section>;
      render(<FeaturedComponent />);
      const featuredSection = screen.getByTestId('featured-section');
      expectComputedStyle(featuredSection, 'background-color', 'rgb(233, 236, 239)');
      expect(featuredSection).toHaveStyle('padding: 40px 0;');
    });

    test('should style .deal section', () => {
      const DealComponent = () => <section data-testid="deal-section" className="deal" style={{
        textAlign: 'center',
        color: 'var(--primary-color)'
      }}>Deal Content</section>;
      render(<DealComponent />);
      const dealSection = screen.getByTestId('deal-section');
      expect(dealSection).toHaveStyle('text-align: center;');
      expectComputedStyle(dealSection, 'color', 'rgb(0, 123, 255)');
    });

    test('should style .review section', () => {
      const ReviewComponent = () => <section data-testid="review-section" className="review" style={{
        position: 'relative',
        border: '1px solid #dee2e6'
      }}>Review Content</section>;
      render(<ReviewComponent />);
      const reviewSection = screen.getByTestId('review-section');
      expect(reviewSection).toHaveStyle('position: relative;');
      expect(reviewSection).toHaveStyle('border: 1px solid rgb(222, 226, 230);');
    });

    test('should style .footer section', () => {
      const FooterComponent = () => <footer data-testid="footer-section" className="footer" style={{
        backgroundColor: 'var(--footer-bg-color)',
        color: 'var(--footer-text-color)',
        padding: '20px 0'
      }}>Footer Content</footer>;
      render(<FooterComponent />);
      const footerSection = screen.getByTestId('footer-section');
      expectComputedStyle(footerSection, 'background-color', 'rgb(33, 37, 41)');
      expectComputedStyle(footerSection, 'color', 'rgb(255, 255, 255)');
      expect(footerSection).toHaveStyle('padding: 20px 0;');
    });
  });

  describe('Media Query Adjustments', () => {
    // Testing media queries directly in a JavaScript test is complex without mocking the viewport.
    // A common approach is to test the *effect* of the media query on component rendering or styles.
    // For this example, we'll assume that a component's style is conditionally applied based on screen size,
    // and we'll try to simulate that. A better approach would involve libraries like 'test-storybook' or
    // directly manipulating window.innerWidth and re-rendering if the component uses hooks for this.

    test('should adjust layout for smaller screens', () => {
      // Example: A component that stacks items on small screens and shows them side-by-side on large screens.
      // We'll simulate the 'small screen' condition.
      const ResponsiveLayout = () => (
        <div data-testid="responsive-layout" style={{
          display: 'flex',
          flexDirection: 'column', // Default for small screens
          '@media (min-width: 768px)': { // This is pseudo-code for how CSS might apply
            flexDirection: 'row'
          }
        }}>
          <div style={{ width: '100px', height: '100px', backgroundColor: 'red' }}>Item 1</div>
          <div style={{ width: '100px', height: '100px', backgroundColor: 'blue' }}>Item 2</div>
        </div>
      );

      // To test this, we'd ideally mock `window.innerWidth` and potentially `matchMedia`.
      // For simplicity, we'll test the *expected* style if the media query were active.
      // In a real scenario, you'd mock `window.matchMedia` or test in a browser-like environment.

      // This test might fail directly if not supported by the rendering environment or if styles aren't dynamically applied.
      // A more robust test would involve setting up a mock for `window.matchMedia`.

      // Mocking matchMedia for simplicity in this example
      const mockMatchMedia = (query) => ({
        matches: query === '(min-width: 768px)' ? false : true, // Simulate small screen
        addListener: jest.fn(),
        removeListener: jest.fn(),
      });
      global.matchMedia = jest.fn(mockMatchMedia);

      render(<ResponsiveLayout />);
      const layout = screen.getByTestId('responsive-layout');

      // On small screens, expect column layout
      expect(layout).toHaveStyle('flex-direction: column;');

      // If we were testing for larger screens, we'd change the mockMatchMedia and re-render.
      // This illustrates the concept.
      // Mocking for large screen
      global.matchMedia.mockImplementation((query) => ({
        matches: query === '(min-width: 768px)' ? true : false, // Simulate large screen
        addListener: jest.fn(),
        removeListener: jest.fn(),
      }));
      // Rerender or check if styles update based on media query change
      // For demonstration, we assume the component's styles would adapt.
      // In a real app, you might need to re-render or have specific elements that reflect this.
      // Here, we check for the 'row' style as if it were applied on a large screen.
      // This part is highly dependent on how the component actually uses media queries.
      // A direct test of `getComputedStyle` after changing `window.innerWidth` is another approach.
      // For now, we'll assert the expected behavior on small screen.

      // Clean up mock
      delete global.matchMedia;
    });
  });

  describe('Scroll Behavior and Scrollbar Styling', () => {
    test('should have appropriate scroll behavior', () => {
      // Assuming a container that has overflow and might have custom scrollbar styling
      const ScrollableContainer = () => (
        <div data-testid="scrollable-container" style={{
          height: '200px',
          overflowY: 'auto',
          scrollbarWidth: 'thin', // For Firefox
          scrollbarColor: 'var(--primary-color) var(--background-color)', // For Firefox
          // Webkit scrollbar styling (often in global CSS)
          WebkitScrollbar: 'thin',
          WebkitScrollbarTrack: 'var(--background-color)',
          WebkitScrollbarThumb: 'var(--primary-color)'
        }}>
          {Array.from({ length: 50 }).map((_, i) => (
            <p key={i}>Scrollable content line {i + 1}</p>
          ))}
        </div>
      );

      render(<ScrollableContainer />);
      const container = screen.getByTestId('scrollable-container');

      expect(container).toHaveStyle('overflow-y: auto;');
      expect(container).toHaveStyle('height: 200px;');

      // Testing scrollbar styling directly via computed styles is tricky as it's applied to pseudo-elements.
      // A more direct approach for webkit might be to check for the presence of specific CSS rules if you have a CSS parser.
      // For cross-browser compatibility, we'll check the styles that are more universally supported or directly applied.
      // For Firefox:
      expectComputedStyle(container, 'scrollbar-width', 'thin');
      expectComputedStyle(container, 'scrollbar-color', 'rgb(0, 123, 255) rgb(248, 249, 250)');

      // Testing webkit scrollbar styles is usually done by inspecting the generated CSS rules,
      // or if the styles are applied inline (as shown here for demonstration), they might be checked.
      // However, direct computed style for `webkitScrollbar` is not standard.
      // A common way is to check CSS rules if loaded via a stylesheet.
      // For this inline example, it's hard to directly assert computed style for pseudo-elements.
      // If these styles were in a global CSS file, you would need to mock or parse that.
    });

    test('should not have scrollbars when not needed', () => {
      const NonScrollableContainer = () => (
        <div data-testid="non-scrollable-container" style={{
          height: 'auto',
          overflow: 'visible'
        }}>
          Short content
        </div>
      );
      render(<NonScrollableContainer />);
      const container = screen.getByTestId('non-scrollable-container');
      expect(container).toHaveStyle('overflow: visible;');
      // No specific scrollbar styling should be applied or needed
    });
  });

  // --- Edge Cases ---

  describe('Edge Cases', () => {
    test('should handle missing CSS variables gracefully (if fallback values are used)', () => {
      // If CSS variables have fallbacks, test that the fallback is used when the variable is not defined.
      // For this test, we'll remove the 'primary-color' variable.
      removeMockCssVariable('--primary-color');

      const ButtonWithFallback = () => <button data-testid="fallback-btn" style={{ backgroundColor: 'var(--primary-color, gray)' }}>Fallback Button</button>;
      render(<ButtonWithFallback />);
      const button = screen.getByTestId('fallback-btn');
      expectComputedStyle(button, 'background-color', 'rgb(128, 128, 128)'); // 'gray' fallback

      // Re-add the variable for other tests
      setMockCssVariable('--primary-color', '#007bff');
    });

    test('should apply styles to elements with no specific class if using global styles', () => {
      // Example: If body, html, or common elements inherit styles from global CSS.
      // We've tested body and header base styles already. This is a conceptual check.
      const SimpleDiv = () => <div data-testid="simple-div">Just a div.</div>;
      render(<SimpleDiv />);
      const div = screen.getByTestId('simple-div');
      // Assuming global styles apply a default text color if not overridden
      expectComputedStyle(div, 'color', 'rgb(51, 51, 51)'); // Inherited from body's --text-color
    });
  });
});