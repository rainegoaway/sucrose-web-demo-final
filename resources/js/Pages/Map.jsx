import React from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "../Layouts/AppLayout";

export default function Map() {
    return (
        <div className="h-full">
            <Head title="City Map" />

            <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 rounded-lg border border-stone-200 bg-white p-8 text-stone-500 shadow-sm">
                <div className="text-5xl opacity-50">🗺</div>
                <div className="text-base font-medium text-stone-600">
                    City Map
                </div>
                <div className="text-sm text-stone-400">
                    Interactive Google Maps view with market status pins —
                    Sprint 3
                </div>
            </div>
        </div>
    );
}

Map.layout = (page) => (
    <AppLayout title="City Map" breadcrumb="Main → City Map">
        {page}
    </AppLayout>
);
