import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import DebouncedInput from './DebouncedInput';

describe('DebouncedInput', () => {
  it('renders with initial value', () => {
    render(
      <DebouncedInput
        value="initial"
        onChange={vi.fn()}
        placeholder="Search"
      />
    );

    const input = screen.getByPlaceholderText('Search') as HTMLInputElement;
    expect(input.value).toBe('initial');
  });

  it('debounces onChange callback', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<DebouncedInput value="" onChange={onChange} debounce={100} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'test');

    expect(onChange).not.toHaveBeenCalled();

    await waitFor(() => expect(onChange).toHaveBeenCalledWith('test'), { timeout: 200 });
  });

  it('trims input value', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<DebouncedInput value="" onChange={onChange} debounce={100} />);

    const input = screen.getByRole('textbox');
    await user.type(input, '  spaces  ');

    await waitFor(() => expect(onChange).toHaveBeenCalledWith('spaces'), { timeout: 200 });
  });

  it('updates when initialValue prop changes', () => {
    const { rerender } = render(
      <DebouncedInput value="initial" onChange={vi.fn()} />
    );

    let input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('initial');

    rerender(<DebouncedInput value="updated" onChange={vi.fn()} />);

    input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('updated');
  });

  it('uses custom debounce time', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<DebouncedInput value="" onChange={onChange} debounce={200} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'test');

    // Should not be called before debounce
    expect(onChange).not.toHaveBeenCalled();

    await waitFor(() => expect(onChange).toHaveBeenCalledWith('test'), { timeout: 300 });
  });

  it('only calls onChange once after multiple rapid inputs', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<DebouncedInput value="" onChange={onChange} debounce={100} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'abc');

    await waitFor(() => expect(onChange).toHaveBeenCalledOnce(), { timeout: 200 });
    expect(onChange).toHaveBeenCalledWith('abc');
  });
});