import { AppShell } from "@/components/layout/AppShell";
import { CommandMenu } from "@/components/dashboard/CommandMenu";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AppShell>
            {children}
            <CommandMenu />
        </AppShell>
    );
}