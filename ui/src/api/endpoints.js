const customer = {
    register: "/customer/register/",
    list: "/customer/list/",
    profile: "/customer/profile/",
};

const employer = {
    register: "/employer/register/", // ✅ FIXED
    list: "/employer/list/",
    profile: "/employer/profile/",
    detail: "/employer/detail/",
};


const auth = {
    login: "/auth/login/", // ✅ FIXED
};

const hireRequest = {
    create: "/hire/create/",
    employerRequests: "/hire/employer/",
    updateStatus: (id) => `/hire/update/${id}/`,
};

const password = {
    sendOtp: "/passwordreset/send-otp/",
    verifyOtp: "/passwordreset/verify-otp/",
    resetPassword: "/passwordreset/reset-password/",
};

const adminpanel = {
    customers: "/adminpanel/customers/",
    employers: "/employer/list/",
    deleteCustomer: (id) => `/adminpanel/customers/${id}/delete/`,
    verifyEmployer: (id) => `/employer/verify/${id}/`,
    employerDocuments: (id) => `/verification/admin/employer/${id}/`,
};

export { customer, employer, auth, hireRequest, password, adminpanel };