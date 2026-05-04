import React from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "../../Layouts/AppLayout";

export default function WeeklyReports() {
    return (
        <div className="h-full">
            <Head title="Weekly Reports" />

            <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 rounded-lg border border-stone-200 bg-white p-8 text-stone-500 shadow-sm">
                <div className="text-5xl opacity-50">📅</div>
                <div className="text-base font-medium text-stone-600">
                    Weekly Reports
                </div>
                <div className="text-sm text-stone-400">
                    Generated PDF reports — Sprint 7
                </div>
            </div>
        </div>
    );
}

WeeklyReports.layout = (page) => (
    <AppLayout title="Weekly Reports" breadcrumb="Reports → Weekly Reports">
        {page}
    </AppLayout>
);
