'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useChat, useChatInput, useChatScroll } from '../hooks';

export default function ChatInterface() {
    const { user } = useUser();
    const { messages, isLoading, loadChatHistory, sendMessage } = useChat();
    const { input, handleSendMessage, handleKeyPress, handleInputChange } = useChatInput(sendMessage, isLoading);
    const scrollAreaRef = useChatScroll(messages);

    useEffect(() => {
        // Load chat history
        loadChatHistory();
    }, [loadChatHistory]);

    return (
        <div className="flex flex-col h-[calc(100vh-200px)] max-w-4xl mx-auto">
            <Card className="flex-1">
                <CardContent className="p-0 h-full">
                    <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                        <div className="space-y-4">
                            {messages.length === 0 && (
                                <div className="text-center text-muted-foreground py-8">
                                    <Icons.chat className="mx-auto h-12 w-12 mb-4 opacity-50" />
                                    <p>Start a conversation with AI</p>
                                </div>
                            )}

                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                                        }`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-lg px-4 py-2 ${message.role === 'user'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted'
                                            }`}
                                    >
                                        <p className="text-sm">{message.content}</p>
                                        <p className="text-xs opacity-70 mt-1">
                                            {new Date(message.timestamp).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-muted rounded-lg px-4 py-2">
                                        <div className="flex items-center space-x-2">
                                            <Icons.spinner className="h-4 w-4 animate-spin" />
                                            <span className="text-sm">AI is thinking...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            <div className="flex space-x-2 mt-4">
                <Input
                    value={input}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
                    {isLoading ? (
                        <Icons.spinner className="h-4 w-4 animate-spin" />
                    ) : (
                        <Icons.arrowRight className="h-4 w-4" />
                    )}
                </Button>
            </div>
        </div>
    );
} 