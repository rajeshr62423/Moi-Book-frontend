"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import ModalShell from "./ModalShell";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useModal } from "@/lib/ui";
import { useI18n } from "@/lib/i18n";
import { extractApiErrorMessage } from "@/services/apiTypes";
import { getTeamApi, inviteTeamMemberApi, removeTeamMemberApi, type TeamData, type TeamMemberItem } from "@/services/teamService";
import { TeamIcon, TrashIcon } from "@/components/icons";

interface InviteFormValues {
  email: string;
}

export default function InviteTeamModal() {
  const { t } = useI18n();
  const { activeModal, closeModal } = useModal();
  const isOpen = activeModal === "inviteTeam";

  const [team, setTeam] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<TeamMemberItem | null>(null);

  async function loadTeam() {
    try {
      const data = await getTeamApi();
      setTeam(data);
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Couldn't load your team"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isOpen) return;
    getTeamApi()
      .then(setTeam)
      .catch((err) => toast.error(extractApiErrorMessage(err, "Couldn't load your team")))
      .finally(() => setLoading(false));
  }, [isOpen]);

  const formik = useFormik<InviteFormValues>({
    initialValues: { email: "" },
    validateOnChange: false,
    validateOnBlur: false,
    validate: (values) => {
      const errors: Partial<Record<keyof InviteFormValues, boolean>> = {};
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = true;
      return errors;
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await inviteTeamMemberApi(values.email);
        toast.success(response.message);
        resetForm();
        await loadTeam();
      } catch (err) {
        toast.error(extractApiErrorMessage(err, "Couldn't send the invite"));
      } finally {
        setSubmitting(false);
      }
    },
  });

  async function confirmRemove() {
    if (!removing) return;
    try {
      const response = await removeTeamMemberApi(removing.id);
      toast.success(response.message);
      await loadTeam();
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Couldn't remove the team member"));
    } finally {
      setRemoving(null);
    }
  }

  return (
    <>
      <ModalShell
        name="inviteTeam"
        title={t("inviteTeam")}
        onSubmit={formik.handleSubmit}
        wide={false}
        footer={
          team?.isOwner !== false ? (
            <button type="submit" className="btn" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? "..." : t("sendInvite")}
            </button>
          ) : (
            <button type="button" className="btn ghost" onClick={closeModal}>
              {t("cancel")}
            </button>
          )
        }
      >
        {team?.isOwner === false ? (
          <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "0 0 16px" }}>{t("notTeamOwnerHint")}</p>
        ) : (
          <div className={`field${formik.errors.email ? " has-error" : ""}`}>
            <label>{t("teamMemberEmailField")}</label>
            <input
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              placeholder="teammate@example.com"
              required
            />
          </div>
        )}

        <div style={{ marginTop: 20 }}>
          <h3 style={{ fontSize: 13, margin: "0 0 10px", color: "var(--brown)" }}>{t("teamMembersListTitle")}</h3>
          {loading ? (
            <p style={{ fontSize: 12.5, color: "var(--muted)" }}>…</p>
          ) : !team || team.members.length === 0 ? (
            <div className="template-empty" style={{ padding: "18px 8px" }}>
              <TeamIcon />
              <p>{t("noTeamMembersYet")}</p>
            </div>
          ) : (
            <div className="attn-list">
              {team.members.map((m) => (
                <div className="attn-item" key={m.id}>
                  <div className="attn-ico" style={{ background: "var(--sage-bg)", color: "var(--sage)" }}>
                    <TeamIcon />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <b>{m.email}</b>
                    <span>{m.status === "accepted" ? t("teamStatusAccepted") : t("teamStatusPending")}</span>
                  </div>
                  {team.isOwner && (
                    <div className="row-actions">
                      <button type="button" title={t("removeMember")} onClick={() => setRemoving(m)}>
                        <TrashIcon />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </ModalShell>

      <ConfirmDialog
        open={!!removing}
        title={t("removeMemberConfirmTitle")}
        body={t("removeMemberConfirmBody")}
        cancelLabel={t("cancel")}
        confirmLabel={t("removeMember")}
        onCancel={() => setRemoving(null)}
        onConfirm={confirmRemove}
      />
    </>
  );
}
