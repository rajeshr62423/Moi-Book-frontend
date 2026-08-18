"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import PageHeader from "@/components/PageHeader";
import TemplateFormModal from "@/components/modals/TemplateFormModal";
import { useI18n } from "@/lib/i18n";
import { useHideAppLoaderOnMount } from "@/lib/ui";
import { listTemplatesApi, deleteTemplateApi } from "@/services/templateService";
import { extractApiErrorMessage } from "@/services/apiTypes";
import type { Template } from "@/services/templateTypes";
import { ChevronLeftIcon, DocumentIcon, EditIcon, MailIcon, PlusIcon, TrashIcon } from "@/components/icons";

export default function TemplatesPage() {
  useHideAppLoaderOnMount();
  const { t } = useI18n();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Template | null>(null);
  const [deleting, setDeleting] = useState<Template | null>(null);

  useEffect(() => {
    listTemplatesApi()
      .then(setTemplates)
      .catch((err) => toast.error(extractApiErrorMessage(err, "Couldn't load templates")))
      .finally(() => setLoading(false));
  }, []);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(template: Template) {
    setEditing(template);
    setFormOpen(true);
  }

  function handleSaved(saved: Template) {
    setTemplates((prev) => {
      const exists = prev.some((tpl) => tpl.id === saved.id);
      return exists ? prev.map((tpl) => (tpl.id === saved.id ? saved : tpl)) : [saved, ...prev];
    });
    setFormOpen(false);
  }

  async function confirmDelete() {
    if (!deleting) return;
    try {
      const response = await deleteTemplateApi(deleting.id);
      toast.success(response.message);
      setTemplates((prev) => prev.filter((tpl) => tpl.id !== deleting.id));
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Couldn't delete the template"));
    } finally {
      setDeleting(null);
    }
  }

  return (
    <>
      <PageHeader
        title={t("templatesPageTitle")}
        backButton={
          <Link href="/settings" className="icon-btn" aria-label="Back to Settings">
            <ChevronLeftIcon />
          </Link>
        }
        actions={
          <button className="btn" onClick={openCreate}>
            <PlusIcon /> <span>{t("newTemplate")}</span>
          </button>
        }
      />

      <div className="glass" id="view-templates">
        {!loading && templates.length === 0 ? (
          <div className="template-empty">
            <MailIcon />
            <h3>{t("noTemplatesYet")}</h3>
            <p>{t("noTemplatesHint")}</p>
            <button className="btn" onClick={openCreate}>
              <PlusIcon /> <span>{t("newTemplate")}</span>
            </button>
          </div>
        ) : (
          <div className="template-grid">
            {templates.map((template) => (
              <div className="template-card" key={template.id}>
                <div className="template-card-top">
                  <div className="template-card-icon">
                    <DocumentIcon />
                  </div>
                  {template.isDefault && <span className="badge confirmed">{t("defaultBadge")}</span>}
                </div>
                <div className="template-card-name">{template.name}</div>
                <div className="template-card-subject">{template.subject}</div>
                <p className="template-card-body">{template.body}</p>
                <div className="template-card-actions">
                  <button type="button" onClick={() => openEdit(template)} title={t("editTemplate")}>
                    <EditIcon />
                    <span>{t("editTemplate")}</span>
                  </button>
                  <button type="button" className="danger" onClick={() => setDeleting(template)} title={t("deleteTemplate")}>
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <TemplateFormModal open={formOpen} editing={editing} onClose={() => setFormOpen(false)} onSaved={handleSaved} />

      <div
        className={`modal-overlay${deleting ? " open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setDeleting(null);
        }}
      >
        <div className="modal" style={{ maxWidth: 380 }}>
          <div className="modal-body" style={{ textAlign: "center", padding: "30px 24px 10px" }}>
            <h3 style={{ margin: "0 0 8px", fontFamily: "'Playfair Display',serif", color: "var(--brown)" }}>
              {t("deleteTemplateConfirmTitle")}
            </h3>
            <p style={{ color: "var(--muted)", fontSize: 13, margin: 0 }}>{t("deleteTemplateConfirmBody")}</p>
          </div>
          <div className="modal-foot" style={{ justifyContent: "center" }}>
            <button type="button" className="btn ghost" onClick={() => setDeleting(null)}>
              {t("cancel")}
            </button>
            <button type="button" className="btn danger" onClick={confirmDelete}>
              {t("deleteTemplate")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
