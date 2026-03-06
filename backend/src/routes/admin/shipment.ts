import { Hono } from "hono";
import { ShipmentController } from "../../controllers/admin/shipmentController";


const shipment = new Hono();

shipment.get("/", ShipmentController.getShipments);
shipment.get("/:id", ShipmentController.getShipmentById);
shipment.put("/:id/carrier", ShipmentController.updateShipmentCarrier);
shipment.put("/:id/status", ShipmentController.updateShipmentStatus);
// shipment.put("/:id/status", ShipmentController.updateShipmentStatus);
// shipment.post("/", ShipmentController.createShipment);
// shipment.put("/:id", ShipmentController.updateShipment);
// shipment.delete("/:id", ShipmentController.deleteShipment);

export default shipment;