import api from "./api";
import type { ApiResponse } from "./apiTypes";
import type { AuthResult } from "@/redux/auth/type";

export interface TeamMemberItem {
  id: string;
  email: string;
  status: "pending" | "accepted";
  invitedAt: string;
  acceptedAt?: string;
}

export interface TeamData {
  isOwner: boolean;
  members: TeamMemberItem[];
}

export const getTeamApi = async (): Promise<TeamData> => {
  const response = await api.get<ApiResponse<TeamData>>("/team/members");
  return response.data.data;
};

export const inviteTeamMemberApi = async (email: string): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>("/team/invite", { email });
  return response.data;
};

export const removeTeamMemberApi = async (id: string): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(`/team/members/${id}`);
  return response.data;
};

export interface InvitePreview {
  email: string;
  ownerName: string;
  alreadyRegistered: boolean;
}

export const getInvitePreviewApi = async (token: string): Promise<InvitePreview> => {
  const response = await api.get<ApiResponse<InvitePreview>>(`/team/invites/${token}`);
  return response.data.data;
};

export const acceptNewInviteApi = async (
  token: string,
  name: string,
  password: string,
): Promise<ApiResponse<AuthResult>> => {
  const response = await api.post<ApiResponse<AuthResult>>(`/team/invites/${token}/accept`, {
    name,
    password,
  });
  return response.data;
};

export const acceptExistingInviteApi = async (token: string): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>("/team/accept", { token });
  return response.data;
};
