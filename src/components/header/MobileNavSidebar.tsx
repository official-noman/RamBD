"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useAppContext } from "@context/app-context";
import { IconButton } from "@component/buttons";
import Icon from "@component/icon/Icon";

// ─────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────
interface SubCategory {
    id: any;
    cate_name: string;
    cate_slug: string;
    sub_categories?: SubCategory[];
}

interface Category {
    id: any;
    name: string;
    slug: string;
    icon?: string;
    sub_categories?: SubCategory[];
}

// ─────────────────────────────────────────────────────
// Sidebar overlay styles (inline to avoid styled-components SSR issues)
// ─────────────────────────────────────────────────────
const overlayStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    pointerEvents: "auto",
    display: "flex",
};

const backdropStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
};

const panelStyle: React.CSSProperties = {
    position: "relative",
    width: "82vw",
    maxWidth: 320,
    height: "100%",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    boxShadow: "4px 0 20px rgba(0,0,0,0.18)",
    overflowY: "auto",
    animation: "slideInLeft 0.25s ease",
};

const headerBarStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 16px 12px",
    borderBottom: "1px solid #eee",
    position: "sticky",
    top: 0,
    background: "#fff",
    zIndex: 1,
};

const backBtnStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 4,
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#D23F57",
    fontWeight: 700,
    fontSize: 14,
    padding: "4px 0",
};

const closeBtnStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 22,
    color: "#333",
    lineHeight: 1,
    padding: 4,
};

const itemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 16px",
    borderBottom: "1px solid #f0f0f0",
    cursor: "pointer",
    textDecoration: "none",
    color: "#222",
    fontSize: 15,
    fontWeight: 500,
    transition: "background 0.15s",
};

const arrowStyle: React.CSSProperties = {
    color: "#D23F57",
    fontSize: 20,
    fontWeight: 700,
    lineHeight: 1,
};

// ─────────────────────────────────────────────────────
// Panel stack item – tracks where we are in the hierarchy
// ─────────────────────────────────────────────────────
interface PanelLevel {
    label: string;
    slug: string;
    items: SubCategory[];
}

// ─────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────
interface Props {
    open: boolean;
    onClose: () => void;
}

