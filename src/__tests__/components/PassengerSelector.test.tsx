import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PassengerSelector from '../../components/PassengerSelector';
import type { PassengerSelectorProps } from '../../components/PassengerSelector';
import type { Passenger } from '../../types/Flight';

describe('PassengerSelector', () => {
  const mockOnChange = jest.fn();

  const defaultPassengers: Passenger = {
    adults: 1,
    children: 0,
    infants: 0,
  };

  const renderComponent = (
    additionalProps: Partial<PassengerSelectorProps> = {}
  ) => {
    const props: PassengerSelectorProps = {
      passengers: defaultPassengers,
      onChange: mockOnChange,
      ...additionalProps,
    };
    return render(<PassengerSelector {...props} />);
  };

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders all passenger types with labels and descriptions', () => {
    renderComponent();

    expect(screen.getByRole('heading', { name: 'Adults' })).toBeInTheDocument();
    expect(screen.getByText('Age 12+')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Children' })
    ).toBeInTheDocument();
    expect(screen.getByText('Age 2-11')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Infants' })
    ).toBeInTheDocument();
    expect(screen.getByText('Under 2')).toBeInTheDocument();
  });

  it.each([
    { type: 'Adults', id: 'adults' },
    { type: 'Children', id: 'children' },
    { type: 'Infants', id: 'infants' },
  ])('increments $type count when + button is clicked', async ({ type, id }) => {
    renderComponent();

    const incrementButton = screen.getByLabelText(`Increment ${type}`);
    await userEvent.click(incrementButton);

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        [id]: defaultPassengers[id as keyof Passenger] + 1,
      })
    );
  });

  it.each([
    { type: 'Adults', id: 'adults', initial: 2 },
    { type: 'Children', id: 'children', initial: 2 },
    { type: 'Infants', id: 'infants', initial: 2 },
  ])(
    'decrements $type count when - button is clicked and above min',
    async ({ type, initial, id }) => {
      renderComponent({ passengers: { ...defaultPassengers, [id]: initial } });

      const decrementButton = screen.getByLabelText(`Decrement ${type}`);
      await userEvent.click(decrementButton);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({ [id]: initial - 1 })
      );
    }
  );

  it.each([
    { type: 'Adults', id: 'adults', min: 1 },
    { type: 'Children', id: 'children', min: 0 },
    { type: 'Infants', id: 'infants', min: 0 },
  ])(
    'disables the - button for $type when at the minimum value',
    ({ type, id, min }) => {
      renderComponent({ passengers: { ...defaultPassengers, [id]: min } });

      const decrementButton = screen.getByLabelText(`Decrement ${type}`);
      expect(decrementButton).toBeDisabled();
    }
  );
});
