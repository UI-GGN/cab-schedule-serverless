import { VercelRequest, VercelResponse } from "@vercel/node";
import { createVehicle, getVehicles } from "../../../services/vehicle.service";

const handler = (req: VercelRequest, res: VercelResponse) => {
  if (req.method === "GET") {
    return res.json(getVehiclesController(req, res));
  }
  if (req.method === "POST") {
    return res.json(createVehicleController(req, res));
  }
  return res.status(404);
};

const getVehiclesController = async (
  req: VercelRequest,
  res: VercelResponse
) => {
  const { vendorId } = req.query;
  const result = await getVehicles({
    filters: {
      vendorId: parseInt(vendorId as string),
    },
  });
  res.status(200).json(result);
};

const createVehicleController = async (
  req: VercelRequest,
  res: VercelResponse
) => {
  const body = req.body;
  const result = await createVehicle({
    id: body.id,
    driverName: body.driverName,
    vendorId: body.vendorId,
    vendor: body.vendor,
  });
  res.status(200).send(result);
};

export default handler;