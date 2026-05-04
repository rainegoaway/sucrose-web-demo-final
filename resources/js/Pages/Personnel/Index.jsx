import React, { useMemo, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AppLayout from "../../Layouts/AppLayout";

const PER_PAGE = 5;

function roleLabel(role) {
    const map = {
        IT_ADMIN: "IT Admin",
        MONITORING_ADMIN: "Monitoring Admin",
        MONITORING_OFFICER: "Monitoring Officer",
        CONSOLIDATION_OFFICER: "Consolidation Officer",
    };
    return map[role] || role || "—";
}

function roleBadgeClass(role) {
    if (role === "IT_ADMIN" || role === "MONITORING_ADMIN")
        return "bg-indigo-50 text-indigo-800";
    if (role === "MONITORING_OFFICER") return "bg-sky-50 text-sky-800";
    if (role === "CONSOLIDATION_OFFICER")
        return "bg-emerald-50 text-emerald-800";
    return "bg-stone-50 text-stone-700";
}

export default function Index({ users }) {
    const [q, setQ] = useState("");
    const [role, setRole] = useState("");
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(1);

    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [selected, setSelected] = useState(null);

    const form = useForm({
        first_name: "",
        last_name: "",
        email: "",
        role: "",
        is_active: true,
    });

    const editForm = useForm({
        first_name: "",
        last_name: "",
        email: "",
        role: "",
        is_active: true,
    });

    const filtered = useMemo(() => {
        const qq = q.trim().toLowerCase();
        return (users || []).filter((u) => {
            const full = `${u.last_name} ${u.first_name}`.toLowerCase();
            if (qq && !full.includes(qq)) return false;
            if (role && u.role !== role) return false;
            if (status === "Active" && !u.is_active) return false;
            if (status === "Inactive" && u.is_active) return false;
            return true;
        });
    }, [users, q, role, status]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const safePage = Math.min(page, totalPages);
    const pageRows = filtered.slice(
        (safePage - 1) * PER_PAGE,
        safePage * PER_PAGE,
    );

    const openAdd = () => {
        form.reset();
        form.clearErrors();
        setShowAdd(true);
    };

    const closeAdd = () => setShowAdd(false);

    const openEdit = (u) => {
        setSelected(u);
        editForm.reset();
        editForm.setData({
            first_name: u.first_name || "",
            last_name: u.last_name || "",
            email: u.email || "",
            role: u.role || "",
            is_active: !!u.is_active,
        });
        editForm.clearErrors();
        setShowEdit(true);
    };

    const closeEdit = () => {
        setShowEdit(false);
        setSelected(null);
    };

    const submitAdd = (e) => {
        e.preventDefault();
        form.post("/personnel", {
            onSuccess: () => {
                setShowAdd(false);
            },
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        if (!selected?.user_id) return;
        editForm.patch(`/personnel/${selected.user_id}`, {
            onSuccess: () => {
                setShowEdit(false);
                setSelected(null);
            },
        });
    };

    return (
        <div className="rounded-lg border border-stone-200 bg-white shadow-sm">
            <Head title="Personnel" />

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
                            placeholder="Search by name…"
                            className="w-full rounded-md border border-stone-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-600"
                        />
                    </div>

                    <select
                        value={role}
                        onChange={(e) => {
                            setPage(1);
                            setRole(e.target.value);
                        }}
                        className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-600 outline-none focus:border-emerald-600"
                    >
                        <option value="">All Roles</option>
                        <option value="IT_ADMIN">IT Admin</option>
                        <option value="MONITORING_ADMIN">
                            Monitoring Admin
                        </option>
                        <option value="MONITORING_OFFICER">
                            Monitoring Officer
                        </option>
                        <option value="CONSOLIDATION_OFFICER">
                            Consolidation Officer
                        </option>
                    </select>

                    <select
                        value={status}
                        onChange={(e) => {
                            setPage(1);
                            setStatus(e.target.value);
                        }}
                        className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-600 outline-none focus:border-emerald-600"
                    >
                        <option value="">All Status</option>
                        <option>Active</option>
                        <option>Inactive</option>
                    </select>
                </div>

                <button
                    type="button"
                    onClick={openAdd}
                    className="rounded-md bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-800"
                >
                    + Add Personnel
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-stone-50">
                        <tr className="border-b border-stone-200">
                            {[
                                "Last Name",
                                "First Name",
                                "Role",
                                "Assignment",
                                "Status",
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
                        {pageRows.map((u) => (
                            <tr
                                key={u.user_id}
                                className="border-b border-stone-200 hover:bg-stone-50"
                            >
                                <td className="px-5 py-3 text-sm">
                                    {u.last_name}
                                </td>
                                <td className="px-5 py-3 text-sm">
                                    {u.first_name}
                                </td>
                                <td className="px-5 py-3 text-sm">
                                    <span
                                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${roleBadgeClass(u.role)}`}
                                    >
                                        {roleLabel(u.role)}
                                    </span>
                                </td>
                                <td className="px-5 py-3 text-sm text-stone-700">
                                    {u.assignment || "Unassigned"}
                                </td>
                                <td className="px-5 py-3 text-sm">
                                    <span
                                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                            u.is_active
                                                ? "bg-emerald-50 text-emerald-700"
                                                : "bg-stone-50 text-stone-400 border border-stone-200"
                                        }`}
                                    >
                                        {u.is_active ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="px-5 py-3 text-sm">
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => openEdit(u)}
                                            className="rounded border border-stone-200 bg-white px-2 py-1 text-xs text-stone-600 hover:bg-amber-50 hover:text-amber-800"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {pageRows.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-5 py-10 text-center text-sm text-stone-400"
                                >
                                    No personnel found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="text-xs text-stone-400">
                    Showing {pageRows.length} out of {filtered.length} records
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
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (p) => (
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
                        ),
                    )}
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

            {showAdd && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-5"
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) closeAdd();
                    }}
                >
                    <div className="w-full max-w-xl rounded-lg bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
                            <div className="text-sm font-semibold">
                                Add New Personnel
                            </div>
                            <button
                                type="button"
                                onClick={closeAdd}
                                className="rounded-md px-2 py-1 text-stone-400 hover:bg-stone-50 hover:text-stone-600"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={submitAdd}>
                            <div className="p-5">
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    <div>
                                        <label className="text-xs font-medium text-stone-600">
                                            Last Name *
                                        </label>
                                        <input
                                            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                            value={form.data.last_name}
                                            onChange={(e) =>
                                                form.setData(
                                                    "last_name",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="e.g. Santos"
                                        />
                                        {form.errors.last_name && (
                                            <div className="mt-1 text-xs text-red-600">
                                                {form.errors.last_name}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-stone-600">
                                            First Name *
                                        </label>
                                        <input
                                            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                            value={form.data.first_name}
                                            onChange={(e) =>
                                                form.setData(
                                                    "first_name",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="e.g. Maria"
                                        />
                                        {form.errors.first_name && (
                                            <div className="mt-1 text-xs text-red-600">
                                                {form.errors.first_name}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-stone-600">
                                            Role *
                                        </label>
                                        <select
                                            className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 outline-none focus:border-emerald-600"
                                            value={form.data.role}
                                            onChange={(e) =>
                                                form.setData(
                                                    "role",
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value="">
                                                Select role…
                                            </option>
                                            <option value="IT_ADMIN">
                                                IT Admin
                                            </option>
                                            <option value="MONITORING_ADMIN">
                                                Monitoring Admin
                                            </option>
                                            <option value="MONITORING_OFFICER">
                                                Monitoring Officer
                                            </option>
                                            <option value="CONSOLIDATION_OFFICER">
                                                Consolidation Officer
                                            </option>
                                        </select>
                                        {form.errors.role && (
                                            <div className="mt-1 text-xs text-red-600">
                                                {form.errors.role}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-stone-600">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                            value={form.data.email}
                                            onChange={(e) =>
                                                form.setData(
                                                    "email",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="email@sra.gov.ph"
                                        />
                                        {form.errors.email && (
                                            <div className="mt-1 text-xs text-red-600">
                                                {form.errors.email}
                                            </div>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="text-xs font-medium text-stone-600">
                                            Status
                                        </label>
                                        <select
                                            className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 outline-none focus:border-emerald-600"
                                            value={
                                                form.data.is_active
                                                    ? "Active"
                                                    : "Inactive"
                                            }
                                            onChange={(e) =>
                                                form.setData(
                                                    "is_active",
                                                    e.target.value === "Active",
                                                )
                                            }
                                        >
                                            <option>Active</option>
                                            <option>Inactive</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-stone-200 px-5 py-4">
                                <button
                                    type="button"
                                    onClick={closeAdd}
                                    className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-600 hover:bg-stone-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="rounded-md bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
                                >
                                    Create Personnel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showEdit && selected && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-5"
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) closeEdit();
                    }}
                >
                    <div className="w-full max-w-xl rounded-lg bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
                            <div className="text-sm font-semibold">
                                Edit Personnel
                            </div>
                            <button
                                type="button"
                                onClick={closeEdit}
                                className="rounded-md px-2 py-1 text-stone-400 hover:bg-stone-50 hover:text-stone-600"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={submitEdit}>
                            <div className="p-5">
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    <div>
                                        <label className="text-xs font-medium text-stone-600">
                                            Last Name
                                        </label>
                                        <input
                                            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                            value={editForm.data.last_name}
                                            onChange={(e) =>
                                                editForm.setData(
                                                    "last_name",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Santos"
                                        />
                                        {editForm.errors.last_name && (
                                            <div className="mt-1 text-xs text-red-600">
                                                {editForm.errors.last_name}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-stone-600">
                                            First Name
                                        </label>
                                        <input
                                            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                            value={editForm.data.first_name}
                                            onChange={(e) =>
                                                editForm.setData(
                                                    "first_name",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Miguel"
                                        />
                                        {editForm.errors.first_name && (
                                            <div className="mt-1 text-xs text-red-600">
                                                {editForm.errors.first_name}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-stone-600">
                                            Role
                                        </label>
                                        <select
                                            className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 outline-none focus:border-emerald-600"
                                            value={editForm.data.role}
                                            onChange={(e) =>
                                                editForm.setData(
                                                    "role",
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value="">
                                                Select role…
                                            </option>
                                            <option value="IT_ADMIN">
                                                IT Admin
                                            </option>
                                            <option value="MONITORING_ADMIN">
                                                Monitoring Admin
                                            </option>
                                            <option value="MONITORING_OFFICER">
                                                Monitoring Officer
                                            </option>
                                            <option value="CONSOLIDATION_OFFICER">
                                                Consolidation Officer
                                            </option>
                                        </select>
                                        {editForm.errors.role && (
                                            <div className="mt-1 text-xs text-red-600">
                                                {editForm.errors.role}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-stone-600">
                                            Assignment
                                        </label>
                                        <input
                                            readOnly
                                            className="mt-1 w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-600 outline-none focus:border-emerald-600"
                                            value={
                                                selected.assignment ||
                                                "Unassigned"
                                            }
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-stone-600">
                                            Email
                                        </label>
                                        <input
                                            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                            value={editForm.data.email}
                                            onChange={(e) =>
                                                editForm.setData(
                                                    "email",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="m.santos@sra.gov.ph"
                                        />
                                        {editForm.errors.email && (
                                            <div className="mt-1 text-xs text-red-600">
                                                {editForm.errors.email}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-stone-600">
                                            Status
                                        </label>
                                        <select
                                            className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 outline-none focus:border-emerald-600"
                                            value={
                                                editForm.data.is_active
                                                    ? "Active"
                                                    : "Inactive"
                                            }
                                            onChange={(e) =>
                                                editForm.setData(
                                                    "is_active",
                                                    e.target.value === "Active",
                                                )
                                            }
                                        >
                                            <option>Active</option>
                                            <option>Inactive</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-stone-200 px-5 py-4">
                                <button
                                    type="button"
                                    onClick={closeEdit}
                                    className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-600 hover:bg-stone-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="rounded-md bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

Index.layout = (page) => (
    <AppLayout title="Personnel Management" breadcrumb="Management → Personnel">
        {page}
    </AppLayout>
);
