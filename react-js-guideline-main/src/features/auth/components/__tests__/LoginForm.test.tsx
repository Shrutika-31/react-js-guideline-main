import { render, screen } from '@testing-library/react';
import LoginForm from '../LoginForm';

test('renders login form inputs and button', () => {
  render(<LoginForm />);
  expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
  // password placeholder contains dots; assert the password input exists by type instead
  expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
});
