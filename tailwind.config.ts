// tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  /** * THIẾT LẬP DARK MODE
   * Sử dụng 'class' để Tailwind áp dụng các biến thể 'dark:' 
   * khi thẻ <html> có class="dark". Đây là cách next-themes hoạt động.
   */
  darkMode: 'class', 
  
  /**
   * CONTENT
   * Khai báo các file mà Tailwind cần quét để tìm và tạo ra các class CSS.
   */
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  theme: {
    // Phần 'extend' cho phép bạn thêm/mở rộng các thuộc tính Tailwind mặc định
    extend: {
      // Bạn có thể tùy chỉnh font, màu sắc, breakpoints tại đây nếu cần
    },
  },
  
  // Bạn có thể thêm các plugin Tailwind khác tại đây (hiện tại để trống)
  plugins: [],
};

export default config;