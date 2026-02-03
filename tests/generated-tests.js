// Tests for index.html
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import App from './App'; // Assuming your main component is App.js

jest.mock('./api', () => ({
  getProducts: () => Promise.resolve([{ id: 1, title: 'Product 1' }]),
  getDeals: () => Promise.resolve([{ id: 1, countdown: 10000 }]),
}));

describe('Header', () => {
  test('Menu opens and closes', () => {
    render(<App />);
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);
    expect(screen.getByRole('menu')).toBeVisible();
    fireEvent.click(menuButton);
    expect(screen.queryByRole('menu')).not.toBeVisible();
  });

  test('Theme toggle changes theme', () => {
    render(<App />);
    const themeToggle = screen.getByRole('checkbox', { name: /theme/i });
    fireEvent.click(themeToggle);
    // Add assertions to check for theme change (e.g., class change)
    expect(document.body).toHaveClass('dark-theme'); //Example assertion, adapt as needed
  });
});


describe('Navigation', () => {
  test('Links navigate correctly', () => {
    render(<App />);
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      fireEvent.click(link);
      // Assertions to check navigation, may require mocking history or Router
      // Example: expect(window.location.href).toContain('/about');
    });
  });
});


describe('Product Slider', () => {
  test('Slider responds to resize', () => {
    render(<App />);
    const slider = screen.getByRole('slider'); // Adjust selector as needed.
    // Simulate resize event (requires more sophisticated testing library setup)
    // Example: userEvent.resize(slider, { width: 200 });
    // Assertions to check responsiveness, potentially checking slide count or visibility
  });
});


describe('Deal Countdown', () => {
  test('Countdown timer works', async () => {
    jest.useFakeTimers();
    render(<App />);
    const timerElement = await screen.findByText(/countdown/i); //Adapt selector
    expect(timerElement).toBeInTheDocument();
    //act(() => jest.advanceTimersByTime(1000));  //Advance timer for testing
    // Add assertions to check timer decrement, requires mocking or specific implementation details
  });
    test('Countdown timer handles zero', async () => {
    jest.useFakeTimers();
    render(<App />);
      // Mock a deal with a countdown of 0
      jest.spyOn(global, 'setTimeout'); 
      // Add assertions to check for "Deal Ended" message or similar
  });
});


describe('Image Galleries', () => {
  test('Gallery images are displayed', () => {
    render(<App />);
    const images = screen.getAllByRole('img', { name: /featured/i }); // Adapt selector
    expect(images.length).toBeGreaterThan(0); //Adjust as per expected number of images
  });
  test('Gallery navigation works', () => {
    render(<App />);
    //Add assertions for gallery navigation (next/previous buttons or similar)
    //Requires interaction with the gallery's implementation
  });
});


```

// Tests for script.test.js
```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from './Navbar';
import ThemeToggler from './ThemeToggler';
import ImageGallery from './ImageGallery';
import CountdownTimer from './CountdownTimer';
import SwiperSlider from './SwiperSlider'; // Assuming a single component for both sliders

jest.useFakeTimers();

describe('Navbar', () => {
  test('toggles active class on menu click', () => {
    render(<Navbar />);
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);
    expect(screen.getByTestId('navbar')).toHaveClass('active');
  });
  test('removes active class on close', () => {
    render(<Navbar />);
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(screen.getByTestId('navbar')).not.toHaveClass('active');
  });
  test('removes active class on scroll', () => {
    render(<Navbar />);
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);
    window.dispatchEvent(new Event('scroll'));
    expect(screen.getByTestId('navbar')).not.toHaveClass('active');

  });
});


describe('ThemeToggler', () => {
  test('toggles theme', () => {
    render(<ThemeToggler />);
    const toggler = screen.getByRole('button', { name: /theme/i });
    fireEvent.click(toggler);
    expect(toggler).toHaveClass('fa-sun');
    expect(document.body).toHaveClass('active');
    fireEvent.click(toggler);
    expect(toggler).not.toHaveClass('fa-sun');
    expect(document.body).not.toHaveClass('active');
  });
});

describe('ImageGallery', () => {
  test('updates big image on small image click', () => {
    render(<ImageGallery />);
    const smallImages = screen.getAllByRole('img', { name: /small/i });
    fireEvent.click(smallImages[0]);
    expect(screen.getByRole('img', { name: /big/i })).toHaveAttribute('src', '/path/to/image1.jpg'); //Replace with actual paths
    fireEvent.click(smallImages[1]);
    expect(screen.getByRole('img', { name: /big/i })).toHaveAttribute('src', '/path/to/image2.jpg'); //Replace with actual paths
  });
});

describe('CountdownTimer', () => {
  test('updates every second', () => {
    render(<CountdownTimer initialTime={10} />);
    expect(screen.getByText(/10/i)).toBeInTheDocument();
    jest.advanceTimersByTime(1000);
    expect(screen.getByText(/9/i)).toBeInTheDocument();
    jest.runAllTimers();
  });
  test('handles zero time', () => {
    render(<CountdownTimer initialTime={0} />);
    expect(screen.getByText(/0/i)).toBeInTheDocument();

  });
});


describe('SwiperSlider', () => {
  test('slides', () => {
    render(<SwiperSlider />);
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    // Add assertions to check slide change.  Implementation specific.
  });
  test('responsive', () => {
    // Test different screen sizes using @media queries.  Implementation specific.
    //This test requires mocking window.innerWidth
  });
});

```