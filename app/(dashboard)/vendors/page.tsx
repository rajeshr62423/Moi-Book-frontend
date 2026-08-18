"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ConfirmDialog from "@/components/ConfirmDialog";
import PageHeader from "@/components/PageHeader";
import SortFilterBar from "@/components/SortFilterBar";
import { CATEGORY_LABEL_KEYS, VENDOR_STATUS_LABEL_KEYS } from "@/components/modals/AddVendorModal";
import { useI18n } from "@/lib/i18n";
import { useHideAppLoaderOnMount, useModal } from "@/lib/ui";
import { useSortFilter } from "@/lib/useSortFilter";
import { fetchVendors, removeVendor } from "@/redux/vendor/thunk";
import type { AppDispatch, RootState } from "@/redux/store";
import { extractApiErrorMessage } from "@/services/apiTypes";
import type { VendorItem } from "@/redux/vendor/type";
import { EditIcon, PlusIcon, TrashIcon, VendorsIcon } from "@/components/icons";

export default function VendorsPage() {
  useHideAppLoaderOnMount();
  const { t } = useI18n();
  const { openModal } = useModal();
  const dispatch = useDispatch<AppDispatch>();
  const { items: vendors, loaded } = useSelector((state: RootState) => state.vendor);
  const [deleting, setDeleting] = useState<VendorItem | null>(null);

  useEffect(() => {
    if (!loaded) dispatch(fetchVendors()).catch((err) => toast.error(extractApiErrorMessage(err, "Couldn't load vendors")));
  }, [dispatch, loaded]);

  async function confirmDelete() {
    if (!deleting) return;
    try {
      const response = await dispatch(removeVendor(deleting.id));
      toast.success(response.message);
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Couldn't delete the vendor"));
    } finally {
      setDeleting(null);
    }
  }

  const filterGroups = useMemo(
    () => [
      {
        key: "category",
        label: "Category",
        getValue: (v: VendorItem) => v.category,
        options: [
          { value: "catering", label: "Catering" },
          { value: "venue", label: "Venue" },
          { value: "photography", label: "Photography" },
          { value: "decoration", label: "Decoration" },
          { value: "entertainment", label: "Entertainment" },
          { value: "transport", label: "Transport" },
          { value: "others", label: "Others" },
        ],
      },
    ],
    []
  );
  const sortOptions = useMemo(
    () => [
      { value: "name-az", label: "Name A–Z", compare: (a: VendorItem, b: VendorItem) => a.name.localeCompare(b.name) },
      { value: "name-za", label: "Name Z–A", compare: (a: VendorItem, b: VendorItem) => b.name.localeCompare(a.name) },
    ],
    []
  );

  const sf = useSortFilter<VendorItem>(vendors, {
    searchFields: (v) => `${v.name} ${v.location}`,
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
        {loaded && vendors.length === 0 ? (
          <div className="template-empty">
            <VendorsIcon />
            <h3>{t("noVendorsYet")}</h3>
            <p>{t("noVendorsHint")}</p>
            <button className="btn" onClick={() => openModal("addVendor")}>
              <PlusIcon /> <span>{t("addVendor")}</span>
            </button>
          </div>
        ) : (
          <>
            <div className="vendor-grid">
              {sf.filtered.map((v) => (
                <div className="vendor-card" key={v.id}>
                  <div className="vendor-img-wrap">
                    {v.thumbnail ? (
                      <div className="vendor-img" style={{ backgroundImage: `url('${v.thumbnail}')` }} />
                    ) : (
                      <div className="vendor-img img-fallback">
                        <VendorsIcon className="img-fallback-icon" />
                      </div>
                    )}
                  </div>
                  <div className="vendor-body">
                    <div className="cat">{t(CATEGORY_LABEL_KEYS[v.category])}</div>
                    <div className="name">{v.name}</div>
                    <div className="ev-sub">{v.phone}</div>
                    <div className="vendor-foot">
                      <span>{v.location}</span>
                      <span className={`badge ${v.status}`}>{t(VENDOR_STATUS_LABEL_KEYS[v.status])}</span>
                    </div>
                    <div className="template-card-actions">
                      <button type="button" onClick={() => openModal("addVendor", v)} title={t("editVendor")}>
                        <EditIcon />
                        <span>{t("editVendor")}</span>
                      </button>
                      <button type="button" className="danger" onClick={() => setDeleting(v)} title={t("deleteVendor")}>
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pager">
              <span>
                {t("showing")} {sf.filtered.length} {t("of")} {vendors.length} {t("vendorsWord")}
              </span>
              <div className="nums">
                <span>&lt;</span>
                <span className="active">1</span>
                <span>&gt;</span>
              </div>
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        open={!!deleting}
        title={t("deleteVendorConfirmTitle")}
        body={t("deleteVendorConfirmBody")}
        cancelLabel={t("cancel")}
        confirmLabel={t("deleteVendor")}
        onCancel={() => setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
