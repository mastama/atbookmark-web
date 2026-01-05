"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";

function VerifyContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            setStatus("error");
            return;
        }

        const verify = async () => {
            try {
                await api.post("/auth/verify-email", { token });
                setStatus("success");
                toast.success("Email verified successfully! 🎉");
            } catch (error) {
                setStatus("error");
            }
        };

        verify();
    }, [searchParams]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
            {status === "loading" && (
                <div className="space-y-4">
                    <div className="animate-spin text-4xl">⏳</div>
                    <h1 className="text-2xl font-bold">Verifying your email...</h1>
                </div>
            )}

            {status === "success" && (
                <div className="space-y-6 max-w-md">
                    <div className="text-6xl">🎉</div>
                    <h1 className="text-2xl font-bold text-green-500">Email Verified!</h1>
                    <p className="text-muted-foreground">
                        Your account is now fully active. You can close this page or continue to your dashboard.
                    </p>
                    <Button onClick={() => router.push("/dashboard")} className="w-full">
                        Go to Dashboard
                    </Button>
                </div>
            )}

            {status === "error" && (
                <div className="space-y-6 max-w-md">
                    <div className="text-6xl">⚠️</div>
                    <h1 className="text-2xl font-bold text-red-500">Verification Failed</h1>
                    <p className="text-muted-foreground">
                        The verification link may be invalid or expired. Please try requesting a new one.
                    </p>
                    <Button onClick={() => router.push("/login")} variant="outline" className="w-full">
                        Back to Login
                    </Button>
                </div>
            )}
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyContent />
        </Suspense>
    );
}
