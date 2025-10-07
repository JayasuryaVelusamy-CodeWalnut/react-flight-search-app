import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PassengerSelector from '../../components/PassengerSelector';
import type { Passenger } from '../../types/Flight';

describe('PassengerSelector', () => {
  const defaultPassengers: Passenger = {
    adults: 1,
    children: 0,
    infants: 0
  };

  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with initial values', () => {
    render(<PassengerSelector value={defaultPassengers} onChange={mockOnChange} />);

    expect(screen.getByText('Adults')).toBeInTheDocument();
    expect(screen.getByText('Children')).toBeInTheDocument();
    expect(screen.getByText('Infants')).toBeInTheDocument();
    expect(screen.getByText('Age 12+')).toBeInTheDocument();
    expect(screen.getByText('Age 2-11')).toBeInTheDocument();
    expect(screen.getByText('Under 2')).toBeInTheDocument();
  });

  it('increments adult count when + button is clicked', async () => {
    const user = userEvent.setup();
    render(<PassengerSelector value={defaultPassengers} onChange={mockOnChange} />);

    const adultSection = screen.getByText('Adults').closest('div')?.parentElement;
    const incrementButton = adultSection?.querySelectorAll('button')[1];
    
    if (incrementButton) {
      await user.click(incrementButton);
    }

    expect(mockOnChange).toHaveBeenCalledWith({
      adults: 2,
      children: 0,
      infants: 0
    });
  });

  it('decrements adult count when - button is clicked', async () => {
    const user = userEvent.setup();
    const passengers: Passenger = { adults: 2, children: 0, infants: 0 };
    render(<PassengerSelector value={passengers} onChange={mockOnChange} />);

    const adultSection = screen.getByText('Adults').closest('div')?.parentElement;
    const decrementButton = adultSection?.querySelectorAll('button')[0];
    
    if (decrementButton) {
      await user.click(decrementButton);
    }

    expect(mockOnChange).toHaveBeenCalledWith({
      adults: 1,
      children: 0,
      infants: 0
    });
  });

  it('does not allow adults to go below 1', async () => {
    render(<PassengerSelector value={defaultPassengers} onChange={mockOnChange} />);

    const adultSection = screen.getByText('Adults').closest('div')?.parentElement;
    const decrementButton = adultSection?.querySelectorAll('button')[0];
    
    expect(decrementButton).toBeDisabled();
  });

  it('increments children count', async () => {
    const user = userEvent.setup();
    render(<PassengerSelector value={defaultPassengers} onChange={mockOnChange} />);

    const childrenSection = screen.getByText('Children').closest('div')?.parentElement;
    const incrementButton = childrenSection?.querySelectorAll('button')[1];
    
    if (incrementButton) {
      await user.click(incrementButton);
    }

    expect(mockOnChange).toHaveBeenCalledWith({
      adults: 1,
      children: 1,
      infants: 0
    });
  });

  it('decrements children count', async () => {
    const user = userEvent.setup();
    const passengers: Passenger = { adults: 1, children: 2, infants: 0 };
    render(<PassengerSelector value={passengers} onChange={mockOnChange} />);

    const childrenSection = screen.getByText('Children').closest('div')?.parentElement;
    const decrementButton = childrenSection?.querySelectorAll('button')[0];
    
    if (decrementButton) {
      await user.click(decrementButton);
    }

    expect(mockOnChange).toHaveBeenCalledWith({
      adults: 1,
      children: 1,
      infants: 0
    });
  });

  it('does not allow children to go below 0', async () => {
    render(<PassengerSelector value={defaultPassengers} onChange={mockOnChange} />);

    const childrenSection = screen.getByText('Children').closest('div')?.parentElement;
    const decrementButton = childrenSection?.querySelectorAll('button')[0];
    
    expect(decrementButton).toBeDisabled();
  });

  it('increments infants count', async () => {
    const user = userEvent.setup();
    render(<PassengerSelector value={defaultPassengers} onChange={mockOnChange} />);

    const infantsSection = screen.getByText('Infants').closest('div')?.parentElement;
    const incrementButton = infantsSection?.querySelectorAll('button')[1];
    
    if (incrementButton) {
      await user.click(incrementButton);
    }

    expect(mockOnChange).toHaveBeenCalledWith({
      adults: 1,
      children: 0,
      infants: 1
    });
  });

  it('displays correct counts for multiple passenger types', () => {
    const passengers: Passenger = { adults: 2, children: 1, infants: 1 };
    render(<PassengerSelector value={passengers} onChange={mockOnChange} />);

    const adultSection = screen.getByText('Adults').closest('div')?.parentElement;
    const childrenSection = screen.getByText('Children').closest('div')?.parentElement;
    const infantsSection = screen.getByText('Infants').closest('div')?.parentElement;

    expect(adultSection?.textContent).toContain('2');
    expect(childrenSection?.textContent).toContain('1');
    expect(infantsSection?.textContent).toContain('1');
  });
});
