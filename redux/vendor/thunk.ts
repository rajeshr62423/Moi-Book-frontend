import { AppDispatch } from "../store";

import {
  vendorListRequest,
  vendorListSuccess,
  vendorListFailure,
  vendorSaveRequest,
  vendorSaveSuccess,
  vendorSaveFailure,
  vendorDeleteRequest,
  vendorDeleteSuccess,
  vendorDeleteFailure,
} from "./action";

import { listVendorsApi, createVendorApi, updateVendorApi, deleteVendorApi } from "@/services/vendorService";
import { extractApiErrorMessage } from "@/services/apiTypes";
import type { VendorInput } from "./type";

export const fetchVendors = () => async (dispatch: AppDispatch) => {
  dispatch(vendorListRequest());
  try {
    const items = await listVendorsApi();
    dispatch(vendorListSuccess(items));
    return items;
  } catch (error) {
    const message = extractApiErrorMessage(error, "Couldn't load vendors");
    dispatch(vendorListFailure(message));
    throw new Error(message);
  }
};

export const saveVendor = (payload: VendorInput, editingId?: string) => async (dispatch: AppDispatch) => {
  dispatch(vendorSaveRequest());
  try {
    const response = editingId ? await updateVendorApi(editingId, payload) : await createVendorApi(payload);
    dispatch(vendorSaveSuccess(response.data));
    return response;
  } catch (error) {
    const message = extractApiErrorMessage(error, "Couldn't save the vendor");
    dispatch(vendorSaveFailure(message));
    throw new Error(message);
  }
};

export const removeVendor = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(vendorDeleteRequest());
  try {
    const response = await deleteVendorApi(id);
    dispatch(vendorDeleteSuccess(id));
    return response;
  } catch (error) {
    const message = extractApiErrorMessage(error, "Couldn't delete the vendor");
    dispatch(vendorDeleteFailure(message));
    throw new Error(message);
  }
};
