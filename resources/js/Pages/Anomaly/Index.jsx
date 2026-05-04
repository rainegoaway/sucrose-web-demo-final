import React, { useMemo, useState } from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "../../Layouts/AppLayout";

const PER_PAGE = 5;

export default function Index() {
    const [srpEnabled, setSrpEnabled] = useState(true);
    const [q, setQ] = useState("");
    const [time, setTime] = useState("");
    const [city, setCity] = useState("");
    const [page, setPage] = useState(1);

    const rows = useMemo(
        () => [
            {
                id: 1,
                city: "Pasig City",
                market: "Pasig Public Market",
                priceAnomaly: 5,
                marketAnomaly: 2,
                window: "Apr 7–Jun 23, 2025",
            },
            {
                id: 2,
                city: "Pasig City",
                market: "SM Hypermarket Pasig",
                priceAnomaly: 2,
                marketAnomaly: 1,
                window: "Apr 7–Jun 23, 2025",
            },
            {
                id: 3,
                city: "Quezon City",
                market: "Robinsons Galleria",
                priceAnomaly: 3,
                marketAnomaly: 1,
                window: "Apr 7–Jun 23, 2025",
            },
            {
                id: 4,
                city: "Makati City",
                market: "Landmark Makati",
                priceAnomaly: 4,
                marketAnomaly: 2,
                window: "Apr 7–Jun 23, 2025",
            },
            {
                id: 5,
                city: "Manila City",
                market: "Puregold Manila",
                priceAnomaly: 6,
                marketAnomaly: 2,
                window: "Apr 7–Jun 23, 2025",
            },
            {
                id: 6,
                city: "Quezon City",
                market: "QC Farmers Market",
                priceAnomaly: 1,
                marketAnomaly: 0,
                window: "Apr 7–Jun 23, 2025",
            },
            {
                id: 7,
                city: "Makati City",
                market: "Makati Central Market",
                priceAnomaly: 0,
                marketAnomaly: 1,
                window: "Apr 7–Jun 23, 2025",
            },
            {
                id: 8,
                city: "Manila City",
                market: "Divisoria Market",
                priceAnomaly: 2,
                marketAnomaly: 1,
                window: "Apr 7–Jun 23, 2025",
            },
        ],
        [],
    );

    const filtered = useMemo(() => {
        const qq = q.trim().toLowerCase();
        return rows.filter((r) => {
            if (
                qq &&
                !(
                    r.city.toLowerCase().includes(qq) ||
                    r.market.toLowerCase().includes(qq)
                )
            )
                return false;
            if (city && r.city !== city) return false;
            // `time` is demo-only, keep as UI filter without logic
            if (time) return true;
            return true;
        });
    }, [rows, q, city, time]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const safePage = Math.min(page, totalPages);
    const pageRows = filtered.slice(
        (safePage - 1) * PER_PAGE,
        safePage * PER_PAGE,
    );

    return (
        <div className="flex flex-col gap-4">
            <Head title="Anomaly" />

            <div className="rounded-lg border border-stone-200 bg-white shadow-sm">
                <div className="px-5 pt-4">
                    <div className="text-sm font-semibold">SRP Flagging</div>
                </div>
                <div className="p-5">
                    <div className="flex items-center justify-between rounded-md border border-stone-200 bg-stone-50 p-4">
                        <div>
                            <div className="text-sm font-medium">
                                Enable SRP Flagging
                            </div>
                            <div className="mt-1 text-xs text-stone-400">
                                Automatically flag prices that exceed the SRP
                                threshold
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSrpEnabled((v) => !v)}
                            className={`relative h-6 w-11 rounded-full transition-colors ${srpEnabled ? "bg-emerald-700" : "bg-stone-300"}`}
                            aria-label="Toggle SRP flagging"
                        >
                            <span
                                className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow transition-[left] ${
                                    srpEnabled ? "left-[22px]" : "left-[3px]"
                                }`}
                            />
                        </button>
                    </div>

                    {srpEnabled && (
                        <div className="mt-4">
                            <div className="mb-2 text-xs font-medium text-stone-600">
                                SRP Values &amp; Thresholds per Sugar Type
                            </div>
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                {[
                                    { label: "Raw Sugar (₱/kg)", value: 55 },
                                    { label: "Washed Sugar (₱/kg)", value: 58 },
                                    {
                                        label: "Refined Sugar (₱/kg)",
                                        value: 68,
                                    },
                                ].map((x) => (
                                    <div
                                        key={x.label}
                                        className="rounded-md border border-stone-200 bg-white p-3"
                                    >
                                        <div className="text-xs font-medium text-stone-600">
                                            {x.label}
                                        </div>
                                        <input
                                            className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                            type="number"
                                            step="0.5"
                                            defaultValue={x.value}
                                        />
                                        <div className="mt-2 text-[11px] text-stone-400">
                                            Threshold:{" "}
                                            <input
                                                className="ml-1 w-12 rounded border border-stone-300 px-1 py-[1px] text-[11px]"
                                                type="number"
                                                defaultValue={10}
                                            />
                                            %
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                className="mt-3 rounded-md bg-emerald-700 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-800"
                            >
                                Save SRP Settings
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="rounded-lg border border-stone-200 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 px-5 py-4">
                    <div className="flex flex-1 flex-wrap items-center gap-2">
                        <div className="relative w-full min-w-[180px] max-w-[320px]">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                                ⌕
                            </span>
                            <input
                                value={q}
                                onChange={(e) => {
                                    setPage(1);
                                    setQ(e.target.value);
                                }}
                                placeholder="Search city or market…"
                                className="w-full rounded-md border border-stone-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-600"
                            />
                        </div>

                        <select
                            value={time}
                            onChange={(e) => {
                                setPage(1);
                                setTime(e.target.value);
                            }}
                            className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-600 outline-none focus:border-emerald-600"
                        >
                            <option value="">All Time</option>
                            <option value="Last Week">Last Week</option>
                            <option value="Last Quarter">Last Quarter</option>
                            <option value="Crop Year">Crop Year</option>
                        </select>

                        <select
                            value={city}
                            onChange={(e) => {
                                setPage(1);
                                setCity(e.target.value);
                            }}
                            className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-600 outline-none focus:border-emerald-600"
                        >
                            <option value="">All Cities</option>
                            <option value="Pasig City">Pasig City</option>
                            <option value="Quezon City">Quezon City</option>
                            <option value="Makati City">Makati City</option>
                            <option value="Manila City">Manila City</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="rounded-md border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs text-stone-600">
                            <strong className="text-stone-900">
                                {rows.length}
                            </strong>{" "}
                            Total Anomalies
                        </div>
                        <div className="rounded-md border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs text-stone-600">
                            <strong className="text-stone-900">
                                {new Set(rows.map((r) => r.market)).size}
                            </strong>{" "}
                            Markets Flagged
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-stone-50">
                            <tr className="border-b border-stone-200">
                                {[
                                    "City",
                                    "Market Name",
                                    "Price Anomaly Count",
                                    "Market Anomaly Count",
                                    "Actions",
                                ].map((h) => (
                                    <th
                                        key={h}
                                        className="whitespace-nowrap px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-stone-400"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {pageRows.map((r) => (
                                <tr
                                    key={r.id}
                                    className="border-b border-stone-200 hover:bg-stone-50"
                                >
                                    <td className="px-5 py-3 text-sm">
                                        {r.city}
                                    </td>
                                    <td className="px-5 py-3 text-sm">
                                        {r.market}
                                    </td>
                                    <td className="px-5 py-3 text-sm">
                                        {r.priceAnomaly}
                                    </td>
                                    <td className="px-5 py-3 text-sm">
                                        {r.marketAnomaly}
                                    </td>
                                    <td className="px-5 py-3 text-sm text-stone-500">
                                        —
                                    </td>
                                </tr>
                            ))}
                            {pageRows.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-5 py-10 text-center text-sm text-stone-400"
                                    >
                                        No anomalies found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between gap-3 px-5 py-3">
                    <div className="text-xs text-stone-400">
                        Showing {pageRows.length} out of {filtered.length}{" "}
                        records
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={safePage <= 1}
                            className="rounded border border-stone-300 bg-white px-2 py-1 text-xs text-stone-600 disabled:opacity-40"
                        >
                            Prev
                        </button>
                        {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1,
                        ).map((p) => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => setPage(p)}
                                className={`rounded border px-2 py-1 text-xs ${
                                    p === safePage
                                        ? "border-emerald-700 bg-emerald-700 text-white"
                                        : "border-stone-300 bg-white text-stone-600 hover:bg-stone-50"
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={() =>
                                setPage((p) => Math.min(totalPages, p + 1))
                            }
                            disabled={safePage >= totalPages}
                            className="rounded border border-stone-300 bg-white px-2 py-1 text-xs text-stone-600 disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

Index.layout = (page) => (
    <AppLayout title="Anomaly Flagging" breadcrumb="Management → Anomaly">
        {page}
    </AppLayout>
);
