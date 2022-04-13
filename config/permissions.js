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
      "/": [permissions.admin],
      "/add": [permissions.admin],
      "/update/:id": [permissions.admin],
      "/delete/:id": [permissions.admin],
    },
    dicOfficeCorrespondence: {
      "/": [permissions.admin],
      "/add": [permissions.admin],
      "/update/:id": [permissions.admin],
      "/delete/:id": [permissions.admin],
    },
    document: {
      "/": [permissions.authenticated],
      "/:documentId": [permissions.authenticated],
      "/add": [permissions.authenticated],
      "/addInDraft": [permissions.authenticated],
      "/update/:documentId": [
        permissions.SDM_Secretary_Check,
        permissions.SDM_Labor_Check,
        permissions.SDM_Secretary_Registration,
        permissions.SDM_Labor_Registration,
      ],
      "/updateFromDraftAndRevision/:documentId": [permissions.owner],
      "/delete": [permissions.admin],
    },
    documentKolba: {
      "/": [permissions.authenticated],
      "/:documentId": [permissions.authenticated],
      "/add": [permissions.authenticated],
      "/addInDraft": [permissions.authenticated],
      "/update/:documentId": [
        permissions.SDM_Secretary_Check,
        permissions.SDM_Labor_Check,
        permissions.SDM_Secretary_Registration,
        permissions.SDM_Labor_Registration,
      ],
      "/updateFromDraftAndRevision/:documentId": [permissions.owner],
      "/delete": [permissions.admin],
    },
    documentRoute: {
      "/": [permissions.authenticated],
      "/:documentTypeId": [permissions.authenticated],
      "/add": [permissions.admin],
      "/delete/:documentTypeId": [permissions.admin],
    },
    documentStatus: {
      "/": [permissions.authenticated],
      "/add": [permissions.admin],
    },
    documentType: {
      "/": [],
      "/add": [],
    },
    user: {
      "/": [permissions.authenticated],
    },
  },
};
