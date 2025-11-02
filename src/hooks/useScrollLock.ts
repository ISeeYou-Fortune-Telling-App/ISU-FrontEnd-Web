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
        if (typeof window === 'undefined') return;

        const body = document.body;
        const html = document.documentElement;
        
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

            const scrollBarWidth = window.innerWidth - html.clientWidth;

            html.style.overflow = 'hidden';
            body.style.overflow = 'hidden';

            if (scrollBarWidth > 0) {
                body.style.paddingRight = `${scrollBarWidth}px`;
                html.style.paddingRight = `${scrollBarWidth}px`;
            }
        } else if (!isLocked && bodyStyles.current) {
            body.style.overflow = bodyStyles.current.overflow;
            body.style.paddingRight = bodyStyles.current.paddingRight;
            
            html.style.overflow = htmlStyles.current!.overflow;
            html.style.paddingRight = htmlStyles.current!.paddingRight;

            bodyStyles.current = null;
            htmlStyles.current = null;
        }

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