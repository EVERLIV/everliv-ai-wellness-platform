
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardStatsPanel from "@/components/dashboard/DashboardStatsPanel";
import DashboardActionPanel from "@/components/dashboard/DashboardActionPanel";
import UserProtocolsList from "@/components/dashboard/UserProtocolsList";
import SubscriptionStatusPanel from "@/components/dashboard/SubscriptionStatusPanel";
import RecentAnalysisResults from "@/components/dashboard/RecentAnalysisResults";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useProtocols } from "@/hooks/useProtocols";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";

const UserDashboard = () => {
  const { protocols, isLoading: protocolsLoading } = useProtocols();
  const { history, isLoading: historyLoading } = useAnalysisHistory();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Имитация загрузки
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  // Map the protocols from useProtocols hook format to the format expected by UserProtocolsList
  const mappedProtocols = protocols?.map(protocol => ({
    id: protocol.id,
    title: protocol.name, // Map 'name' to 'title'
    description: protocol.description,
    progress: protocol.progress,
    startDate: protocol.startDate,
    endDate: protocol.endDate || '',
    status: protocol.status === 'active' ? 'active' : 
           protocol.status === 'completed' ? 'completed' : 'paused'
  }));

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardStatsPanel />
        </div>
        <div className="lg:col-span-1">
          <SubscriptionStatusPanel />
        </div>
      </div>

      <div className="flex justify-between items-center mt-8">
        <h2 className="text-xl font-semibold">Мои действующие протоколы</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Обновление...
            </>
          ) : (
            "Обновить"
          )}
        </Button>
      </div>

      <UserProtocolsList 
        protocols={mappedProtocols?.slice(0, 3) || []} 
        isLoading={protocolsLoading} 
        compact={true}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Недавние результаты анализов</h2>
          <RecentAnalysisResults results={history?.slice(0, 3) || []} isLoading={historyLoading} />
        </div>
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Быстрые действия</h2>
          <DashboardActionPanel />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
