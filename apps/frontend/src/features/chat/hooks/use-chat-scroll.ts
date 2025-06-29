import { Message } from '@/types/chat';
import { useEffect, useRef } from 'react';

export const useChatScroll = (messages: Message[]) => {
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to bottom when new messages are added
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages]);

    return scrollAreaRef;
}; 