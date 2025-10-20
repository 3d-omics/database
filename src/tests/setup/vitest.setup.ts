import '@testing-library/jest-dom'; // adds custom matchers like toBeInTheDocument()

import { vi } from 'vitest'

// Mock URL methods before any modules are loaded
Object.defineProperty(global.URL, 'createObjectURL', {
  writable: true,
  value: vi.fn(() => 'blob:mock-url'),
})

Object.defineProperty(global.URL, 'revokeObjectURL', {
  writable: true,
  value: vi.fn(),
})

// Mock Blob constructor
global.Blob = vi.fn().mockImplementation((content, options) => ({
  content,
  type: options?.type || 'application/octet-stream',
  size: Array.isArray(content) ? content.reduce((acc, chunk) => acc + chunk.length, 0) : 0
}))

// If you're using canvas or other browser APIs that Plotly might need
global.HTMLCanvasElement.prototype.getContext = vi.fn()
global.HTMLCanvasElement.prototype.toDataURL = vi.fn(() => 'data:image/png;base64,mock')

// Mock ResizeObserver if needed
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))