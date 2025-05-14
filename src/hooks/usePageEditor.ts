
import { useState } from 'react';
import { ComponentData } from '@/components/editor/EditorCanvas';

export const usePageEditor = () => {
  const [selectedComponent, setSelectedComponent] = useState<ComponentData | null>(null);

  const handleComponentUpdate = (newProps: Record<string, any>) => {
    if (selectedComponent) {
      setSelectedComponent({
        ...selectedComponent,
        props: {
          ...selectedComponent.props,
          ...newProps
        }
      });
    }
  };

  return {
    selectedComponent,
    setSelectedComponent,
    handleComponentUpdate
  };
};
