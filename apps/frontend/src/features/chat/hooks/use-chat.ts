import { Message } from '@/types/chat';
import { useAuth } from '@clerk/nextjs';
import { useCallback, useState } from 'react';

export const useChat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { getToken } = useAuth();

    const loadChatHistory = useCallback(async () => {
        try {
            const token = await getToken();
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

            const response = await fetch(`${apiUrl}/v1/agent/chat/messages`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            } else {
                console.error('Failed to load chat history:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    }, [getToken]);

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content,
            role: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const token = await getToken();
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

            const response = await fetch(`${apiUrl}/v1/agent/chat/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ message: content }),
            });

            if (response.ok) {
                const data = await response.json();
                const aiMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    content: data.message,
                    role: 'assistant',
                    timestamp: new Date(data.timestamp),
                };
                setMessages(prev => [...prev, aiMessage]);
            } else {
                throw new Error(`Failed to send message: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            // Add error message
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: 'Sorry, I encountered an error. Please try again.',
                role: 'assistant',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, getToken]);

    return {
        messages,
        isLoading,
        loadChatHistory,
        sendMessage,
    };
}; 