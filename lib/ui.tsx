"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* ---------------------------------------------------------------
   Sidebar (mobile open/close)
   --------------------------------------------------------------- */
interface SidebarContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}
const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within UIProvider");
  return ctx;
}

/* ---------------------------------------------------------------
   Toasts
   --------------------------------------------------------------- */
interface ToastEntry {
  id: number;
  message: string;
  leaving?: boolean;
}
interface ToastContextValue {
  toasts: ToastEntry[];
  showToast: (message: string) => void;
}
const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within UIProvider");
  return ctx;
}

/* ---------------------------------------------------------------
   App loader (route-transition overlay, mirrors original min-display-time)
   --------------------------------------------------------------- */
interface AppLoaderContextValue {
  isLoading: boolean;
  show: () => void;
  hide: () => void;
}
const AppLoaderContext = createContext<AppLoaderContextValue | null>(null);

export function useAppLoader() {
  const ctx = useContext(AppLoaderContext);
  if (!ctx) throw new Error("useAppLoader must be used within UIProvider");
  return ctx;
}

/** Call from a page's top-level component to hide the transition
 * overlay once the page has mounted (mirrors goToView()'s min-display-time). */
export function useHideAppLoaderOnMount() {
  const { hide } = useAppLoader();
  useEffect(() => {
    hide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

const APP_LOADER_MIN_MS = 380;

/* ---------------------------------------------------------------
   Modals
   --------------------------------------------------------------- */
export type ModalName = "createEvent" | "viewEvent" | "addGuest" | "addVendor" | "createMoi" | "addLedger";
interface ModalContextValue {
  activeModal: ModalName | null;
  modalPayload: unknown;
  openModal: (name: ModalName, payload?: unknown) => void;
  closeModal: () => void;
}
const ModalContext = createContext<ModalContextValue | null>(null);

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within UIProvider");
  return ctx;
}

/* ---------------------------------------------------------------
   Combined provider
   --------------------------------------------------------------- */
export function UIProvider({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarValue = useMemo<SidebarContextValue>(
    () => ({
      isOpen: sidebarOpen,
      open: () => setSidebarOpen(true),
      close: () => setSidebarOpen(false),
      toggle: () => setSidebarOpen((v) => !v),
    }),
    [sidebarOpen]
  );

  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const toastIdRef = useRef(0);
  const showToast = useCallback((message: string) => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 300);
    }, 3200);
  }, []);
  const toastValue = useMemo<ToastContextValue>(() => ({ toasts, showToast }), [toasts, showToast]);

  const [isLoading, setIsLoading] = useState(false);
  const loaderTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loaderStartRef = useRef(0);
  const show = useCallback(() => {
    if (loaderTimerRef.current) clearTimeout(loaderTimerRef.current);
    loaderStartRef.current = performance.now();
    setIsLoading(true);
  }, []);
  const hide = useCallback(() => {
    const elapsed = performance.now() - loaderStartRef.current;
    const remaining = Math.max(0, APP_LOADER_MIN_MS - elapsed);
    if (loaderTimerRef.current) clearTimeout(loaderTimerRef.current);
    loaderTimerRef.current = setTimeout(() => setIsLoading(false), remaining);
  }, []);
  const appLoaderValue = useMemo<AppLoaderContextValue>(() => ({ isLoading, show, hide }), [isLoading, show, hide]);

  const [activeModal, setActiveModal] = useState<ModalName | null>(null);
  const [modalPayload, setModalPayload] = useState<unknown>(null);
  const modalValue = useMemo<ModalContextValue>(
    () => ({
      activeModal,
      modalPayload,
      openModal: (name: ModalName, payload: unknown = null) => {
        setActiveModal(name);
        setModalPayload(payload);
      },
      closeModal: () => {
        setActiveModal(null);
        setModalPayload(null);
      },
    }),
    [activeModal, modalPayload]
  );

  return (
    <SidebarContext.Provider value={sidebarValue}>
      <ToastContext.Provider value={toastValue}>
        <AppLoaderContext.Provider value={appLoaderValue}>
          <ModalContext.Provider value={modalValue}>{children}</ModalContext.Provider>
        </AppLoaderContext.Provider>
      </ToastContext.Provider>
    </SidebarContext.Provider>
  );
}
