import { VercelRequest, VercelResponse } from "@vercel/node";
import { updateVendor } from "../../../services/vendor.service";

const handler = (req: VercelRequest, res: VercelResponse) => {
  if (req.method === "PUT") {
    return updateVendorController(req, res);
  }
  if (req.method === "OPTIONS") {
    return res.status(200).json({ body: "OK" });
  }
  return res.status(404);
};

const updateVendorController = async (
  req: VercelRequest,
  res: VercelResponse
) => {
  const body = req.body;
  const { id } = req.query;
  const result = await updateVendor({
    id: parseInt(id as string),
    name: body.name,
    phoneNumber: body.phoneNumber,
  });
  res.status(200).json(result);
};

export default handler;
