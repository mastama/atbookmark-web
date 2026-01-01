import { AppShell } from "@/components/layout/AppShell";
import { CommandMenu } from "@/components/dashboard/CommandMenu";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider>
            <AppShell>
                {children}
                <CommandMenu />
            </AppShell>
        </ThemeProvider>
    );
}