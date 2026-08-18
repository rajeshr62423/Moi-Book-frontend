import api from "./api";
import type { ApiResponse } from "./apiTypes";

export interface UploadResult {
  url: string;
  publicId: string;
}

/** Generic image upload (event thumbnails, profile photos, ...) — backed by Cloudinary via POST /uploads. */
export const uploadImageApi = async (file: File): Promise<ApiResponse<UploadResult>> => {
  const formData = new FormData();
  formData.append("file", file);
  // api's axios instance defaults to Content-Type: application/json, and
  // axios JSON-stringifies a FormData body whenever the header still says
  // application/json (File objects have no enumerable props, so it comes
  // out as "{}" — the server then sees no file at all). Overriding the
  // header here keeps the FormData intact so axios's browser adapter can
  // set the real multipart boundary itself.
  const response = await api.post<ApiResponse<UploadResult>>("/uploads", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
