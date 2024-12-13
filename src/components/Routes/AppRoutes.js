import { Route, Routes } from "react-router-dom";

import AddPairForm from "../AddPairForm/AddPairForm";
import DpkPairStorage from "../DPKPairStorage/DpkPairStorage";
import GeneratePGPKeys from "../GeneratePGPKeys";
import HomePage from "../HomePage";
import MyPairsList from "../MyPairsList";
import React from "react";
import SecureEmailForm from "../SecureEmailForm";

const AppRoutes = ({ userSession, gun }) => {
  return (
    <Routes>
      <Route path="/home" element={<HomePage />} />
      <Route path="/generate-pgp-keys" element={<GeneratePGPKeys />} />
      <Route
        path="/my-pairs-list"
        element={<MyPairsList userSession={userSession} gun={gun} />}
      />
      <Route path="/secure-email-form" element={<SecureEmailForm />} />
      <Route
        path="/add-new-pair"
        element={<AddPairForm gun={gun} userSession={userSession} />}
      />
      <Route
        path="/dpk-pair-storage"
        element={<DpkPairStorage gun={gun} userSession={userSession} />}
      />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
};

export default AppRoutes;
