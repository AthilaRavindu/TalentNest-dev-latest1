const backendDomin = "http://localhost:5000";

const SummaryApi = {
  // Authentication
  adminLogin: {
    url: `${backendDomin}/api/admin/admin-login`,
    method: "post",
  },

  // User Management
  allUser: {
    url: `${backendDomin}/api/users/`,
    method: "get",
  },
  getUserById: {
    url: `${backendDomin}/api/users`,
    method: "get",
  },
  createUser: {
    url: `${backendDomin}/api/users/`,
    method: "post",
  },
  updateUser: {
    url: `${backendDomin}/api/users`,
    method: "put",
  },
  deleteUser: {
    url: `${backendDomin}/api/users`,
    method: "delete",
  },

  // Bulk Update Operations
  bulkUpdateUsers: {
    url: `${backendDomin}/api/users/bulk-update`,
    method: "put",
  },
  assignRole: {
    url: `${backendDomin}/api/users/assign-role`,
    method: "put",
  },
  assignPermissions: {
    url: `${backendDomin}/api/users/assign-permissions`,
    method: "put",
  },
  assignLeavePolicy: {
    url: `${backendDomin}/api/users/assign-leave-policy`,
    method: "put",
  },
  assignSystemRole: {
    url: `${backendDomin}/api/users/assign-system-role`,
    method: "put",
  },
};

export default SummaryApi;
