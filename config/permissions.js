const permissions = {
  admin: {
    role: "admin",
  },
  // SDM: {
  //   role: "SDM",
  // },
  SDM_Secretary_Check: {
    role: "SDM_SECRETARY_CHECK",
    field: { officeName: "officeName" },
  },
  SDM_Labor_Check: {
    role: "SDM_LABOR_CHECK",
    field: { officeName: "officeName" },
  },
  SDM_Secretary_Registration: {
    role: "SDM_SECRETARY_REGISTRATION",
    field: { officeName: "officeName" },
  },
  SDM_Labor_Registration: {
    role: "SDM_LABOR_REGISTRATION",
    field: { officeName: "officeName" },
  },
  owner: {
    field: { ownerId: "id" },
  },
  documentAuthor: {
    field: { authorPersonalNumber: "id" },
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
      "/updateFromDraftAndRevision/:documentId": [permissions.documentAuthor],
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
      "/": [permissions.authenticated],
      "/add": [permissions.admin],
    },
    user: {
      "/": [permissions.authenticated],
    },
  },
};
