import React from "react";
import { Head, usePage } from "@inertiajs/react";
import AppLayout from "../Layouts/AppLayout";

export default function Profile() {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <div className="h-full">
            <Head title="My Profile" />

            <div className="rounded-lg border border-stone-200 bg-white shadow-sm">
                <div className="border-b border-stone-200 px-5 py-4">
                    <div className="text-sm font-semibold">My Profile</div>
                    <div className="text-xs text-stone-400">
                        Profile detail view and account settings
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
                    <div>
                        <div className="text-[11px] font-medium uppercase tracking-widest text-stone-400">
                            Full Name
                        </div>
                        <div className="mt-1 text-sm text-stone-900">
                            {user
                                ? `${user.first_name} ${user.last_name}`
                                : "—"}
                        </div>
                    </div>
                    <div>
                        <div className="text-[11px] font-medium uppercase tracking-widest text-stone-400">
                            Email
                        </div>
                        <div className="mt-1 text-sm text-stone-900">
                            {user?.email || "—"}
                        </div>
                    </div>
                    <div>
                        <div className="text-[11px] font-medium uppercase tracking-widest text-stone-400">
                            Role
                        </div>
                        <div className="mt-1 text-sm text-stone-900">
                            {user?.role || "—"}
                        </div>
                    </div>
                    <div>
                        <div className="text-[11px] font-medium uppercase tracking-widest text-stone-400">
                            Status
                        </div>
                        <div className="mt-1 text-sm text-stone-900">
                            {user?.is_active ? "Active" : "Inactive"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

Profile.layout = (page) => (
    <AppLayout title="My Profile" breadcrumb="Profile">
        {page}
    </AppLayout>
);
