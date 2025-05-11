
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface TabContentProps {
  title: string;
  description: string;
  linkTo: string;
  linkText: string;
}

const TabContent = ({ title, description, linkTo, linkText }: TabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 mb-4">{description}</p>
        <Link to={linkTo}>
          <Button>
            {linkText}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default TabContent;
