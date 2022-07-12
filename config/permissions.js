const permissions = {
  admin: {
    role: "admin",
  },
  UEMI_ADMIN: {
    role: "UEMI_ADMIN",
  },
  // SDM: {
  //   role: "SDM",
  // },
  SDM_Secretary_Check: {
    role: "SDM_SECRETARY_CHECK",
    officeCheck: true,
    field: { officeName: "officeName" },
  },
  SDM_Labor_Check: {
    role: "SDM_LABOR_CHECK",
    officeCheck: true,
    field: { officeName: "officeName" },
  },
  SDM_Secretary_Registration: {
    role: "SDM_SECRETARY_REGISTRATION",
    officeCheck: true,
    field: { officeName: "officeName" },
  },
  SDM_Labor_Registration: {
    role: "SDM_LABOR_REGISTRATION",
    officeCheck: true,
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
      "/": [permissions.authenticated],
      "/add": [permissions.admin, permissions.UEMI_ADMIN],
      "/update/:id": [permissions.admin, permissions.UEMI_ADMIN],
      "/delete/:id": [permissions.admin, permissions.UEMI_ADMIN],
    },
    dicOfficeCorrespondence: {
      "/": [permissions.authenticated],
      "/add": [permissions.admin, permissions.UEMI_ADMIN],
      "/update/:id": [permissions.admin, permissions.UEMI_ADMIN],
      "/delete/:id": [permissions.admin, permissions.UEMI_ADMIN],
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
        permissions.UEMI_ADMIN,
      ],
      "/updateFromDraftAndRevision/:documentId": [
        permissions.documentAuthor,
        permissions.UEMI_ADMIN,
      ],
      "/updateDocumentFlagDeleted/:documentId": [permissions.documentAuthor],
      "/delete": [permissions.admin, permissions.UEMI_ADMIN],
    },
    documentRoute: {
      "/": [permissions.authenticated],
      "/:documentTypeId": [permissions.authenticated],
      "/add": [permissions.admin, permissions.UEMI_ADMIN],
      "/delete/:documentTypeId": [permissions.admin, permissions.UEMI_ADMIN],
    },
    documentStatus: {
      "/": [permissions.authenticated],
      "/add": [permissions.admin, permissions.UEMI_ADMIN],
    },
    documentType: {
      "/": [permissions.authenticated],
      "/add": [permissions.admin, permissions.UEMI_ADMIN],
    },
    user: {
      "/": [permissions.authenticated],
    },
    findMSSQL: {
      "/schedule": [permissions.authenticated],
      "/brigada": [permissions.authenticated],
    },
  },
};
