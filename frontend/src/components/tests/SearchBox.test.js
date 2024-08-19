import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBox from '../components/SearchBox';
import '@testing-library/jest-dom/extend-expect';


// this is a test case for simply adding url
test('adds valid URL to the list', () => {
    render(<SearchBox onFetchData={jest.fn()} />);
    
    const input = screen.getByPlaceholderText('Enter a URL');
    fireEvent.change(input, { target: { value: 'https://valid-url.com' } });
    
    const addButton = screen.getByText('Add to list');
    fireEvent.click(addButton);

    expect(screen.getByText('https://valid-url.com')).toBeInTheDocument();
});

// this one is for handling invalid url
test('shows error message for invalid URL', () => {
    render(<SearchBox onFetchData={jest.fn()} />);
    
    const input = screen.getByPlaceholderText('Enter a URL');
    fireEvent.change(input, { target: { value: 'invalid-url' } });
    
    const addButton = screen.getByText('Add to list');
    fireEvent.click(addButton);

    expect(window.alert).toHaveBeenCalledWith('invalid url');
});

// for displaying data, or more correct to say fetching data

test('displays fetched results after form submission', async () => {
    const mockData = [
        { title: 'Title 1', description: 'Description 1', image: 'https://image1.com' },
        { title: 'Title 2', description: 'Description 2', image: 'https://image2.com' },
    ];
    jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest.fn().mockResolvedValue({ data: mockData })
    });

    render(<SearchBox onFetchData={jest.fn()} />);
    
    const input = screen.getByPlaceholderText('Enter a URL');
    fireEvent.change(input, { target: { value: 'https://valid-url.com' } });
    fireEvent.click(screen.getByText('Add to list'));
    
    const fetchButton = screen.getByText('Fetch');
    fireEvent.click(fetchButton);

    expect(await screen.findByText('Title 1')).toBeInTheDocument();
    expect(await screen.findByText('Title 2')).toBeInTheDocument();

    global.fetch.mockRestore();
});