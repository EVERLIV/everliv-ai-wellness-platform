
import React, { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface ResearchReference {
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi?: string;
  url?: string;
}

export interface ScientificExplanationProps {
  summary: string;
  mechanisms: {
    title: string;
    description: ReactNode;
  }[];
  visualComponent?: ReactNode;
  references: ResearchReference[];
}

const ScientificExplanation: React.FC<ScientificExplanationProps> = ({
  summary,
  mechanisms,
  visualComponent,
  references
}) => {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Краткое описание</h3>
        <p className="text-gray-700">{summary}</p>
      </div>

      {visualComponent && (
        <div className="flex justify-center py-4">
          {visualComponent}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <h3 className="text-xl font-semibold p-6 pb-4">Механизмы воздействия</h3>
        <Accordion type="single" collapsible className="w-full">
          {mechanisms.map((mechanism, index) => (
            <AccordionItem key={index} value={`mechanism-${index}`}>
              <AccordionTrigger className="px-6 hover:no-underline">
                <span>{mechanism.title}</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="prose max-w-none">
                  {mechanism.description}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Научные исследования</h3>
        <div className="space-y-4">
          {references.map((reference, index) => (
            <Card key={index} className="border border-gray-200">
              <CardContent className="p-4">
                <p className="font-semibold">{reference.title}</p>
                <p className="text-gray-700 text-sm">{reference.authors}</p>
                <p className="text-gray-600 text-sm italic">
                  {reference.journal}, {reference.year}
                </p>
                {(reference.doi || reference.url) && (
                  <a 
                    href={reference.url || `https://doi.org/${reference.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm block mt-1 hover:underline"
                  >
                    {reference.doi ? `DOI: ${reference.doi}` : 'Читать исследование'}
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScientificExplanation;
