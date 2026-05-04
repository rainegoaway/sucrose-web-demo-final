import React from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "../../Layouts/AppLayout";

export default function BantayPresyo() {
    return (
        <div className="h-full">
            <Head title="Bantay Presyo" />

            <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 rounded-lg border border-stone-200 bg-white p-8 text-stone-500 shadow-sm">
                <div className="text-5xl opacity-50">📋</div>
                <div className="text-base font-medium text-stone-600">
                    Bantay Presyo
                </div>
                <div className="text-sm text-stone-400">
                    Price monitoring form submissions and validations
                </div>
            </div>
        </div>
    );
}

BantayPresyo.layout = (page) => (
    <AppLayout title="Bantay Presyo" breadcrumb="Reports → Bantay Presyo">
        {page}
    </AppLayout>
);
