'use client';

import { useEffect, useRef } from 'react';

type StyleCache = {
    overflow: string;
    paddingRight: string;
};

export const useScrollLock = (isLocked: boolean) => {
    const bodyStyles = useRef<StyleCache | null>(null);
    const htmlStyles = useRef<StyleCache | null>(null);

    useEffect(() => {
        // Đảm bảo chúng ta đang chạy ở môi trường browser
        if (typeof window === 'undefined') return;

        const body = document.body;
        const html = document.documentElement;
        
        // Chỉ lưu trữ styles gốc một lần khi lock
        if (isLocked && !bodyStyles.current) {
            const bodyComputedStyle = window.getComputedStyle(body);
            const htmlComputedStyle = window.getComputedStyle(html);
            
            bodyStyles.current = {
                overflow: bodyComputedStyle.overflow,
                paddingRight: bodyComputedStyle.paddingRight,
            };
            
            htmlStyles.current = {
                overflow: htmlComputedStyle.overflow,
                paddingRight: htmlComputedStyle.paddingRight,
            };

            // Tính toán chiều rộng thanh cuộn
            const scrollBarWidth = window.innerWidth - html.clientWidth;

            // Áp dụng khóa cuộn cho cả html và body
            html.style.overflow = 'hidden';
            body.style.overflow = 'hidden';

            if (scrollBarWidth > 0) {
                body.style.paddingRight = `${scrollBarWidth}px`;
                html.style.paddingRight = `${scrollBarWidth}px`;
            }
        } else if (!isLocked && bodyStyles.current) {
            // Khôi phục style gốc khi unlock
            body.style.overflow = bodyStyles.current.overflow;
            body.style.paddingRight = bodyStyles.current.paddingRight;
            
            html.style.overflow = htmlStyles.current!.overflow;
            html.style.paddingRight = htmlStyles.current!.paddingRight;

            // Reset các giá trị đã lưu
            bodyStyles.current = null;
            htmlStyles.current = null;
        }

        // Cleanup function
        return () => {
            if (bodyStyles.current) {
                body.style.overflow = bodyStyles.current.overflow;
                body.style.paddingRight = bodyStyles.current.paddingRight;
                html.style.overflow = htmlStyles.current!.overflow;
                html.style.paddingRight = htmlStyles.current!.paddingRight;
                
                bodyStyles.current = null;
                htmlStyles.current = null;
            }
        };
    }, [isLocked]);
};