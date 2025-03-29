"use client";
import dynamic from "next/dynamic";
const DynamicMapComponent = dynamic(() => import("../components/MapComponent"), { ssr: false });

const MyPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center sticky top-0">Aéroport de Yaoundé Nsimalen</h1>
      <DynamicMapComponent />
    </div>
  );
};

export default MyPage;