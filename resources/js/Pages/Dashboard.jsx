import React from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "../Layouts/AppLayout";

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 rounded-lg border border-stone-200 bg-white p-8 text-stone-500 shadow-sm">
                <div className="text-5xl opacity-50">⊞</div>
                <div className="text-base font-medium text-stone-600">
                    Dashboard
                </div>
                <div className="text-sm text-stone-400">
                    Data visualization and summary charts — coming in Sprint 8
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page) => (
    <AppLayout title="Dashboard" breadcrumb="Main → Dashboard">
        {page}
    </AppLayout>
);
