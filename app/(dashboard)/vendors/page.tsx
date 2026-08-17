"use client";

import { useMemo } from "react";
import PageHeader from "@/components/PageHeader";
import SortFilterBar from "@/components/SortFilterBar";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { useHideAppLoaderOnMount, useModal } from "@/lib/ui";
import { useSortFilter } from "@/lib/useSortFilter";
import { vendors } from "@/lib/data";
import type { VendorItem } from "@/lib/types";
import { PlusIcon, StarIcon } from "@/components/icons";

export default function VendorsPage() {
  useHideAppLoaderOnMount();
  const { t } = useI18n();
  const { openModal } = useModal();

  const filterGroups = useMemo(
    () => [
      {
        key: "cat",
        label: "Category",
        getValue: (v: VendorItem) => v.categoryKey,
        options: [
          { value: "catCatering", label: "Catering" },
          { value: "catVenueChip", label: "Venue" },
          { value: "catPhotography", label: "Photography" },
          { value: "catDecoration", label: "Decoration" },
          { value: "catEntertainment", label: "Entertainment" },
          { value: "catTransport", label: "Transport" },
          { value: "catOthers", label: "Others" },
        ],
      },
    ],
    []
  );
  const sortOptions = useMemo(
    () => [
      { value: "name-az", label: "Name A–Z", compare: (a: VendorItem, b: VendorItem) => a.name.localeCompare(b.name) },
      { value: "name-za", label: "Name Z–A", compare: (a: VendorItem, b: VendorItem) => b.name.localeCompare(a.name) },
      { value: "rating-hl", label: "Rating: High → Low", compare: (a: VendorItem, b: VendorItem) => b.rating - a.rating },
      { value: "rating-lh", label: "Rating: Low → High", compare: (a: VendorItem, b: VendorItem) => a.rating - b.rating },
    ],
    []
  );

  const sf = useSortFilter<VendorItem>(vendors, {
    searchFields: (v) => `${v.name} ${v.category}`,
    filterGroups,
    sortOptions,
  });

  return (
    <>
      <PageHeader
        title={t("vendorsPageTitle")}
        actions={
          <button className="btn" onClick={() => openModal("addVendor")}>
            <PlusIcon /> <span>{t("addVendor")}</span>
          </button>
        }
      />
      <SortFilterBar state={sf} filterGroups={filterGroups} sortOptions={sortOptions} searchPlaceholder="Search vendors..." />
      <div className="glass">
        <div className="vendor-grid">
          {sf.filtered.map((v) => (
            <div className="vendor-card" key={v.id}>
              <div className="vendor-img-wrap">
                <div className="vendor-img" style={{ backgroundImage: `url('${v.image}')` }} />
              </div>
              <div className="vendor-body">
                <div className="cat">{t(v.categoryKey as TranslationKey)}</div>
                <div className="name">{v.name}</div>
                <div className="vendor-rating">
                  <StarIcon /> {v.rating} ({v.reviews})
                </div>
                <div className="ev-sub">{v.phone}</div>
                <div className="vendor-foot">
                  <span>{v.location}</span>
                  <span className={`badge ${v.status}`}>{t(v.statusLabelKey as TranslationKey)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="pager">
          <span>
            {t("showing")} {sf.filtered.length} {t("of")} 18 {t("vendorsWord")}
          </span>
          <div className="nums">
            <span>&lt;</span>
            <span className="active">1</span>
            <span>2</span>
            <span>3</span>
            <span>&gt;</span>
          </div>
        </div>
      </div>
    </>
  );
}
