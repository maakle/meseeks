import ChatInterface from '@/features/chat/components/chat-interface';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Chat with AI',
    description: 'Chat with ChatGPT powered by OpenAI',
};

export default function ChatPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Chat with AI</h2>
            </div>
            <ChatInterface />
        </div>
    );
} 