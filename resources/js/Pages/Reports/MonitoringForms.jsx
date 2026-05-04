import React from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "../../Layouts/AppLayout";

export default function MonitoringForms() {
    return (
        <div className="h-full">
            <Head title="Monitoring Forms" />

            <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 rounded-lg border border-stone-200 bg-white p-8 text-stone-500 shadow-sm">
                <div className="text-5xl opacity-50">📝</div>
                <div className="text-base font-medium text-stone-600">
                    Monitoring Forms
                </div>
                <div className="text-sm text-stone-400">
                    Field data collection forms — Sprint 4
                </div>
            </div>
        </div>
    );
}

MonitoringForms.layout = (page) => (
    <AppLayout title="Monitoring Forms" breadcrumb="Reports → Monitoring Forms">
        {page}
    </AppLayout>
);
