import React, { useMemo, useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AppLayout from "../../Layouts/AppLayout";

const PER_PAGE = 5;

function typeBadge(type) {
    if (type === "WET_MARKET")
        return (
            <span className="inline-flex rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">
                Wet Market
            </span>
        );
    if (type === "DRY_MARKET")
        return (
            <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                Dry Market
            </span>
        );
    return (
        <span className="inline-flex rounded-full bg-stone-50 px-2 py-0.5 text-xs font-medium text-stone-700">
            {type || "—"}
        </span>
    );
}

export default function Index({ markets, cities, brands }) {
    const [q, setQ] = useState("");
    const [type, setType] = useState("");
    const [city, setCity] = useState("");
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(1);

    const [modal, setModal] = useState(null); // add | view | edit | delete
    const [selected, setSelected] = useState(null);
    const [brandToAdd, setBrandToAdd] = useState("");

    const createForm = useForm({
        market_name: "",
        market_type: "",
        city_id: "",
        address: "",
        latitude: "",
        longitude: "",
        is_active: true,
        brand_ids: [],
    });

    const editForm = useForm({
        market_name: "",
        market_type: "",
        city_id: "",
        address: "",
        latitude: "",
        longitude: "",
        is_active: true,
    });

    const deleteForm = useForm({});

    const cityCoordinates = useMemo(() => {
        return {
            "Manila": { lat: 14.5963775, lon: 120.9825899 },
            "Quezon City": { lat: 14.6954074, lon: 121.0869890 },
            "Caloocan": { lat: 14.7806974, lon: 121.0429118 },
            "Las Piñas": { lat: 14.4365193, lon: 121.0058441 },
            "Makati": { lat: 14.5652149, lon: 121.0335849 },
            "Malabon": { lat: 14.6564487, lon: 120.9506780 },
            "Mandaluyong": { lat: 14.5917367, lon: 121.0251398 },
            "Marikina": { lat: 14.6330044, lon: 121.0962135 },
            "Muntinlupa": { lat: 14.4192750, lon: 121.0445309 },
            "Navotas": { lat: 14.6430344, lon: 120.9511054 },
            "Parañaque": { lat: 14.5275751, lon: 120.9971696 },
            "Pasay": { lat: 14.5501004, lon: 120.9961085 },
            "Pasig": { lat: 14.5581364, lon: 121.0849500 },
            "San Juan": { lat: 14.6051350, lon: 121.0232518 },
            "Taguig": { lat: 14.5470668, lon: 121.0558316 },
            "Valenzuela": { lat: 14.7080912, lon: 120.9942638 },
            "Pateros": { lat: 14.5454213, lon: 121.0660730 },
        };
    }, []);

    const cityNameById = useMemo(() => {
        const map = new Map();
        (cities || []).forEach((c) => map.set(c.city_id, c.city_name));
        return map;
    }, [cities]);

    const brandNameById = useMemo(() => {
        const map = new Map();
        (brands || []).forEach((b) => map.set(b.brand_id, b.brand_name));
        return map;
    }, [brands]);

    const availableBrandsToAdd = useMemo(() => {
        const selectedIds = new Set(createForm.data.brand_ids || []);
        return (brands || []).filter((b) => !selectedIds.has(b.brand_id));
    }, [brands, createForm.data.brand_ids]);

    const filtered = useMemo(() => {
        const qq = q.trim().toLowerCase();
        return (markets || []).filter((m) => {
            if (
                qq &&
                !String(m.market_name || "")
                    .toLowerCase()
                    .includes(qq)
            )
                return false;
            if (type && m.market_type !== type) return false;
            if (city && (m.city?.city_name || "") !== city) return false;
            if (status === "Active" && !m.is_active) return false;
            if (status === "Inactive" && m.is_active) return false;
            return true;
        });
    }, [markets, q, type, city, status]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const safePage = Math.min(page, totalPages);
    const pageRows = filtered.slice(
        (safePage - 1) * PER_PAGE,
        safePage * PER_PAGE,
    );

    const openAdd = () => {
        // Generate random coordinates for testing (Manila metro area approximate bounds)
        const randomLat = (14.3 + Math.random() * 0.5).toFixed(7);
        const randomLon = (120.8 + Math.random() * 0.4).toFixed(7);
        
        createForm.reset();
        createForm.setData({
            market_name: "",
            market_type: "",
            city_id: "",
            address: "",
            latitude: randomLat,
            longitude: randomLon,
            is_active: true,
            brand_ids: [],
        });
        createForm.clearErrors();
        setBrandToAdd("");
        setSelected(null);
        setModal("add");
    };

    const openView = (m) => {
        setSelected(m);
        setModal("view");
    };

    const openEdit = (m) => {
        setSelected(m);
        editForm.reset();
        editForm.setData({
            market_name: m.market_name || "",
            market_type: m.market_type || "",
            city_id: m.city_id || "",
            address: m.address || "",
            latitude: m.latitude ?? "",
            longitude: m.longitude ?? "",
            is_active: !!m.is_active,
        });
        editForm.clearErrors();
        setModal("edit");
    };

    const openDelete = (m) => {
        setSelected(m);
        deleteForm.clearErrors();
        setModal("delete");
    };

    const closeModal = () => {
        setModal(null);
    };

    const submitCreate = (e) => {
        e.preventDefault();

        createForm.transform((data) => ({
            ...data,
            latitude: data.latitude === "" ? null : parseFloat(data.latitude),
            longitude: data.longitude === "" ? null : parseFloat(data.longitude),
        }));

        createForm.post("/markets", {
            onSuccess: () => {
                closeModal();
                router.reload();
            },
            onError: (errors) => {
                console.error("Market creation failed:", errors);
            },
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        if (!selected?.market_id) return;

        const brandIds = Array.isArray(selected.brands)
            ? selected.brands.map((b) => b.brand_id)
            : [];

        editForm.transform((data) => ({
            ...data,
            latitude: data.latitude === "" ? null : parseFloat(data.latitude),
            longitude: data.longitude === "" ? null : parseFloat(data.longitude),
            brand_ids: brandIds,
        }));

        editForm.patch(`/markets/${selected.market_id}`, {
            onSuccess: () => {
                closeModal();
                router.reload();
            },
            onError: (errors) => {
                console.error("Market update failed:", errors);
            },
        });
    };

    const removeSelectedBrand = (id) => {
        const current = Array.isArray(createForm.data.brand_ids)
            ? createForm.data.brand_ids
            : [];
        createForm.setData(
            "brand_ids",
            current.filter((x) => x !== id),
        );
    };

    const submitDelete = () => {
        if (!selected?.market_id) return;
        deleteForm.delete(`/markets/${selected.market_id}`, {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <div className="rounded-lg border border-stone-200 bg-white shadow-sm">
            <Head title="Market" />

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
                            placeholder="Search by market name…"
                            className="w-full rounded-md border border-stone-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-600"
                        />
                    </div>

                    <select
                        value={type}
                        onChange={(e) => {
                            setPage(1);
                            setType(e.target.value);
                        }}
                        className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-600 outline-none focus:border-emerald-600"
                    >
                        <option value="">All Types</option>
                        <option value="WET_MARKET">Wet Market</option>
                        <option value="DRY_MARKET">Dry Market</option>
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
                        {Array.from(
                            new Set(
                                (markets || [])
                                    .map((m) => m.city?.city_name)
                                    .filter(Boolean),
                            ),
                        )
                            .sort()
                            .map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
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
                    + Add Market
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-stone-50">
                        <tr className="border-b border-stone-200">
                            {[
                                "Market Name",
                                "Type",
                                "City",
                                "Address",
                                "Brands",
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
                        {pageRows.map((m) => (
                            <tr
                                key={m.market_id}
                                className="border-b border-stone-200 hover:bg-stone-50"
                            >
                                <td className="px-5 py-3 text-sm">
                                    {m.market_name}
                                </td>
                                <td className="px-5 py-3 text-sm">
                                    {typeBadge(m.market_type)}
                                </td>
                                <td className="px-5 py-3 text-sm">
                                    {m.city?.city_name || "—"}
                                </td>
                                <td className="px-5 py-3 text-sm text-stone-700">
                                    {m.address || "—"}
                                </td>
                                <td className="px-5 py-3 text-sm text-stone-400">
                                    {typeof m.brands_count === "number"
                                        ? `${m.brands_count} brand${m.brands_count === 1 ? "" : "s"}`
                                        : "—"}
                                </td>
                                <td className="px-5 py-3 text-sm">
                                    <span
                                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                            m.is_active
                                                ? "bg-emerald-50 text-emerald-700"
                                                : "bg-stone-50 text-stone-400 border border-stone-200"
                                        }`}
                                    >
                                        {m.is_active ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="px-5 py-3 text-sm">
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => openView(m)}
                                            className="rounded border border-stone-200 bg-white px-2 py-1 text-xs text-stone-600 hover:bg-sky-50 hover:text-sky-800"
                                        >
                                            View
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => openEdit(m)}
                                            className="rounded border border-stone-200 bg-white px-2 py-1 text-xs text-stone-600 hover:bg-amber-50 hover:text-amber-800"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => openDelete(m)}
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
                                    colSpan={7}
                                    className="px-5 py-10 text-center text-sm text-stone-400"
                                >
                                    No markets found.
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
                        <div className="w-full max-w-xl rounded-lg bg-white shadow-xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
                                <div className="text-sm font-semibold">
                                    Market Details
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
                                            Market Name
                                        </div>
                                        <div className="mt-1 text-sm">
                                            {selected.market_name}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-medium uppercase tracking-widest text-stone-400">
                                            Type
                                        </div>
                                        <div className="mt-1 text-sm">
                                            {selected.market_type}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-medium uppercase tracking-widest text-stone-400">
                                            City
                                        </div>
                                        <div className="mt-1 text-sm">
                                            {selected.city?.city_name ||
                                                cityNameById.get(
                                                    selected.city_id,
                                                ) ||
                                                "—"}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-medium uppercase tracking-widest text-stone-400">
                                            Monitoring
                                        </div>
                                        <div className="mt-1 text-sm">
                                            {selected.monitoring_status || "—"}
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <div className="text-[11px] font-medium uppercase tracking-widest text-stone-400">
                                            Address
                                        </div>
                                        <div className="mt-1 text-sm">
                                            {selected.address || "—"}
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <div className="text-[11px] font-medium uppercase tracking-widest text-stone-400">
                                            Brands Sold
                                        </div>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {Array.isArray(selected.brands) &&
                                            selected.brands.length > 0 ? (
                                                selected.brands.map((b) => (
                                                    <span
                                                        key={b.brand_id}
                                                        className="inline-flex rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs text-stone-600"
                                                    >
                                                        {b.brand_name}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-sm text-stone-400">
                                                    —
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-medium uppercase tracking-widest text-stone-400">
                                            Latitude
                                        </div>
                                        <div className="mt-1 text-sm">
                                            {selected.latitude ?? "—"}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-medium uppercase tracking-widest text-stone-400">
                                            Longitude
                                        </div>
                                        <div className="mt-1 text-sm">
                                            {selected.longitude ?? "—"}
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
                        <div className="w-full max-w-xl rounded-lg bg-white shadow-xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
                                <div className="text-sm font-semibold">
                                    Add New Market
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
                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-medium text-stone-600">
                                                Market Name *
                                            </label>
                                            <input
                                                className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                                value={
                                                    createForm.data.market_name
                                                }
                                                onChange={(e) =>
                                                    createForm.setData(
                                                        "market_name",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="e.g. Pasig Public Market"
                                            />
                                            {createForm.errors.market_name && (
                                                <div className="mt-1 text-xs text-red-600">
                                                    {
                                                        createForm.errors
                                                            .market_name
                                                    }
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium text-stone-600">
                                                Type *
                                            </label>
                                            <select
                                                className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 outline-none focus:border-emerald-600"
                                                value={
                                                    createForm.data.market_type
                                                }
                                                onChange={(e) =>
                                                    createForm.setData(
                                                        "market_type",
                                                        e.target.value,
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Select type…
                                                </option>
                                                <option value="WET_MARKET">
                                                    Wet Market
                                                </option>
                                                <option value="DRY_MARKET">
                                                    Dry Market
                                                </option>
                                            </select>
                                            {createForm.errors.market_type && (
                                                <div className="mt-1 text-xs text-red-600">
                                                    {
                                                        createForm.errors
                                                            .market_type
                                                    }
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium text-stone-600">
                                                City *
                                            </label>
                                            <select
                                                className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 outline-none focus:border-emerald-600"
                                                value={createForm.data.city_id}
                                                onChange={(e) => {
                                                    const cityId = e.target.value;
                                                    createForm.setData("city_id", cityId);
                                                    
                                                    const cityName = cityNameById.get(cityId);
                                                    if (cityName && cityCoordinates[cityName]) {
                                                        const coords = cityCoordinates[cityName];
                                                        createForm.setData("latitude", coords.lat.toString());
                                                        createForm.setData("longitude", coords.lon.toString());
                                                    }
                                                }}
                                            >
                                                <option value="">
                                                    Select city…
                                                </option>
                                                {(cities || []).map((c) => (
                                                    <option
                                                        key={c.city_id}
                                                        value={c.city_id}
                                                    >
                                                        {c.city_name}
                                                    </option>
                                                ))}
                                            </select>
                                            {createForm.errors.city_id && (
                                                <div className="mt-1 text-xs text-red-600">
                                                    {createForm.errors.city_id}
                                                </div>
                                            )}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="text-xs font-medium text-stone-600">
                                                Full Address *
                                            </label>
                                            <input
                                                className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                                value={createForm.data.address}
                                                onChange={(e) =>
                                                    createForm.setData(
                                                        "address",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="e.g. Brgy. Kapitolyo, Pasig City, Metro Manila"
                                            />
                                            {createForm.errors.address && (
                                                <div className="mt-1 text-xs text-red-600">
                                                    {createForm.errors.address}
                                                </div>
                                            )}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="text-xs font-medium text-stone-600">
                                                Brands (connect multiple)
                                            </label>
                                            <div className="mt-1">
                                                <select
                                                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 outline-none focus:border-emerald-600"
                                                    value={brandToAdd}
                                                    onChange={(e) => {
                                                        const id =
                                                            e.target.value;
                                                        if (!id) {
                                                            setBrandToAdd("");
                                                            return;
                                                        }
                                                        const current =
                                                            Array.isArray(
                                                                createForm.data
                                                                    .brand_ids,
                                                            )
                                                                ? createForm
                                                                      .data
                                                                      .brand_ids
                                                                : [];
                                                        if (
                                                            !current.includes(
                                                                id,
                                                            )
                                                        ) {
                                                            createForm.setData(
                                                                "brand_ids",
                                                                [
                                                                    ...current,
                                                                    id,
                                                                ],
                                                            );
                                                        }
                                                        setBrandToAdd("");
                                                    }}
                                                >
                                                    <option value="">
                                                        Select brand to add…
                                                    </option>
                                                    {availableBrandsToAdd.map(
                                                        (b) => (
                                                            <option
                                                                key={b.brand_id}
                                                                value={
                                                                    b.brand_id
                                                                }
                                                            >
                                                                {b.brand_name}
                                                            </option>
                                                        ),
                                                    )}
                                                </select>
                                            </div>

                                            {Array.isArray(
                                                createForm.data.brand_ids,
                                            ) &&
                                                createForm.data.brand_ids
                                                    .length > 0 && (
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        {createForm.data.brand_ids.map(
                                                            (id) => (
                                                                <button
                                                                    key={id}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        removeSelectedBrand(
                                                                            id,
                                                                        )
                                                                    }
                                                                    className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs text-stone-600 hover:bg-stone-100"
                                                                    title="Remove"
                                                                >
                                                                    <span>
                                                                        {brandNameById.get(
                                                                            id,
                                                                        ) ||
                                                                            "Brand"}
                                                                    </span>
                                                                    <span className="text-stone-400">
                                                                        ✕
                                                                    </span>
                                                                </button>
                                                            ),
                                                        )}
                                                    </div>
                                                )}

                                            {createForm.errors.brand_ids && (
                                                <div className="mt-1 text-xs text-red-600">
                                                    {
                                                        createForm.errors
                                                            .brand_ids
                                                    }
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium text-stone-600">
                                                Latitude
                                            </label>
                                            <input
                                                readOnly
                                                className="mt-1 w-full rounded-md border border-stone-300 bg-stone-100 px-3 py-2 text-sm text-stone-600 outline-none"
                                                value={createForm.data.latitude}
                                                onChange={(e) =>
                                                    createForm.setData(
                                                        "latitude",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Auto-filled"
                                            />
                                            {createForm.errors.latitude && (
                                                <div className="mt-1 text-xs text-red-600">
                                                    {createForm.errors.latitude}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium text-stone-600">
                                                Longitude
                                            </label>
                                            <input
                                                readOnly
                                                className="mt-1 w-full rounded-md border border-stone-300 bg-stone-100 px-3 py-2 text-sm text-stone-600 outline-none"
                                                value={
                                                    createForm.data.longitude
                                                }
                                                onChange={(e) =>
                                                    createForm.setData(
                                                        "longitude",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Auto-filled"
                                            />
                                            {createForm.errors.longitude && (
                                                <div className="mt-1 text-xs text-red-600">
                                                    {
                                                        createForm.errors
                                                            .longitude
                                                    }
                                                </div>
                                            )}
                                        </div>

                                         <div className="md:col-span-2">
                                            <div className="text-xs font-medium text-stone-600">
                                                Location Preview (Static for Testing)
                                            </div>
                                            <div className="mt-2 flex flex-col gap-2">
                                                {createForm.data.latitude && createForm.data.longitude ? (
                                                    <div className="flex h-40 items-center justify-center rounded-md border border-stone-300 bg-gradient-to-br from-blue-50 to-blue-100 text-sm text-blue-700">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <div className="text-3xl">
                                                                📍
                                                            </div>
                                                            <div className="font-medium">
                                                                {parseFloat(createForm.data.latitude).toFixed(4)}, {parseFloat(createForm.data.longitude).toFixed(4)}
                                                            </div>
                                                            <div className="text-xs text-stone-600">
                                                                (Random coordinates for testing)
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex h-40 items-center justify-center rounded-md border border-dashed border-stone-300 bg-stone-50 text-sm text-stone-400">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <div className="text-2xl">
                                                                📍
                                                            </div>
                                                            <div>
                                                                Select a city to auto-fill location
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
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
                                        Create Market
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {modal === "edit" && selected && (
                        <div className="w-full max-w-xl rounded-lg bg-white shadow-xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
                                <div className="text-sm font-semibold">
                                    Edit Market
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
                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-medium text-stone-600">
                                                Market Name *
                                            </label>
                                            <input
                                                className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                                value={
                                                    editForm.data.market_name
                                                }
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        "market_name",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {editForm.errors.market_name && (
                                                <div className="mt-1 text-xs text-red-600">
                                                    {
                                                        editForm.errors
                                                            .market_name
                                                    }
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium text-stone-600">
                                                Type *
                                            </label>
                                            <select
                                                className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 outline-none focus:border-emerald-600"
                                                value={
                                                    editForm.data.market_type
                                                }
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        "market_type",
                                                        e.target.value,
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Select type…
                                                </option>
                                                <option value="WET_MARKET">
                                                    Wet Market
                                                </option>
                                                <option value="DRY_MARKET">
                                                    Dry Market
                                                </option>
                                            </select>
                                            {editForm.errors.market_type && (
                                                <div className="mt-1 text-xs text-red-600">
                                                    {
                                                        editForm.errors
                                                            .market_type
                                                    }
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium text-stone-600">
                                                City *
                                            </label>
                                            <select
                                                className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 outline-none focus:border-emerald-600"
                                                value={editForm.data.city_id}
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        "city_id",
                                                        e.target.value,
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Select city…
                                                </option>
                                                {(cities || []).map((c) => (
                                                    <option
                                                        key={c.city_id}
                                                        value={c.city_id}
                                                    >
                                                        {c.city_name}
                                                    </option>
                                                ))}
                                            </select>
                                            {editForm.errors.city_id && (
                                                <div className="mt-1 text-xs text-red-600">
                                                    {editForm.errors.city_id}
                                                </div>
                                            )}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="text-xs font-medium text-stone-600">
                                                Full Address *
                                            </label>
                                            <input
                                                className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                                value={editForm.data.address}
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        "address",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {editForm.errors.address && (
                                                <div className="mt-1 text-xs text-red-600">
                                                    {editForm.errors.address}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium text-stone-600">
                                                Latitude
                                            </label>
                                            <input
                                                readOnly
                                                className="mt-1 w-full rounded-md border border-stone-300 bg-stone-100 px-3 py-2 text-sm text-stone-600 outline-none"
                                                value={editForm.data.latitude}
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        "latitude",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {editForm.errors.latitude && (
                                                <div className="mt-1 text-xs text-red-600">
                                                    {editForm.errors.latitude}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium text-stone-600">
                                                Longitude
                                            </label>
                                            <input
                                                readOnly
                                                className="mt-1 w-full rounded-md border border-stone-300 bg-stone-100 px-3 py-2 text-sm text-stone-600 outline-none"
                                                value={editForm.data.longitude}
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        "longitude",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {editForm.errors.longitude && (
                                                <div className="mt-1 text-xs text-red-600">
                                                    {editForm.errors.longitude}
                                                </div>
                                            )}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="text-xs font-medium text-stone-600">
                                                Manage Brands (add/remove)
                                            </label>
                                            <div className="mt-1">
                                                <select
                                                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 outline-none focus:border-emerald-600"
                                                    value={brandToAdd}
                                                    onChange={(e) => {
                                                        const id = e.target.value;
                                                        if (!id) {
                                                            setBrandToAdd("");
                                                            return;
                                                        }
                                                        const currentBrands = Array.isArray(selected.brands)
                                                            ? selected.brands.map((b) => b.brand_id)
                                                            : [];
                                                        if (!currentBrands.includes(id)) {
                                                            const updatedBrands = [
                                                                ...currentBrands,
                                                                id,
                                                            ];
                                                            setSelected({
                                                                ...selected,
                                                                brands: brands.filter((b) =>
                                                                    updatedBrands.includes(b.brand_id),
                                                                ),
                                                            });
                                                        }
                                                        setBrandToAdd("");
                                                    }}
                                                >
                                                    <option value="">
                                                        Add brand…
                                                    </option>
                                                    {brands
                                                        .filter(
                                                            (b) =>
                                                                !Array.isArray(
                                                                    selected.brands,
                                                                ) ||
                                                                !selected.brands
                                                                    .map(
                                                                        (sb) =>
                                                                            sb.brand_id,
                                                                    )
                                                                    .includes(b.brand_id),
                                                        )
                                                        .map((b) => (
                                                            <option
                                                                key={b.brand_id}
                                                                value={b.brand_id}
                                                            >
                                                                {b.brand_name}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>

                                            {Array.isArray(
                                                selected.brands,
                                            ) &&
                                                selected.brands.length > 0 && (
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        {selected.brands.map(
                                                            (b) => (
                                                                <button
                                                                    key={
                                                                        b.brand_id
                                                                    }
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setSelected(
                                                                            {
                                                                                ...selected,
                                                                                brands:
                                                                                    selected.brands.filter(
                                                                                        (
                                                                                            sb,
                                                                                        ) =>
                                                                                            sb.brand_id !==
                                                                                            b.brand_id,
                                                                                    ),
                                                                            },
                                                                        );
                                                                    }}
                                                                    className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs text-stone-600 hover:bg-stone-100"
                                                                    title="Remove"
                                                                >
                                                                    <span>
                                                                        {
                                                                            b.brand_name
                                                                        }
                                                                    </span>
                                                                    <span className="text-stone-400">
                                                                        ✕
                                                                    </span>
                                                                </button>
                                                            ),
                                                        )}
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
                        (() => {
                            const hasMonitoring = (selected.brands && selected.brands.length > 0) || selected.is_prepopulated;

                            const setInactive = () => {
                                if (!selected?.market_id) return;
                                deleteForm.clearErrors();
                                deleteForm.patch(`/markets/${selected.market_id}`, {
                                    data: { is_active: false },
                                    onSuccess: () => {
                                        closeModal();
                                        router.reload();
                                    },
                                });
                            };

                            if (hasMonitoring) {
                                return (
                                    <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
                                        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
                                            <div className="text-sm font-semibold">Deletion Not Allowed</div>
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
                                                <strong>{selected.market_name}</strong> cannot be deleted because it is attached to active monitoring reports or is a prepopulated record.
                                            </div>
                                            <div className="mt-2 text-xs text-stone-400">
                                                Please set the market to Inactive instead.
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
                                                onClick={setInactive}
                                                disabled={deleteForm.processing}
                                                className="rounded-md bg-amber-600 px-3 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
                                            >
                                                Set to Inactive
                                            </button>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
                                    <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
                                        <div className="text-sm font-semibold">Confirm Deletion</div>
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="rounded-md px-2 py-1 text-stone-400 hover:bg-stone-50 hover:text-stone-600"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <div className="p-5 text-center">
                                        <div className="text-3xl">🗑</div>
                                        <div className="mt-3 text-sm text-stone-600">Delete <strong>{selected.market_name}</strong>?</div>
                                        <div className="mt-1 text-xs text-stone-400">This action cannot be undone.</div>
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
                                            disabled={deleteForm.processing}
                                            className="rounded-md bg-red-700 px-3 py-2 text-sm font-medium text-white hover:bg-red-800 disabled:opacity-50"
                                        >
                                            Confirm Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })()
                    )}
                </div>
            )}
        </div>
    );
}

Index.layout = (page) => (
    <AppLayout title="Market Management" breadcrumb="Management → Market">
        {page}
    </AppLayout>
);
