import { ReactNode } from "react";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export default async function AuthLayout({
    children,
}: {
    children: ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (session) {
        redirect("/bookmarks");
    }

    return <>{children}</>;
}
