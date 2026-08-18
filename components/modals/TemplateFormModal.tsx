"use client";

import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";
import { useOutsideClose } from "@/lib/useOutsideClose";
import { useI18n } from "@/lib/i18n";
import { createTemplateApi, updateTemplateApi } from "@/services/templateService";
import { extractApiErrorMessage } from "@/services/apiTypes";
import Checkbox from "@/components/ui/Checkbox";
import { CloseIcon } from "@/components/icons";
import type { Template, TemplateInput } from "@/services/templateTypes";

interface TemplateFormModalProps {
  open: boolean;
  editing: Template | null;
  onClose: () => void;
  onSaved: (template: Template) => void;
}

export default function TemplateFormModal({ open, editing, onClose, onSaved }: TemplateFormModalProps) {
  const { t } = useI18n();

  useBodyScrollLock(open);
  useOutsideClose([], onClose, { active: open });

  const formik = useFormik<TemplateInput>({
    enableReinitialize: true,
    initialValues: {
      name: editing?.name ?? "",
      subject: editing?.subject ?? "",
      body: editing?.body ?? "",
      isDefault: editing?.isDefault ?? false,
    },
    validateOnChange: false,
    validateOnBlur: false,
    validate: (values) => {
      const errors: { name?: boolean; subject?: boolean; body?: boolean } = {};
      if (!values.name.trim()) errors.name = true;
      if (!values.subject.trim()) errors.subject = true;
      if (!values.body.trim()) errors.body = true;
      return errors;
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = editing ? await updateTemplateApi(editing.id, values) : await createTemplateApi(values);
        toast.success(response.message);
        onSaved(response.data);
        resetForm();
      } catch (err) {
        toast.error(extractApiErrorMessage(err, "Couldn't save the template"));
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div
      className={`modal-overlay${open ? " open" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <div className="modal-head">
          <h3>{editing ? t("editTemplate") : t("newTemplate")}</h3>
          <button type="button" className="modal-close" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="modal-body">
            <div className={`field${formik.errors.name ? " has-error" : ""}`}>
              <label>{t("templateNameField")}</label>
              <input
                name="name"
                placeholder="e.g. Wedding Invitation"
                value={formik.values.name}
                onChange={formik.handleChange}
                required
              />
            </div>
            <div className={`field${formik.errors.subject ? " has-error" : ""}`}>
              <label>{t("templateSubjectField")}</label>
              <input
                name="subject"
                placeholder="You're invited to {{eventName}}!"
                value={formik.values.subject}
                onChange={formik.handleChange}
                required
              />
            </div>
            <div className={`field${formik.errors.body ? " has-error" : ""}`}>
              <label>{t("templateBodyField")}</label>
              <textarea
                name="body"
                rows={7}
                placeholder="Dear {{guestName}}, you're warmly invited to {{eventName}}..."
                value={formik.values.body}
                onChange={formik.handleChange}
                required
              />
              <span className="field-hint">{t("templateBodyHint")}</span>
            </div>
            <div className="field">
              <Checkbox
                id="templateIsDefault"
                label={t("setAsDefault")}
                checked={!!formik.values.isDefault}
                onChange={(checked) => formik.setFieldValue("isDefault", checked)}
              />
            </div>
          </div>
          <div className="modal-foot">
            <button type="button" className="btn ghost" onClick={onClose}>
              {t("cancel")}
            </button>
            <button type="submit" className="btn" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? "..." : t("saveTemplate")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
