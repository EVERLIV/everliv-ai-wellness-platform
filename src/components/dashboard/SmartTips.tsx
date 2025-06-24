
import React from "react";
import SmartTipsToast from "./SmartTipsToast";

interface SmartTipsProps {
  healthProfile?: any;
  recentActivity?: any[];
  pendingTasks?: any[];
}

const SmartTips: React.FC<SmartTipsProps> = (props) => {
  return <SmartTipsToast {...props} />;
};

export default SmartTips;
