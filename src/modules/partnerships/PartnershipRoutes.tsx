
import { Routes, Route } from "react-router-dom";
import { lazy } from "react";

// Lazy load partnership components
const CorporateClients = lazy(() => import("@/pages/partnerships/CorporateClients"));
const MedicalInstitutions = lazy(() => import("@/pages/partnerships/MedicalInstitutions"));
const MedicalSpecialists = lazy(() => import("@/pages/partnerships/MedicalSpecialists"));

const PartnershipRoutes = () => {
  return (
    <Routes>
      <Route path="/corporate" element={<CorporateClients />} />
      <Route path="/medical-institutions" element={<MedicalInstitutions />} />
      <Route path="/specialists" element={<MedicalSpecialists />} />
    </Routes>
  );
};

export default PartnershipRoutes;
