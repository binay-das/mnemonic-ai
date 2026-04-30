import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

const MIN_PASSWORD_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SignupPayload = {
    email?: unknown;
    name?: unknown;
    password?: unknown;
};

function isUniqueConstraintError(error: unknown) {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002"
    );
}

function validateSignupPayload(body: SignupPayload) {
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !name || !password) {
        return { error: "Name, email, and password are required" };
    }

    if (!EMAIL_PATTERN.test(email)) {
        return { error: "Enter a valid email address" };
    }

    if (name.length < 2 || name.length > 80) {
        return { error: "Name must be between 2 and 80 characters" };
    }

    if (
        password.length < MIN_PASSWORD_LENGTH ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/[0-9]/.test(password)
    ) {
        return {
            error: "Password must be at least 8 characters and include uppercase, lowercase, and number",
        };
    }

    return { email, name, password };
}

export async function POST(
    request: Request
) {
    try {
        const body = await request.json() as SignupPayload;
        const validation = validateSignupPayload(body);

        if ("error" in validation) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email: validation.email,
            },
            select: {
                id: true,
            },
        });

        if (existingUser) {
            return NextResponse.json({ error: "Email is already in use" }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(validation.password, 12);

        const user = await prisma.user.create({
            data: {
                email: validation.email,
                name: validation.name,
                password: hashedPassword
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            }
        });

        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        if (isUniqueConstraintError(error)) {
            return NextResponse.json({ error: "Email is already in use" }, { status: 409 });
        }

        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
