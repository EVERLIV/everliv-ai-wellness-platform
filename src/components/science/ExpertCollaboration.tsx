
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ExpertCollaboration = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Сотрудничество с экспертами</h2>
          <p className="text-lg text-gray-600 mb-8">
            Мы работаем с ведущими специалистами в области долголетия, функциональной медицины и нутрициологии
            для создания наиболее эффективных программ оздоровления.
          </p>
          <Link to="/webinars">
            <Button>Узнать о наших экспертных вебинарах</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ExpertCollaboration;
