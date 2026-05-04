import React, { useMemo, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AppLayout from "../../Layouts/AppLayout";

const PER_PAGE = 5;

function sugarLabel(s) {
    if (s === "RAW") return "Raw";
    if (s === "WASHED") return "Washed";
    if (s === "REFINED") return "Refined";
    return s || "—";
}

export default function Index({ brands }) {
    const [q, setQ] = useState("");
    const [sugar, setSugar] = useState("");
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(1);

    const [modal, setModal] = useState(null); // add | view | edit | delete
    const [selected, setSelected] = useState(null);

    const createForm = useForm({
        brand_name: "",
        sugar_type: "",
        is_active: true,
    });

    const editForm = useForm({
        brand_name: "",
        sugar_type: "",
        is_active: true,
    });

    const deleteForm = useForm({});
    const deactivateForm = useForm({ is_active: false });

    const filtered = useMemo(() => {
        const qq = q.trim().toLowerCase();
        return (brands || []).filter((b) => {
            if (
                qq &&
                !String(b.brand_name || "")
                    .toLowerCase()
                    .includes(qq)
            )
                return false;
            if (sugar && (!b.sugar_types || !b.sugar_types.includes(sugar))) return false;
            if (status === "Active" && !b.is_active) return false;
            if (status === "Inactive" && b.is_active) return false;
            return true;
        });
    }, [brands, q, sugar, status]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const safePage = Math.min(page, totalPages);
    const pageRows = filtered.slice(
        (safePage - 1) * PER_PAGE,
        safePage * PER_PAGE,
    );

    const openAdd = () => {
        createForm.reset();
        createForm.setData({ brand_name: "", sugar_type: [], is_active: true });
        createForm.clearErrors();
        setSelected(null);
        setModal("add");
    };

    const openView = (b) => {
        setSelected(b);
        setModal("view");
    };

    const openEdit = (b) => {
        setSelected(b);
        editForm.reset();
        editForm.setData({
            brand_name: b.brand_name || "",
            sugar_type: b.sugar_types || [],
            is_active: !!b.is_active,
        });
        editForm.clearErrors();
        setModal("edit");
    };

    const openDelete = (b) => {
        setSelected(b);
        deleteForm.clearErrors();
        deactivateForm.clearErrors();
        setModal("delete");
    };

    const closeModal = () => setModal(null);

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post("/brands", {
            onSuccess: () => closeModal(),
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        if (!selected?.brand_id) return;
        editForm.patch(`/brands/${selected.brand_id}`, {
            onSuccess: () => closeModal(),
        });
    };

    const submitDelete = () => {
        if (!selected?.brand_id) return;

        if ((selected.markets_count || 0) > 0) {
            deactivateForm.patch(`/brands/${selected.brand_id}`, {
                onSuccess: () => closeModal(),
            });
            return;
        }

        deleteForm.delete(`/brands/${selected.brand_id}`, {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <div className="rounded-lg border border-stone-200 bg-white shadow-sm">
            <Head title="Brand" />

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
                            placeholder="Search by brand name…"
                            className="w-full rounded-md border border-stone-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-600"
                        />
                    </div>

                    <select
                        value={sugar}
                        onChange={(e) => {
                            setPage(1);
                            setSugar(e.target.value);
                        }}
                        className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-600 outline-none focus:border-emerald-600"
                    >
                        <option value="">All Sugar Types</option>
                        <option value="RAW">Raw</option>
                        <option value="WASHED">Washed</option>
                        <option value="REFINED">Refined</option>
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
                    + Add Brand
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-stone-50">
                        <tr className="border-b border-stone-200">
                            {[
                                "Brand Name",
                                "Sugar Type",
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
                        {pageRows.map((b) => (
                            <tr
                                key={b.brand_id}
                                className="border-b border-stone-200 hover:bg-stone-50"
                            >
                                <td className="px-5 py-3 text-sm">
                                    {b.brand_name}
                                </td>
                                <td className="px-5 py-3 text-sm text-stone-700">
                                    {(b.sugar_types || [])
                                        .map(sugarLabel)
                                        .join(", ") || "—"}
                                </td>
                                <td className="px-5 py-3 text-sm">
                                    <span
                                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                            b.is_active
                                                ? "bg-emerald-50 text-emerald-700"
                                                : "bg-stone-50 text-stone-400 border border-stone-200"
                                        }`}
                                    >
                                        {b.is_active ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="px-5 py-3 text-sm">
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => openView(b)}
                                            className="rounded border border-stone-200 bg-white px-2 py-1 text-xs text-stone-600 hover:bg-sky-50 hover:text-sky-800"
                                        >
                                            View
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => openEdit(b)}
                                            className="rounded border border-stone-200 bg-white px-2 py-1 text-xs text-stone-600 hover:bg-amber-50 hover:text-amber-800"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => openDelete(b)}
                                            className="rounded border border-stone-200 bg-white px-2 py-1 text-xs text-stone-600 hover:bg-red-50 hover:text-red-800"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {pageRows.length === 0 && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-5 py-10 text-center text-sm text-stone-400"
                                >
                                    No brands found.
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

            {modal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-5"
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) closeModal();
                    }}
                >
                    {modal === "view" && selected && (
                        <div className="w-full max-w-xl rounded-lg bg-white shadow-xl">
                            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
                                <div className="text-sm font-semibold">
                                    Brand Details
                                </div>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-md px-2 py-1 text-stone-400 hover:bg-stone-50 hover:text-stone-600"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="p-5">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <div className="text-[11px] font-medium uppercase tracking-widest text-stone-400">
                                            Brand Name
                                        </div>
                                        <div className="mt-1 text-sm">
                                            {selected.brand_name}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-medium uppercase tracking-widest text-stone-400">
                                            Sugar Types
                                        </div>
                                        <div className="mt-1 text-sm">
                                            {(selected.sugar_types || [])
                                                .map(sugarLabel)
                                                .join(", ") || "—"}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-medium uppercase tracking-widest text-stone-400">
                                            Status
                                        </div>
                                        <div className="mt-1 text-sm">
                                            {selected.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 border-t border-stone-200 px-5 py-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        closeModal();
                                        openEdit(selected);
                                    }}
                                    className="rounded-md bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-800"
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-600 hover:bg-stone-50"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}

                    {modal === "add" && (
                        <div className="w-full max-w-xl rounded-lg bg-white shadow-xl">
                            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
                                <div className="text-sm font-semibold">
                                    Add New Brand
                                </div>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-md px-2 py-1 text-stone-400 hover:bg-stone-50 hover:text-stone-600"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={submitCreate}>
                                <div className="p-5">
                                    <div className="grid grid-cols-1 gap-3">
                                        <div>
                                            <label className="text-xs font-medium text-stone-600">
                                                Brand Name *
                                            </label>
                                            <input
                                                className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                                value={
                                                    createForm.data.brand_name
                                                }
                                                onChange={(e) =>
                                                    createForm.setData(
                                                        "brand_name",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="e.g. Victorias"
                                            />
                                            {createForm.errors.brand_name && (
                                                <div className="mt-1 text-xs text-red-600">
                                                    {
                                                        createForm.errors
                                                            .brand_name
                                                    }
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium text-stone-600">
                                                Available Sugar Types (select 1-3)
                                            </label>
                                            <div className="mt-2 space-y-2">
                                                {["RAW", "WASHED", "REFINED"].map(
                                                    (type) => (
                                                        <label
                                                            key={type}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    (
                                                                        createForm
                                                                            .data
                                                                            .sugar_type ||
                                                                        []
                                                                    ).includes(
                                                                        type,
                                                                    )
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    const current =
                                                                        createForm
                                                                            .data
                                                                            .sugar_type ||
                                                                        [];
                                                                    let updated =
                                                                        [
                                                                            ...current,
                                                                        ];
                                                                    if (
                                                                        e.target
                                                                            .checked
                                                                    ) {
                                                                        if (
                                                                            updated.length <
                                                                            3
                                                                        ) {
                                                                            updated.push(
                                                                                type,
                                                                            );
                                                                        }
                                                                    } else {
                                                                        updated =
                                                                            updated.filter(
                                                                                (
                                                                                    t,
                                                                                ) =>
                                                                                    t !==
                                                                                    type,
                                                                            );
                                                                    }
                                                                    createForm.setData(
                                                                        "sugar_type",
                                                                        updated,
                                                                    );
                                                                }}
                                                                className="rounded border border-stone-300 accent-emerald-600"
                                                            />
                                                            <span className="text-sm text-stone-700">
                                                                {sugarLabel(
                                                                    type,
                                                                )}
                                                            </span>
                                                        </label>
                                                    ),
                                                )}
                                            </div>
                                            {createForm.errors.sugar_type && (
                                                <div className="mt-1 text-xs text-red-600">
                                                    {
                                                        createForm.errors
                                                            .sugar_type
                                                    }
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
                                                    createForm.data.is_active
                                                        ? "Active"
                                                        : "Inactive"
                                                }
                                                onChange={(e) =>
                                                    createForm.setData(
                                                        "is_active",
                                                        e.target.value ===
                                                            "Active",
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
                                        onClick={closeModal}
                                        className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-600 hover:bg-stone-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createForm.processing}
                                        className="rounded-md bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
                                    >
                                        Create Brand
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {modal === "edit" && selected && (
                        <div className="w-full max-w-xl rounded-lg bg-white shadow-xl">
                            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
                                <div className="text-sm font-semibold">
                                    Edit Brand
                                </div>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-md px-2 py-1 text-stone-400 hover:bg-stone-50 hover:text-stone-600"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={submitEdit}>
                                <div className="p-5">
                                    <div className="grid grid-cols-1 gap-3">
                                        <div>
                                            <label className="text-xs font-medium text-stone-600">
                                                Brand Name *
                                            </label>
                                            <input
                                                className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                                value={editForm.data.brand_name}
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        "brand_name",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {editForm.errors.brand_name && (
                                                <div className="mt-1 text-xs text-red-600">
                                                    {editForm.errors.brand_name}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium text-stone-600">
                                                Sugar Types (select 1-3)
                                            </label>
                                            <div className="mt-2 space-y-2">
                                                {["RAW", "WASHED", "REFINED"].map(
                                                    (type) => (
                                                        <label
                                                            key={type}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    (
                                                                        editForm
                                                                            .data
                                                                            .sugar_type ||
                                                                        []
                                                                    ).includes(
                                                                        type,
                                                                    )
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    const current =
                                                                        editForm
                                                                            .data
                                                                            .sugar_type ||
                                                                        [];
                                                                    let updated =
                                                                        [
                                                                            ...current,
                                                                        ];
                                                                    if (
                                                                        e.target
                                                                            .checked
                                                                    ) {
                                                                        if (
                                                                            updated.length <
                                                                            3
                                                                        ) {
                                                                            updated.push(
                                                                                type,
                                                                            );
                                                                        }
                                                                    } else {
                                                                        updated =
                                                                            updated.filter(
                                                                                (
                                                                                    t,
                                                                                ) =>
                                                                                    t !==
                                                                                    type,
                                                                            );
                                                                    }
                                                                    editForm.setData(
                                                                        "sugar_type",
                                                                        updated,
                                                                    );
                                                                }}
                                                                className="rounded border border-stone-300 accent-emerald-600"
                                                            />
                                                            <span className="text-sm text-stone-700">
                                                                {sugarLabel(
                                                                    type,
                                                                )}
                                                            </span>
                                                        </label>
                                                    ),
                                                )}
                                            </div>
                                            {editForm.errors.sugar_type && (
                                                <div className="mt-1 text-xs text-red-600">
                                                    {editForm.errors.sugar_type}
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
                                                        e.target.value ===
                                                            "Active",
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
                                        onClick={closeModal}
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
                    )}

                    {modal === "delete" && selected && (
                        <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
                            {(() => {
                                const isLinkedToMarket =
                                    (selected.markets_count || 0) > 0;
                                return (
                                    <>
                            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
                                <div className="text-sm font-semibold">
                                    {isLinkedToMarket
                                        ? "Cannot Delete Linked Brand"
                                        : "Confirm Deletion"}
                                </div>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-md px-2 py-1 text-stone-400 hover:bg-stone-50 hover:text-stone-600"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="p-5 text-center">
                                <div className="text-3xl">⚠️</div>
                                <div className="mt-3 text-sm text-stone-600">
                                    {isLinkedToMarket ? (
                                        <>
                                            <strong>{selected.brand_name}</strong>{" "}
                                            is assigned to at least one market.
                                        </>
                                    ) : (
                                        <>
                                            Delete{" "}
                                            <strong>{selected.brand_name}</strong>?
                                        </>
                                    )}
                                </div>
                                <div className="mt-1 text-xs text-stone-400">
                                    {isLinkedToMarket
                                        ? "You can only set this brand to inactive."
                                        : "This action cannot be undone."}
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 border-t border-stone-200 px-5 py-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-600 hover:bg-stone-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={submitDelete}
                                    disabled={
                                        isLinkedToMarket
                                            ? deactivateForm.processing
                                            : deleteForm.processing
                                    }
                                    className={`rounded-md px-3 py-2 text-sm font-medium text-white disabled:opacity-50 ${
                                        isLinkedToMarket
                                            ? "bg-amber-600 hover:bg-amber-700"
                                            : "bg-red-700 hover:bg-red-800"
                                    }`}
                                >
                                    {isLinkedToMarket
                                        ? "Set to Inactive"
                                        : "Confirm Delete"}
                                </button>
                            </div>
                                    </>
                                );
                            })()}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

Index.layout = (page) => (
    <AppLayout title="Brand Management" breadcrumb="Management → Brand">
        {page}
    </AppLayout>
);
