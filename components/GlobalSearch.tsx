"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { useOutsideClose } from "@/lib/useOutsideClose";
import { useDebouncedCallback } from "@/lib/useDebouncedCallback";
import { searchApi, type SearchResultItem, type SearchResultType } from "@/services/searchService";
import { EventsIcon, GuestsIcon, VendorsIcon, MoiIcon, LedgerIcon, SearchIcon } from "@/components/icons";

const RESULT_ICON: Record<SearchResultType, typeof EventsIcon> = {
  event: EventsIcon,
  guest: GuestsIcon,
  vendor: VendorsIcon,
  moi: MoiIcon,
  ledger: LedgerIcon,
};

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;

export default function GlobalSearch() {
  const { t } = useI18n();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const requestId = useRef(0);

  useOutsideClose([rootRef], () => setOpen(false), { active: open });

  const runSearch = useDebouncedCallback((trimmed: string) => {
    const id = ++requestId.current;
    setLoading(true);
    searchApi(trimmed)
      .then((items) => {
        if (requestId.current === id) {
          setResults(items);
          setLoading(false);
        }
      })
      .catch(() => {
        if (requestId.current === id) {
          setResults([]);
          setLoading(false);
        }
      });
  }, DEBOUNCE_MS);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < MIN_QUERY_LENGTH) return;
    runSearch(trimmed);
  }, [query, runSearch]);

  function goTo(item: SearchResultItem) {
    setOpen(false);
    setQuery("");
    router.push(item.link);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && results.length > 0) {
      goTo(results[0]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const showPanel = open && query.trim().length >= MIN_QUERY_LENGTH;

  return (
    <div className="global-search" ref={rootRef}>
      <div className="search-box glass">
        <SearchIcon />
        <input
          value={query}
          placeholder={t("searchDash")}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
      </div>
      {showPanel && (
        <div className="search-results open">
          <div className="dropdown-body">
            {loading ? (
              <div className="dropdown-item">
                <div className="dropdown-item-text">
                  <span>{t("searching")}</span>
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="dropdown-item">
                <div className="dropdown-item-text">
                  <span>{t("noSearchResults")}</span>
                </div>
              </div>
            ) : (
              results.map((item) => {
                const Icon = RESULT_ICON[item.type];
                return (
                  <div
                    className="dropdown-item"
                    key={`${item.type}-${item.id}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => goTo(item)}
                  >
                    <div className={`dropdown-item-icon${item.type === "vendor" ? " sage" : item.type === "ledger" ? " rose" : ""}`}>
                      <Icon />
                    </div>
                    <div className="dropdown-item-text">
                      <b>{item.title}</b>
                      {item.subtitle && <span>{item.subtitle}</span>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
