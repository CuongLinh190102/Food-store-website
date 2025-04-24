import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

// Chỉ cần cleanup, không mock React nữa
afterEach(() => {
  cleanup();
});