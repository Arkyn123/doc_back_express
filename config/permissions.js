const permissions = {
  admin: {
    role: "admin",
  },
  // SDM: {
  //   role: "SDM",
  // },
  SDM_Secretary_Check: {
    role: "SDM_Secretary_Check",
  },
  SDM_Labor_Check: {
    role: "SDM_Labor_Check",
  },
  SDM_Secretary_Registration: {
    role: "SDM_Secretary_Registration",
  },
  SDM_Labor_Registration: {
    role: "SDM_Labor_Registration",
  },
  owner: {
    field: "ownerId",
  },
  authenticated: {
    authenticated: true,
  },
  unauthenticated: {
    authenticated: false,
  },
};

module.exports = {
  [config.server.urlPrefix]: {
    dicOffice: {
      "/": [permissions.authenticated],
    },
    user: {
      "/": [permissions.authenticated],
    },
    document: {
      // '/': [permissions.authenticated],
      "/update/:documentId": [
        permissions.SDM_Secretary_Check,
        permissions.SDM_Labor_Check,
        permissions.SDM_Secretary_Registration,
        permissions.SDM_Labor_Registration,
      ],
      "/updateFromDraftAndRevision/:documentId": [
        permissions.authenticated
      ],
    },
  },
};
