import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import App from '../App';
import store from '../app/store/store';

const renderWithProviders = (ui: React.ReactNode) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
};
describe('App Component', () => {
  test('renders layout header', () => {
    renderWithProviders(<App />);
    expect(screen.getByText(/App Header/i)).toBeInTheDocument();
  });

  test('renders sign-in button on home', () => {
    renderWithProviders(<App />);
    expect(screen.getByRole('button', { name: /Sign in with Microsoft/i })).toBeInTheDocument();
  });
});
