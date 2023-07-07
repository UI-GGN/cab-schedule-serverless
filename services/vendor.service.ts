import prisma from "../lib/prisma";

export type CreateVendor = {
  name: string;
  vehicles?: {
    id: string;
    driverName: string;
  };
  cabRequests?: any;
  phoneNumber: string;
};

export type UpdateVendor = {
  id: number;
  name?: string;
  phoneNumber?: string;
};

export const getVendors = async () => {
  const result = await prisma.vendor.findMany({
    where: {},
  });
  return result;
};

export const createVendor = async ({
  name,
  vehicles,
  phoneNumber,
  cabRequests,
}: CreateVendor) => {
  const result = await prisma.vendor.create({
    data: {
      phoneNumber,
      name,
      cabRequests: cabRequests ? cabRequests : undefined,
      vehicles: vehicles
        ? {
            create: {
              ...vehicles,
            },
          }
        : undefined,
    },
  });
  return result;
};

export const updateVendor = async ({ id, name, phoneNumber }: UpdateVendor) => {
  const result = await prisma.vendor.update({
    where: {
      id,
    },
    data: {
      name,
      phoneNumber,
    },
  });
  return result;
};
