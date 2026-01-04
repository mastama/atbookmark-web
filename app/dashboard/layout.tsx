import { AppShell } from "@/components/layout/AppShell";
import { CommandMenu } from "@/components/dashboard/CommandMenu";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AutoArchiveProvider } from "@/components/providers/AutoArchiveProvider";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider>
            <AutoArchiveProvider>
                <AppShell>
                    {children}
                    <CommandMenu />
                </AppShell>
            </AutoArchiveProvider>
        </ThemeProvider>
    );
}