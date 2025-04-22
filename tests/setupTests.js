import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

// Dọn dẹp sau mỗi test
afterEach(() => {
  cleanup();
});