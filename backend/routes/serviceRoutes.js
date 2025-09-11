const express = require("express");
const router = express.Router();
const Service = require("../models/Service");

/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the service
 *         name:
 *           type: string
 *           description: Name of the service
 *         description:
 *           type: string
 *           description: Description of the service
 *         price:
 *           type: number
 *           description: Price of the service
 *         duration:
 *           type: string
 *           description: Duration of the service
 *         category:
 *           type: string
 *           description: Category of the service
 *         image:
 *           type: string
 *           description: URL of the service image
 *         isAvailable:
 *           type: boolean
 *           description: Availability status of the service
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the service was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date when the service was last updated
 *       example:
 *         _id: 60d5f4a9e6b8a425f4c7f9b1
 *         name: "Hair Coloring"
 *         description: "Professional hair coloring service"
 *         price: 75.99
 *         duration: "2 hours"
 *         category: "Hair Services"
 *         image: "/uploads/service.jpg"
 *         isAvailable: true
 *         createdAt: 2023-06-28T10:00:00.000Z
 *         updatedAt: 2023-06-28T10:00:00.000Z
 * 
 *     ServiceInput:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the service
 *         description:
 *           type: string
 *           description: Description of the service
 *         price:
 *           type: number
 *           description: Price of the service
 *         duration:
 *           type: string
 *           description: Duration of the service
 *         category:
 *           type: string
 *           description: Category of the service
 *         image:
 *           type: string
 *           description: URL of the service image
 *         isAvailable:
 *           type: boolean
 *           description: Availability status of the service
 *       example:
 *         name: "Hair Coloring"
 *         description: "Professional hair coloring service"
 *         price: 75.99
 *         duration: "2 hours"
 *         category: "Hair Services"
 *         image: "/uploads/service.jpg"
 *         isAvailable: true
 * 
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: JWT token for authentication
 */

/**
 * @swagger
 * tags:
 *   - name: Services
 *     description: Service management API
 */

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of all services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 *       500:
 *         description: Server error
 */
router.get("/", async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Get a single service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       404:
 *         description: Service not found
 *       500:
 *         description: Server error
 */
router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create a new service
 *     tags: [Services]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServiceInput'
 *     responses:
 *       201:
 *         description: Service created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       400:
 *         description: Bad request - invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/", async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Update a service
 *     tags: [Services]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServiceInput'
 *     responses:
 *       200:
 *         description: Service updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       400:
 *         description: Bad request - invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Service not found
 *       500:
 *         description: Server error
 */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Delete a service
 *     tags: [Services]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Service not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json({ message: "Service deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;