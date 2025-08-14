// Tests for index.html
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom'; // Assuming routing is used
import App from './App'; // Assuming App.js contains the main component

jest.useFakeTimers();

describe('E-commerce Website', () => {
  describe('Search Functionality', () => {
    test('Successful search', () => {
      render(<BrowserRouter><App /></BrowserRouter>);
      const searchInput = screen.getByRole('textbox', { name: /search/i });
      fireEvent.change(searchInput, { target: { value: 'laptop' } });
      // Assertions to check if search results are displayed.  Requires knowing the implementation details. Example:
      expect(screen.getByText(/laptop/i)).toBeInTheDocument(); 
    });
    test('No results', () => {
      render(<BrowserRouter><App /></BrowserRouter>);
      const searchInput = screen.getByRole('textbox', { name: /search/i });
      fireEvent.change(searchInput, { target: { value: 'xyz123' } });
      // Assertions to check for "no results" message or empty results section. Example:
      expect(screen.getByText(/no results/i)).toBeInTheDocument();
    });
    test('Empty search', () => {
      render(<BrowserRouter><App /></BrowserRouter>);
      const searchInput = screen.getByRole('textbox', { name: /search/i });
      fireEvent.change(searchInput, { target: { value: '' } });
      // Assertions to check for initial state or default display.
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument(); // Example assertion
    });
  });


  describe('Product Display', () => {
    test('Slider functionality', () => {
      render(<BrowserRouter><App /></BrowserRouter>);
      // Find slider elements (buttons, images).  Requires implementation details.
      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);
      // Assertions to check if the slider has moved to the next image.  Requires implementation specifics
      expect(screen.getByRole('img', {name: /image2/i})).toBeVisible; //Example
    });
    test('Product data display', () => {
      render(<BrowserRouter><App /></BrowserRouter>);
      // Assertions to check if product information (name, price, etc.) is displayed correctly.  Requires implementation details.  Example:
      expect(screen.getByText(/Product Name/i)).toBeInTheDocument();
    });
  });

  describe('Countdown Timer', () => {
    test('Timer counts down', () => {
      jest.advanceTimersByTime(1000); // Advance time to check if timer updates
      // Assertions to check the timer value. Requires implementation details. Example:
      expect(screen.getByText(/1:59/i)).toBeInTheDocument(); // Replace with expected time based on implementation
    });
    test('Timer reaches zero', () => {
        jest.advanceTimersByTime(60000); //Advance timer to 60 seconds for testing
        //Assertions for timer reaching zero. Requires implementation details
        expect(screen.getByText(/Time's up/i)).toBeInTheDocument(); //Replace with expected message

    });
  });

  describe('Navigation Menu', () => {
    test('Responsiveness', () => {
      // Requires mocking window resize events or using a library that simulates window resizing.
      //  Example with screen.queryBy... to check for hidden/visible based on window size
      render(<BrowserRouter><App /></BrowserRouter>);
      //Simulate resize
      // Assertions to check menu visibility based on screen size.  Requires implementation details. Example:
    });
  });

  describe('Icon Interactions', () => {
    test('Heart icon', () => {
      render(<BrowserRouter><App /></BrowserRouter>);
      const heartIcon = screen.getByRole('button', { name: /heart/i });
      fireEvent.click(heartIcon);
      // Assertions to check for changes in the heart icon state (e.g., filled vs. empty). Requires implementation details.
    });
    test('Cart icon', () => {
      render(<BrowserRouter><App /></BrowserRouter>);
      const cartIcon = screen.getByRole('button', { name: /cart/i });
      fireEvent.click(cartIcon);
      // Assertions to check for cart updates. Requires implementation details.
    });
    test('User icon', () => {
      render(<BrowserRouter><App /></BrowserRouter>);
      const userIcon = screen.getByRole('button', { name: /user/i });
      fireEvent.click(userIcon);
      // Assertions to check for user menu or login/profile changes. Requires implementation details.
    });
  });
});
```

// Tests for script.test.js
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import Navbar from './Navbar'; // Assuming Navbar component exists
import ThemeToggler from './ThemeToggler'; // Assuming ThemeToggler component exists
import ImageGallery from './ImageGallery'; // Assuming ImageGallery component exists
import Swiper from 'swiper'; // Assuming Swiper library is used
import 'swiper/css';
import 'swiper/css/navigation';
import { countDown } from './script'; // Assuming countDown function exists


jest.useFakeTimers();

describe('Navbar', () => {
  test('Navbar toggle functionality', () => {
    render(<Navbar />);
    const menuBar = screen.getByRole('button', { name: /menu-bar/i });
    const closeButton = screen.getByRole('button', { name: /close/i });

    fireEvent.click(menuBar);
    expect(screen.getByText(/menu/i)).toBeInTheDocument();

    fireEvent.click(closeButton);
    expect(screen.queryByText(/menu/i)).not.toBeInTheDocument();

  });
});


describe('ThemeToggler', () => {
  test('Theme toggler functionality', () => {
    render(<ThemeToggler />);
    const toggler = screen.getByRole('button', { name: /theme-toggler/i });
    fireEvent.click(toggler);
    // Add assertions to check for theme change (e.g., class change)
    expect(toggler).toHaveClass('active'); //Example assertion. Adjust as needed
  });
});

describe('ImageGallery', () => {
  test('Image gallery updates on small image clicks', () => {
    render(<ImageGallery />);
    const smallImage = screen.getByTestId('small-image-1'); //Example. Adjust selector as needed.
    fireEvent.click(smallImage);
    // Add assertions to check for main image update.  e.g., src attribute change.
    expect(screen.getByRole('img', {name: /main image/i})).toHaveAttribute('src', '/path/to/image1'); // Example assertion. Adjust as needed.

  });
  test('Image gallery handles non-existent image click gracefully', () => {
    render(<ImageGallery />);
    //Simulate a click on a non-existent image to check for error handling.  Adjust as needed.
    expect(() => fireEvent.click(screen.getByTestId('non-existent-image'))).toThrow(); // Example error handling assertion. Adjust as needed

  });

});

describe('Countdown Timer', () => {
  test('countDown function', () => {
    const mockCallback = jest.fn();
    countDown(10, mockCallback);
    expect(mockCallback).toHaveBeenCalledTimes(10);
    expect(mockCallback).toHaveBeenLastCalledWith(0);
    jest.runAllTimers();

  });
  test('countDown function with zero time', () => {
    const mockCallback = jest.fn();
    countDown(0, mockCallback);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenLastCalledWith(0);

  });


});

describe('Swiper Slider', () => {
  test('Swiper slider initialization', () => {
    render( <div id="product-slider"></div> ); // Example render. Adapt as needed.
    render( <div id="review-slider"></div> ); // Example render. Adapt as needed.
    const productSlider = new Swiper('#product-slider');
    const reviewSlider = new Swiper('#review-slider');
    expect(productSlider).toBeDefined();
    expect(reviewSlider).toBeDefined();
  });
    test('Swiper responsive behavior', () => {
        // Simulate different breakpoints (window resize) and verify slider behavior.  This is complex and requires window resize simulation.  It's a stub.
        // ...
    });
});

```