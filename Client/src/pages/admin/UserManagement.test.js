import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UserManagement from './UserManagement';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

describe('UserManagement', () => {
  test('renders User Management header', () => {
    render(
      <BrowserRouter>
        <UserManagement />
      </BrowserRouter>
    );
    
    expect(screen.getByText('User Management')).toBeInTheDocument();
  });

  test('renders Add New User button', () => {
    render(
      <BrowserRouter>
        <UserManagement />
      </BrowserRouter>
    );
    
    expect(screen.getByText('+ Add New User')).toBeInTheDocument();
  });

  test('renders user table with correct columns', () => {
    render(
      <BrowserRouter>
        <UserManagement />
      </BrowserRouter>
    );
    
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Last Active')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });
});