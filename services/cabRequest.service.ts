import { CabRequest, Vendor } from "@prisma/client";
import prisma from "../lib/prisma";
import { notifyVendor } from "../lib/snsClient";
import { sendEmailNotification } from "../lib/sesClient";

export type CreateCabRequest = {
  employeeId: string;
  employeeName: string;
  pickupLocation: string;
  dropLocation: string;
  pickupTime: string;
  projectCode: string;
  phoneNumber: string;
  expireDate?: string;
};

export type UpdateCabRequest = {
  id: number;
  employeeId: string;
  employeeName: string;
  pickupLocation?: string;
  dropLocation?: string;
  pickupTime?: string;
  status?: string;
  routeId?: number;
  vendorId?: number;
};

export type GetCabRequests = {
  filters?: {
    employeeId?: string;
    routeId?: number;
    status?: string;
  };
};

export const createCabRequest = async ({
  employeeName,
  employeeId,
  pickupLocation,
  dropLocation,
  pickupTime,
  expireDate,
  phoneNumber,
  projectCode,
}: CreateCabRequest) => {
  const result = await prisma.cabRequest.create({
    data: {
      employeeName,
      employeeId,
      phoneNumber,
      projectCode,
      pickupLocation,
      dropLocation,
      pickupTime,
      expireDate: expireDate || pickupTime,
      status: "PENDING",
    },
  });

  if (result) {
    try {
      await sendEmailNotification(
        {
          employeeName,
          phoneNumber,
          pickupLocation,
          dropLocation,
          pickupTime,
        },
        process.env.ADMIN_ADDRESSES || "",
        {
          SourceArn: `${process.env.EMAIL_SOURCE_ARN}`,
          Source: `${process.env.EMAIL_SOURCE}`,
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  return result;
};

export const updateCabRequest = async ({
  id,
  employeeName,
  employeeId,
  pickupLocation,
  dropLocation,
  pickupTime,
  status,
  routeId,
  vendorId,
}: UpdateCabRequest) => {
  const result = await prisma.cabRequest.update({
    where: {
      id,
    },
    data: {
      employeeName,
      employeeId,
      pickupLocation,
      dropLocation,
      pickupTime,
      status,
      routeId,
      vendorId,
    },
  });
  if (result) {
    const vendor = await prisma.vendor.findFirst({
      where: {
        id: vendorId,
      },
    });

    const employee: CabRequest = await prisma.cabRequest.findFirstOrThrow({
      where: {
        id,
      },
    });
    const {
      employeeName,
      pickupLocation,
      dropLocation,
      pickupTime,
      phoneNumber,
    } = employee;

    await notifyVendor(vendor?.phoneNumber, {
      employeeName,
      pickupLocation,
      dropLocation,
      pickupTime,
      phoneNumber,
    });
  }
  return result;
};

export const getCabRequests = async (opts?: GetCabRequests) => {
  const { employeeId, routeId, status } = opts?.filters ?? {};
  const result = await prisma.cabRequest.findMany({
    where: {
      employeeId,
      routeId,
      status,
      expireDate: {
        gte: new Date().toISOString(),
      },
    },
  });
  return result;
};
