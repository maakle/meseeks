// User model
export interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Organization model
export interface Organization {
    id: string;
    name: string;
    slug: string;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Organization membership model
export interface OrganizationMembership {
    id: string;
    userId: string;
    organizationId: string;
    role: OrganizationRole;
    createdAt: Date;
    updatedAt: Date;
}

// Organization roles
export enum OrganizationRole {
    OWNER = 'OWNER',
    ADMIN = 'ADMIN',
    MEMBER = 'MEMBER',
}

// Product model
export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    organizationId: string;
    createdAt: Date;
    updatedAt: Date;
}

// Message model
export interface Message {
    id: string;
    content: string;
    role: MessageRole;
    conversationId: string;
    createdAt: Date;
    updatedAt: Date;
}

// Message roles
export enum MessageRole {
    USER = 'USER',
    ASSISTANT = 'ASSISTANT',
    SYSTEM = 'SYSTEM',
}

// Conversation model
export interface Conversation {
    id: string;
    title: string;
    organizationId: string;
    createdAt: Date;
    updatedAt: Date;
} 