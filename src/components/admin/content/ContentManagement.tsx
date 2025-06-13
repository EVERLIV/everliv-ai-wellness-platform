
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Edit, Eye } from "lucide-react";

const ContentManagement = () => {
  const articles = [
    { title: "Правильное питание для здоровья сердца", category: "Питание", status: "published", views: 1234 },
    { title: "Профилактика диабета", category: "Профилактика", status: "draft", views: 0 },
    { title: "Физические упражнения после 40", category: "Фитнес", status: "published", views: 856 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Управление контентом</h1>
          <p className="text-gray-600 mt-2">Блог и образовательные статьи</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Новая статья
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Статьи</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {articles.map((article, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{article.title}</p>
                    <p className="text-sm text-gray-600">{article.category} • {article.views} просмотров</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded ${
                    article.status === "published" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}>
                    {article.status === "published" ? "Опубликовано" : "Черновик"}
                  </span>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentManagement;
