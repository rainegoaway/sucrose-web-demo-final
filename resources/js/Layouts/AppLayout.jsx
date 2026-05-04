import React, { useEffect, useMemo, useState } from "react";
import { Link, usePage } from "@inertiajs/react";

function initials(firstName, lastName) {
    const a = (firstName || "").trim()[0] || "";
    const b = (lastName || "").trim()[0] || "";
    const s = (a + b).toUpperCase();
    return s || "U";
}

function roleLabel(role) {
    const map = {
        IT_ADMIN: "IT Admin",
        MONITORING_ADMIN: "Monitoring Admin",
        MONITORING_OFFICER: "Monitoring Officer",
        CONSOLIDATION_OFFICER: "Consolidation Officer",
    };
    return map[role] || role || "—";
}

export default function AppLayout({ title, breadcrumb, children }) {
    const page = usePage();
    const { auth, flash } = page.props;

    const [collapsed, setCollapsed] = useState(false);

    const [toast, setToast] = useState(null);

    const showToast = (message, type = "info") => {
        setToast({ message, type, key: Date.now() });
    };

    useEffect(() => {
        if (flash?.message) {
            showToast(flash.message, flash.type || "info");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flash?.message, flash?.type]);

    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(timer);
    }, [toast?.key]);

    const url = page.url || "";

    const nav = useMemo(
        () => [
            {
                section: "Main",
                items: [
                    {
                        label: "Dashboard",
                        icon: "⊞",
                        href: "/dashboard",
                        active: url.startsWith("/dashboard"),
                    },
                    {
                        label: "City Map",
                        icon: "🗺",
                        href: "/map",
                        active: url.startsWith("/map"),
                    },
                ],
            },
            {
                section: "Management",
                items: [
                    {
                        label: "Personnel",
                        icon: "👥",
                        href: "/personnel",
                        active: url.startsWith("/personnel"),
                    },
                    {
                        label: "Market",
                        icon: "🏪",
                        href: "/markets",
                        active: url.startsWith("/markets"),
                    },
                    {
                        label: "Brand",
                        icon: "🏷",
                        href: "/brands",
                        active: url.startsWith("/brands"),
                    },
                    {
                        label: "Anomaly",
                        icon: "⚑",
                        href: "/anomaly",
                        active: url.startsWith("/anomaly"),
                    },
                ],
            },
            {
                section: "Reports",
                items: [
                    {
                        label: "Bantay Presyo",
                        icon: "📋",
                        href: "/reports/bantay-presyo",
                        active: url.startsWith("/reports/bantay-presyo"),
                    },
                    {
                        label: "Weekly Reports",
                        icon: "📅",
                        href: "/reports/weekly",
                        active: url.startsWith("/reports/weekly"),
                    },
                    {
                        label: "Monitoring Forms",
                        icon: "📝",
                        href: "/reports/forms",
                        active: url.startsWith("/reports/forms"),
                    },
                ],
            },
        ],
        [url],
    );

    const user = auth?.user;

    return (
        <div className="flex h-screen overflow-hidden bg-stone-100 text-stone-900">
            <aside
                className={`${collapsed ? "w-14" : "w-56"} flex-shrink-0 border-r border-stone-200 bg-white transition-[width] duration-200`}
            >
                <div className="flex min-h-14 items-center gap-2 border-b border-stone-200 px-3 py-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-emerald-700 text-xs font-semibold text-white">
                        SC
                    </div>
                    <div
                        className={`${collapsed ? "opacity-0 w-0" : "opacity-100"} overflow-hidden transition-opacity duration-200`}
                    >
                        <div className="text-sm font-semibold tracking-wide">
                            SUCROSE
                        </div>
                        <div className="text-[10px] uppercase tracking-widest text-stone-400">
                            SRA · LMD
                        </div>
                    </div>
                </div>

                <Link
                    href="/profile"
                    className="flex min-h-[52px] items-center gap-2 border-b border-stone-200 px-3 py-2 hover:bg-stone-50"
                >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-emerald-700 bg-emerald-50 text-xs font-semibold text-emerald-700">
                        {initials(user?.first_name, user?.last_name)}
                    </div>
                    <div
                        className={`${collapsed ? "opacity-0 w-0" : "opacity-100"} overflow-hidden transition-opacity duration-200`}
                    >
                        <div className="truncate text-xs font-medium">
                            {user
                                ? `${user.first_name} ${user.last_name}`
                                : "—"}
                        </div>
                        <div className="truncate text-[10px] text-stone-400">
                            {roleLabel(user?.role)}
                        </div>
                    </div>
                </Link>

                <nav className="h-[calc(100vh-52px-56px-52px)] overflow-y-auto py-2">
                    {nav.map((group) => (
                        <div key={group.section} className="mb-2">
                            <div
                                className={`${collapsed ? "opacity-0" : "opacity-100"} px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-widest text-stone-400 transition-opacity duration-200`}
                            >
                                {group.section}
                            </div>

                            {group.items.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`relative flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                                        item.active
                                            ? "bg-emerald-50 text-emerald-700 font-medium"
                                            : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                                    }`}
                                >
                                    {item.active && (
                                        <span className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r bg-emerald-700" />
                                    )}
                                    <span className="w-5 text-center text-base leading-none">
                                        {item.icon}
                                    </span>
                                    <span
                                        className={`${collapsed ? "hidden" : "block"} truncate`}
                                    >
                                        {item.label}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    ))}
                </nav>

                <button
                    type="button"
                    onClick={() => setCollapsed((v) => !v)}
                    className="flex w-full items-center gap-2 border-t border-stone-200 px-3 py-2 text-xs text-stone-400 hover:bg-stone-50 hover:text-stone-600"
                >
                    <span className="w-5 text-center text-base">
                        {collapsed ? "▶" : "◀"}
                    </span>
                    <span className={`${collapsed ? "hidden" : "block"}`}>
                        Collapse
                    </span>
                </button>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <header className="flex h-[52px] flex-shrink-0 items-center justify-between border-b border-stone-200 bg-white px-5">
                    <div className="min-w-0">
                        <div className="truncate text-[15px] font-semibold">
                            {title}
                        </div>
                        <div className="truncate text-xs text-stone-400">
                            {breadcrumb}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                showToast("No new notifications", "info")
                            }
                            className="rounded border border-stone-200 px-2 py-1 text-xs text-stone-600 hover:bg-stone-50"
                        >
                            🔔
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                showToast("Help is not configured yet", "info")
                            }
                            className="rounded border border-stone-200 px-2 py-1 text-xs text-stone-600 hover:bg-stone-50"
                        >
                            ?
                        </button>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="rounded border border-stone-200 px-2 py-1 text-xs text-stone-600 hover:bg-stone-50"
                        >
                            Logout
                        </Link>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-5">{children}</main>

                {toast && (
                    <div
                        className={`fixed bottom-6 right-6 z-[999] flex items-center gap-2 rounded-md px-4 py-2 text-sm text-white shadow-lg ${
                            toast.type === "success"
                                ? "bg-emerald-700"
                                : toast.type === "error"
                                  ? "bg-red-700"
                                  : toast.type === "warn"
                                    ? "bg-amber-700"
                                    : "bg-stone-900"
                        }`}
                    >
                        <span>{toast.message}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
