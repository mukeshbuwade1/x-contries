import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

const mockCountry = { common: 'Testland', png: 'https://example.com/flag.png' };

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: async () => [mockCountry],
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders search input and country cards from API', async () => {
  render(<App />);

  expect(
    screen.getByPlaceholderText(/search for countries/i)
  ).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledWith(
    'https://countries-search-data-prod-812920491762.asia-south1.run.app/countries'
  );

  await waitFor(() => {
    expect(screen.getByText('Testland')).toBeInTheDocument();
  });
});

test('country cards use the countryCard class', async () => {
  const { container } = render(<App />);
  await waitFor(() => {
    expect(container.querySelector('.countryCard')).toBeInTheDocument();
  });
});
