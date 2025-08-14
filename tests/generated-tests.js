// Tests for script.test.js
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Navbar, ThemeToggler, ImageGallery, countDown, SwiperSlider } from './script'; // Adjust path as needed

jest.useFakeTimers();

describe('Navbar', () => {
  test('Navbar toggles on menu-bar click', () => {
    render(<Navbar />);
    fireEvent.click(screen.getByRole('button', { name: /menu-bar/i }));
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });
  test('Navbar closes on close button click', () => {
    render(<Navbar />);
    fireEvent.click(screen.getByRole('button', { name: /menu-bar/i }));
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();

  });
  test('Navbar handles edge case: no close button initially', () => {
    render(<Navbar />);
    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
  });
});


describe('ThemeToggler', () => {
  test('Theme toggles on click', () => {
    render(<ThemeToggler />);
    const button = screen.getByRole('button', { name: /theme-toggler/i });
    fireEvent.click(button);
    // Add assertion to check for theme change.  This depends on your implementation.  Example:
    // expect(document.body.classList.contains('dark-theme')).toBe(true); 
  });
});

describe('ImageGallery', () => {
  test('Image updates on small image click', () => {
    render(<ImageGallery />);
    const smallImage = screen.getByTestId('small-image-1'); // Assumes you have testIds
    fireEvent.click(smallImage);
    // Add assertion to check for main image update. This depends on your implementation. Example:
    // expect(screen.getByRole('img', { name: /image-1/i })).toBeInTheDocument();
  });
  test('Handles edge case: no images', () => {
    render(<ImageGallery images={[]} />); // Pass empty array
    expect(screen.queryAllByRole('img').length).toBe(0);
  });

});


describe('countDown', () => {
  test('countDown timer counts down', () => {
    const endTime = new Date();
    endTime.setSeconds(endTime.getSeconds() + 5);
    const spy = jest.spyOn(global, 'setTimeout');
    countDown(endTime);
    expect(spy).toHaveBeenCalledTimes(1); // or more depending on your implementation
    jest.advanceTimersByTime(5000);
    expect(spy).toHaveBeenCalledTimes(5); //Example, adjust based on your interval
    
  });

});


describe('SwiperSlider', () => {
  test('Product slider initializes with correct options', () => {
    const options = { slidesPerView: 1 }; // Example options
    render(<SwiperSlider sliderId="product-slider" options={options} />);
    // Add assertion to check if options are applied.  This is highly implementation-dependent.  You might need to mock Swiper or access internal state.  Example using a mock:
    // expect(SwiperSlider.mock.calls[0][0]).toEqual(options)
  });

  test('Review slider initializes with correct options', () => {
    const options = { slidesPerView: 3 }; // Example options
    render(<SwiperSlider sliderId="review-slider" options={options} />);
    // Add assertion to check if options are applied.  This is highly implementation-dependent. Example using a mock:
    // expect(SwiperSlider.mock.calls[0][0]).toEqual(options)
  });

});

```