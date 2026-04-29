import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                name: true,
                email: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, email } = body;

        if (!name || !email) {
            return NextResponse.json(
                { error: "Name and email are required" },
                { status: 400 }
            );
        }

        const userId = session.user.id;

        const existingUser = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (existingUser && existingUser.id !== userId) {
            return NextResponse.json(
                { error: "Email is already in use" },
                { status: 409 }
            );
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                name,
                email,
            },
            select: {
                name: true,
                email: true,
            },
        });

        return NextResponse.json(updatedUser);
    } catch {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
