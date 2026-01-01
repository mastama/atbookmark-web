"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Puzzle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export function InstallExtensionButton() {
    const router = useRouter();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = () => {
        setIsLoading(true);

        if (user) {
            // User is logged in → go directly to extension page
            router.push("/dashboard/extension");
        } else {
            // User is guest → redirect to login with returnUrl
            router.push("/login?returnUrl=/dashboard/extension");
        }
    };

    return (
        <Button
            size="lg"
            onClick={handleClick}
            disabled={isLoading}
            className="bg-foreground text-surface hover:bg-foreground/90"
        >
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Loading...
                </>
            ) : (
                <>
                    <Puzzle className="mr-2 h-5 w-5" />
                    Get Browser Extension
                </>
            )}
        </Button>
    );
}
