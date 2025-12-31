export interface Bookmark {
    id: string;
    title: string;
    url: string;
    domain: string;
    coverImage: string;
    tags: { label: string; color: string }[];
    savedAt: string;
    readingTime: string;
    isFavorite: boolean;
}

export const mockBookmarks: Bookmark[] = [
    {
        id: "1",
        title: "The Future of AI: What to Expect in 2025",
        url: "https://techcrunch.com/ai-2025",
        domain: "techcrunch.com",
        coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop",
        tags: [
            { label: "#AI", color: "bg-accent-lavender" },
            { label: "#Tech", color: "bg-accent-sky" },
        ],
        savedAt: "2 hours ago",
        readingTime: "5 min read",
        isFavorite: true,
    },
    {
        id: "2",
        title: "Building Scalable React Applications with Next.js 14",
        url: "https://vercel.com/blog/nextjs-14",
        domain: "vercel.com",
        coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
        tags: [
            { label: "#React", color: "bg-accent-mint" },
            { label: "#Dev", color: "bg-accent-sky" },
        ],
        savedAt: "Yesterday",
        readingTime: "8 min read",
        isFavorite: false,
    },
    {
        id: "3",
        title: "Mastering CSS Grid: A Complete Guide",
        url: "https://css-tricks.com/grid-guide",
        domain: "css-tricks.com",
        coverImage: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400&h=300&fit=crop",
        tags: [
            { label: "#CSS", color: "bg-accent-coral" },
            { label: "#Design", color: "bg-accent-lavender" },
        ],
        savedAt: "3 days ago",
        readingTime: "12 min read",
        isFavorite: true,
    },
    {
        id: "4",
        title: "How to Make the Perfect Sourdough Bread",
        url: "https://bonappetit.com/sourdough",
        domain: "bonappetit.com",
        coverImage: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
        tags: [
            { label: "#Cooking", color: "bg-accent-peach" },
            { label: "#Food", color: "bg-secondary" },
        ],
        savedAt: "Last week",
        readingTime: "6 min read",
        isFavorite: false,
    },
    {
        id: "5",
        title: "Understanding TypeScript Generics",
        url: "https://typescriptlang.org/docs",
        domain: "typescriptlang.org",
        coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop",
        tags: [
            { label: "#TypeScript", color: "bg-accent-sky" },
            { label: "#Dev", color: "bg-accent-mint" },
        ],
        savedAt: "Last week",
        readingTime: "10 min read",
        isFavorite: false,
    },
    {
        id: "6",
        title: "Personal Finance Tips for 2025",
        url: "https://nerdwallet.com/finance-tips",
        domain: "nerdwallet.com",
        coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
        tags: [
            { label: "#Finance", color: "bg-accent-lavender" },
            { label: "#Tips", color: "bg-accent-mint" },
        ],
        savedAt: "2 weeks ago",
        readingTime: "4 min read",
        isFavorite: true,
    },
    {
        id: "7",
        title: "The Art of Minimalist Design",
        url: "https://designnotes.co/minimalism",
        domain: "designnotes.co",
        coverImage: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=400&h=300&fit=crop",
        tags: [
            { label: "#Design", color: "bg-accent-coral" },
            { label: "#UI", color: "bg-accent-lavender" },
        ],
        savedAt: "2 weeks ago",
        readingTime: "7 min read",
        isFavorite: false,
    },
    {
        id: "8",
        title: "Meditation for Developers: Finding Focus",
        url: "https://medium.com/dev-meditation",
        domain: "medium.com",
        coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop",
        tags: [
            { label: "#Wellness", color: "bg-accent-mint" },
            { label: "#Productivity", color: "bg-secondary" },
        ],
        savedAt: "3 weeks ago",
        readingTime: "5 min read",
        isFavorite: false,
    },
];
