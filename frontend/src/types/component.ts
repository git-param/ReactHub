// export interface Component {
//   id: string
//   slug: string
//   name: string
//   description: string
//   category: string
//   framework: string[]
//   votes: string[]
//   comments: {
//     id: string
//     userId: string
//     username: string
//     text: string
//     createdAt: number
//   }[]
//   author: {
//     name: string
//     avatar: string
//   }
//   previewImage: string
//   componentPath: string
//   installCmd: string
//   css: string
// }

export interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
    role?: 'admin' | 'user';
    avatar?: string;
}

export interface ComponentMeta {
    id: string;
    slug?: string;
    title?: string;
    name?: string;
    category: string;
    description: string;
    framework?: string[];
    votes?: string[];
    comments?: {
        id: string;
        userId: string;
        username: string;
        text: string;
        createdAt: number;
    }[];
    author?: {
        name: string;
        avatar: string;
    };
    previewImage?: string;
    componentPath?: string;
    installCmd?: string | {
        pnpm?: string;
        npm?: string;
        yarn?: string;
        bun?: string;
    };
    componentCode?: string;
    cssCode?: string;
    usageCode?: string;
    userId?: string;
    createdAt?: string;
    status?: 'published' | 'pending';
}

// Migration alias — so all existing `import { Component }` lines still work
export type Component = ComponentMeta;

export interface ComponentRequest {
    request_id: string;
    category: string;
    component_name: string;
    description: string;
    username: string;
    createdAt: string;
    status: 'pending' | 'approved' | 'rejected';
}

export interface ActivityLog {
    id: string;
    userId: string;
    action: string;
    details: string;
    timestamp: string;
}

export interface Comment {
    id: string;
    componentId: string;
    userId: string;
    text: string;
    createdAt: string;
}

export interface Like {
    id: string;
    componentId: string;
    userId: string;
}

export interface Tag {
    id: string;
    name: string;
}

export interface ComponentTag {
    id: string;
    componentId: string;
    tagId: string;
}
