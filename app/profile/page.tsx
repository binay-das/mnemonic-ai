"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardBody,
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
            await update({ 
                user: response.data 
            });
            
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
            <div className="flex justify-center items-center h-screen bg-black text-white">
                <Skeleton className="rounded-lg w-96 h-96">
                    <div className="h-24 rounded-lg bg-default-300"></div>
                </Skeleton>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center">
            <div className="w-full max-w-2xl">
                <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Your Profile
                </h1>

                <Card className="p-4 bg-zinc-900 border border-zinc-800">
                    <CardHeader className="flex gap-4 items-center">
                        <Avatar
                            showFallback
                            name={user?.name || "User"}
                            className="w-20 h-20 text-large"
                            src={`https://api.dicebear.com/9.x/micah/svg?seed=${user?.email}`}
                        />
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-semibold text-white">
                                {user?.name || "Anonymous User"}
                            </h2>
                            <p className="text-gray-400">{user?.email}</p>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div className="flex flex-col gap-4 mt-4">
                            <div className="flex justify-between items-center bg-zinc-800/50 p-4 rounded-lg">
                                <div>
                                    <p className="text-sm text-gray-400">Full Name</p>
                                    <p className="text-white font-medium">{user?.name || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center bg-zinc-800/50 p-4 rounded-lg">
                                <div>
                                    <p className="text-sm text-gray-400">Email Address</p>
                                    <p className="text-white font-medium">{user?.email}</p>
                                </div>
                            </div>

                            <div className="flex justify-end mt-4">
                                <Button color="primary" onPress={onOpen} className="font-semibold shadow-lg shadow-blue-500/30">
                                    Edit Profile
                                </Button>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                backdrop="blur"
                classNames={{
                    base: "bg-zinc-900 border border-zinc-800 text-white",
                    header: "border-b border-zinc-800",
                    footer: "border-t border-zinc-800",
                    closeButton: "hover:bg-white/5 active:bg-white/10",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Edit Profile
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col gap-4 py-4">
                                    <Input
                                        label="Name"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        variant="bordered"
                                        classNames={{
                                            inputWrapper: "bg-zinc-900 border-zinc-700 hover:border-zinc-500 focus-within:!border-blue-500",
                                            label: "text-zinc-400",
                                            input: "text-white"
                                        }}
                                    />
                                    <Input
                                        label="Email"
                                        value={editEmail}
                                        onChange={(e) => setEditEmail(e.target.value)}
                                        variant="bordered"
                                        classNames={{
                                            inputWrapper: "bg-zinc-900 border-zinc-700 hover:border-zinc-500 focus-within:!border-blue-500",
                                            label: "text-zinc-400",
                                            input: "text-white"
                                        }}
                                    />
                                    {error && (
                                        <p className="text-red-500 text-sm mt-2">{error}</p>
                                    )}
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={() => handleUpdate(onClose)}
                                    isLoading={saving}
                                    className="shadow-lg shadow-blue-500/20"
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
