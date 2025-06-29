import { useCallback, useState } from 'react';

export const useChatInput = (onSendMessage: (message: string) => void, isLoading: boolean) => {
    const [input, setInput] = useState('');

    const handleSendMessage = useCallback(() => {
        if (!input.trim() || isLoading) return;

        onSendMessage(input);
        setInput('');
    }, [input, isLoading, onSendMessage]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }, [handleSendMessage]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    }, []);

    return {
        input,
        handleSendMessage,
        handleKeyPress,
        handleInputChange,
    };
}; 