export default function MobileNavSidebar({ open, onClose }: Props) {
    const router = useRouter();
    const { state, dispatch } = useAppContext();
    const [categories, setCategories] = useState<Category[]>([]);
    const [panelStack, setPanelStack] = useState<PanelLevel[]>([]); // drill-down stack
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    // Fetch categories once
    useEffect(() => {
        const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.unicodeconverter.info").trim();
        fetch(`${apiBaseUrl}/home-menu`)
            .then(r => r.json())
            .then(data => {
                if (!data) return;

                // Build a map of children by parent_id, parent_slug, and category_id
                const childMap: Record<string, any[]> = {};
                if (Array.isArray(data.subCategory)) {
                    data.subCategory.forEach((sub: any) => {
                        const pid = String(sub.parent_id || "").trim().toLowerCase();
                        const pslug = String(sub.parent_slug || "").trim().toLowerCase();
                        const pcid = String(sub.category_id || "").trim().toLowerCase();

                        const keys = [pid, pslug, pcid].filter(k => k && k !== "0");
                        keys.forEach(k => {
                            if (!childMap[k]) childMap[k] = [];
                            // Avoid duplicates
                            if (!childMap[k].some((item: any) => item.id === sub.id)) {
                                childMap[k].push(sub);
                            }
                        });
                    });
                }

                // Helper to find the first non-empty children array
                const findChildren = (item: any, id: string) => {
                    const possibleKeys = [
                        "sub_categories",
                        "category_sub_categories",
                        "children",
                        "child_categories",
                        "subcategories",
                        "sub_category",
                        "child",
                        "sub_category_list",
                        "child_list",
                        "categories",
                        "subCategories",
                        "menuData"
                    ];
                    for (const key of possibleKeys) {
                        const val = item[key];
                        if (Array.isArray(val) && val.length > 0) return val;
                        // Handle cases where children might be inside an object (e.g. menuData.categories)
                        if (val && typeof val === "object") {
                            const subVal = (val as any).categories || (val as any).sub_categories || (val as any).items;
                            if (Array.isArray(subVal) && subVal.length > 0) return subVal;
                        }
                    }

                    const slug = String(item.cate_slug || item.slug || "").trim().toLowerCase();
                    const sid = String(id || "").trim().toLowerCase();

                    const fromID = sid ? childMap[sid] : null;
                    const fromSlug = slug ? childMap[slug] : null;
                    return fromID || fromSlug || [];
                };

                // Recursive function to map subcategories
                const mapSubCategories = (subs: any[]): SubCategory[] => {
                    return (subs || []).map((sub: any) => {
                        const sid = String(sub.id || sub.category_id || sub.cate_id || "").trim().toLowerCase();
                        const children = findChildren(sub, sid);
                        return {
                            id: sub.id || sub.category_id || sub.cate_id,
                            cate_name: sub.cate_name || sub.name || "Category",
                            cate_slug: sub.cate_slug || sub.slug || "",
                            sub_categories: mapSubCategories(children)
                        };
                    });
                };

                const menus = (data.menu || [])
                    .filter((m: any) => Number(m.checked) === 1)
                    .sort((a: any, b: any) => Number(a.menu_order) - Number(b.menu_order));

                const cats: Category[] = menus.map((m: any) => {
                    const cat = m.category || {};
                    const cid = String(cat.id || cat.category_id || cat.cate_id || "").trim().toLowerCase();
                    const children = findChildren(cat, cid);
                    return {
                        id: cat.id || cat.category_id || cat.cate_id,
                        name: cat.cate_name || cat.name || "Category",
                        slug: cat.cate_slug || cat.slug || "",
                        icon: cat.cate_icon || cat.icon,
                        sub_categories: mapSubCategories(children),
                    };
                });
                setCategories(cats);
            })
            .catch(() => { });
    }, []);

    // Reset panel stack when sidebar opens/closes
    useEffect(() => {
        if (!open) setPanelStack([]);
    }, [open]);

    if (!mounted || !open) return null;

    // Determine what's currently visible
    const isTop = panelStack.length === 0;
    const currentPanel = isTop ? null : panelStack[panelStack.length - 1];

    const handleCategoryClick = (slug: string, hasSubs: boolean, subs: SubCategory[] = [], label: string) => {
        if (hasSubs) {
            setPanelStack(prev => [...prev, { label, slug, items: subs }]);
        } else {
            router.push(`/category/${slug}`);
            onClose();
        }
    };

    const handleSubClick = (sub: SubCategory) => {
        const hasSubs = (sub.sub_categories?.length ?? 0) > 0;
        if (hasSubs) {
            setPanelStack(prev => [...prev, { label: sub.cate_name, slug: sub.cate_slug, items: sub.sub_categories! }]);
        } else {
            const path = [...panelStack.map(p => p.slug), sub.cate_slug].join("/");
            router.push(`/category/${path}`);
            onClose();
        }
    };

    const handleBack = () => {
        setPanelStack(prev => prev.slice(0, -1));
    };

    const handleLogout = () => {
        localStorage.removeItem("rambd_user");
        dispatch({ type: "LOGOUT" });
        onClose();
        router.push("/login");
    };

    const portal = (
        <div style={overlayStyle}>
            {/* Backdrop */}
            <div style={backdropStyle} onClick={onClose} />

            {/* Sidebar panel */}
            <div style={panelStyle}>
                {/* Header bar */}
                <div style={headerBarStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {!isTop && (
                            <button style={backBtnStyle} onClick={handleBack} aria-label="Go back">
                                ‹ Back
                            </button>
                        )}
                        {isTop && (
                            <span style={{ fontWeight: 700, fontSize: 16, color: "#222" }}>Menu</span>
                        )}
                        {!isTop && (
                            <span style={{ fontWeight: 700, fontSize: 15, color: "#222" }}>
                                {currentPanel?.label}
                            </span>
                        )}
                    </div>
                    <button style={closeBtnStyle} onClick={onClose} aria-label="Close menu">✕</button>
                </div>

                {/* Category list */}
                <div style={{ flex: 1 }}>
                    {isTop ? (
                        /* Top-level categories */
                        <>
                            {categories.map(cat => {
                                const hasSubs = (cat.sub_categories?.length ?? 0) > 0;
                                return (
                                    <div
                                        key={cat.id}
                                        style={itemStyle}
                                        onClick={() => handleCategoryClick(cat.slug, hasSubs, cat.sub_categories, cat.name)}
                                        onMouseEnter={e => (e.currentTarget.style.background = "#fef6f7")}
                                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                    >
                                        <span>{cat.name}</span>
                                        {hasSubs ? (
                                            <span style={arrowStyle}>›</span>
                                        ) : null}
                                    </div>
                                );
                            })}

                            {/* Extra links */}
                            <div style={{ borderTop: "2px solid #eee", marginTop: 8 }}>
                                <Link href="/" style={{ ...itemStyle, color: "#D23F57" }} onClick={onClose}>🏠 Home</Link>
                                {state.user ? (
                                    <>
                                        <Link href="/profile" style={{ ...itemStyle, display: "flex", alignItems: "center", gap: 8 }} onClick={onClose}>
                                            <div style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", background: "#f0f0f0" }}>
                                                {state.user.avatar ? (
                                                    <img src={state.user.avatar} alt="User" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                ) : (
                                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 16 }}>👤</div>
                                                )}
                                            </div>
                                            <span>{state.user.name || "My Account"}</span>
                                        </Link>
                                        <div style={{ ...itemStyle, color: "#D23F57" }} onClick={handleLogout}>
                                            🚪 Logout
                                        </div>
                                    </>
                                ) : (
                                    <Link href="/login" style={{ ...itemStyle }} onClick={onClose}>👤 Sign In / Account</Link>
                                )}
                            </div>
                        </>
                    ) : (
                        /* Sub-category drill-down */
                        <>
                            {/* Link to the parent category page itself */}
                            <div
                                style={{ ...itemStyle, background: "#fef6f7", fontWeight: 700, color: "#D23F57" }}
                                onClick={() => {
                                    if (currentPanel?.slug) {
                                        const path = panelStack.map(p => p.slug).join("/");
                                        router.push(`/category/${path}`);
                                        onClose();
                                    }
                                }}
                            >
                                View All in {currentPanel?.label}
                            </div>

                            {currentPanel?.items.map(sub => {
                                const hasSubs = (sub.sub_categories?.length ?? 0) > 0;
                                return (
                                    <div
                                        key={sub.id}
                                        style={itemStyle}
                                        onClick={() => handleSubClick(sub)}
                                        onMouseEnter={e => (e.currentTarget.style.background = "#fef6f7")}
                                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                    >
                                        <span>{sub.cate_name}</span>
                                        {hasSubs ? <span style={arrowStyle}>›</span> : null}
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>
            </div>

            <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
        </div>
    );

    // Render into a portal so it escapes any overflow:hidden containers
    const portalRoot = typeof document !== "undefined" ? document.body : null;
    return portalRoot ? createPortal(portal, portalRoot) : null;
}
