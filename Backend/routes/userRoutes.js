import express from "express";
import {
  createUser,
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
  bulkUpdateUsers,
  assignRole,
  assignPermissions,
  assignLeavePolicy,
  assignSystemRole,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/", createUser);
router.get("/", listUsers);
router.put("/bulk-update", bulkUpdateUsers);
router.put("/assign-role", assignRole);
router.put("/assign-permissions", assignPermissions);
router.put("/assign-leave-policy", assignLeavePolicy);
router.put("/assign-system-role", assignSystemRole);
router.put("/:id", updateUser);
router.get("/:id", getUserById);
router.delete("/:id", deleteUser);

export default router;
