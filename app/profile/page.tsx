"use client";

import { useState, useEffect } from "react";
import {
    Card,
    Input,
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Avatar,
    Skeleton,
} from "@nextui-org/react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface UserProfile {
    name: string;
    email: string;
}

interface ApiErrorResponse {
    error: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const { update } = useSession();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [error, setError] = useState<string>("");
    const [saving, setSaving] = useState<boolean>(false);
    const [editName, setEditName] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [editEmail, setEditEmail] = useState<string>("");
    const [user, setUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get<UserProfile>("/api/user/profile");
            setUser(response.data);
            setEditName(response.data.name || "");
            setEditEmail(response.data.email || "");
        } catch (err) {
            console.error("Failed to fetch user", err);
            toast.error("Failed to load profile data");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (onClose: () => void) => {
        setSaving(true);
        setError("");
        try {
            const response = await axios.put<UserProfile>("/api/user/profile", {
                name: editName,
                email: editEmail,
            });
            setUser(response.data);
            await update({ user: response.data });

            toast.success("Profile updated successfully");
            onClose();
            router.refresh();
        } catch (err) {
            const axiosError = err as AxiosError<ApiErrorResponse>;
            if (axiosError.response?.data?.error) {
                setError(axiosError.response.data.error);
                toast.error(axiosError.response.data.error);
            } else {
                setError("Failed to update profile. Please try again.");
                toast.error("Failed to update profile");
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#fafaf9] dark:bg-[#0a0a0a]">
                <Skeleton className="rounded-none w-80 h-80">
                    <div className="h-24 bg-[#e7e7e7] dark:bg-[#2a2a2a]"></div>
                </Skeleton>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0a0a0a] p-6 sm:p-8 flex flex-col items-center">
            <div className="w-full max-w-2xl">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-6">
                    Your Profile
                </h1>

                <Card className="border border-[#e7e7e7] dark:border-[#2a2a2a] bg-[#ffffff] dark:bg-[#121212] rounded-none shadow-none">
                    <div className="p-6">
                        <div className="flex gap-4 items-center mb-6">
                            <Avatar
                                showFallback
                                name={user?.name || "User"}
                                className="w-16 h-16 text-base"
                                src={`https://api.dicebear.com/9.x/micah/svg?seed=${user?.email}`}
                            />
                            <div className="flex flex-col">
                                <h2 className="text-xl font-semibold text-foreground">
                                    {user?.name || "Anonymous User"}
                                </h2>
                                <p className="text-sm text-foreground/50">{user?.email}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center border border-[#e7e7e7] dark:border-[#2a2a2a] p-3 dark:bg-[#0a0a0a]">
                                <div>
                                    <p className="text-[11px] text-foreground/40 uppercase tracking-[0.1em]">Full Name</p>
                                    <p className="text-sm font-medium text-foreground mt-0.5">{user?.name || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center border border-[#e7e7e7] dark:border-[#2a2a2a] p-3 dark:bg-[#0a0a0a]">
                                <div>
                                    <p className="text-[11px] text-foreground/40 uppercase tracking-[0.1em]">Email Address</p>
                                    <p className="text-sm font-medium text-foreground mt-0.5">{user?.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mt-5">
                            <Button color="primary" radius="none" onPress={onOpen} className="font-medium text-sm h-9 px-4">
                                Edit Profile
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                backdrop="blur"
                classNames={{
                    base: "border border-[#e7e7e7] dark:border-[#2a2a2a] bg-[#ffffff] dark:bg-[#121212] text-foreground rounded-none",
                    closeButton: "hover:bg-[#f5f5f4] active:bg-[#e7e7e7] dark:hover:bg-[#1a1a1a] dark:active:bg-[#2a2a2a]",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="border-b border-[#e7e7e7] dark:border-[#2a2a2a]">
                                Edit Profile
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col gap-4 py-4">
                                    <Input
                                        label="Name"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        variant="bordered"
                                        radius="none"
                                        classNames={{
                                            inputWrapper: "border-[#e7e7e7] hover:border-foreground/20 focus-within:!border-[#0d7a6b] dark:border-[#2a2a2a] bg-transparent",
                                            label: "text-foreground/50 text-xs uppercase tracking-[0.1em]",
                                            input: "text-foreground text-sm",
                                        }}
                                    />
                                    <Input
                                        label="Email"
                                        value={editEmail}
                                        onChange={(e) => setEditEmail(e.target.value)}
                                        variant="bordered"
                                        radius="none"
                                        classNames={{
                                            inputWrapper: "border-[#e7e7e7] hover:border-foreground/20 focus-within:!border-[#0d7a6b] dark:border-[#2a2a2a] bg-transparent",
                                            label: "text-foreground/50 text-xs uppercase tracking-[0.1em]",
                                            input: "text-foreground text-sm",
                                        }}
                                    />
                                    {error && (
                                        <p className="text-red-500 text-sm">{error}</p>
                                    )}
                                </div>
                            </ModalBody>
                            <ModalFooter className="border-t border-[#e7e7e7] dark:border-[#2a2a2a]">
                                <Button color="danger" variant="light" radius="none" onPress={onClose} className="text-sm">
                                    Cancel
                                </Button>
                                <Button
                                    color="primary"
                                    radius="none"
                                    onPress={() => handleUpdate(onClose)}
                                    isLoading={saving}
                                    className="text-sm font-medium"
                                >
                                    Save Changes
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
