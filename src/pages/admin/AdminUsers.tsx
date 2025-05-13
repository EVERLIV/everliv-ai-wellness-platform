
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Search, 
  ChevronRight,
  User,
  MoreHorizontal,
  Calendar,
  Mail
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { fetchAdminUsers, AdminUser } from '@/services/admin-service';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const AdminUsers = () => {
  const { isAdmin, isLoading: adminCheckLoading } = useIsAdmin();
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchAdminUsers();
        setUsers(data);
      } catch (error) {
        console.error("Ошибка при загрузке пользователей:", error);
        toast.error("Не удалось загрузить список пользователей");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(search.toLowerCase()) || 
    (user.first_name && user.first_name.toLowerCase().includes(search.toLowerCase())) ||
    (user.last_name && user.last_name.toLowerCase().includes(search.toLowerCase()))
  );

  // Получаем название плана на русском
  const getPlanName = (planType: string | undefined) => {
    switch(planType) {
      case 'basic': return 'Базовый';
      case 'standard': return 'Стандарт';
      case 'premium': return 'Премиум';
      default: return 'Нет подписки';
    }
  };

  // Получаем статус подписки на русском
  const getStatusLabel = (status: string | undefined) => {
    switch(status) {
      case 'active': return 'Активна';
      case 'canceled': return 'Отменена';
      case 'expired': return 'Истекла';
      default: return 'Нет подписки';
    }
  };

  // Получаем цвет статуса подписки
  const getStatusColor = (status: string | undefined) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'canceled': return 'bg-amber-100 text-amber-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (adminCheckLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">У вас нет доступа к этой странице</h1>
        <p className="mb-6">Для доступа требуются права администратора</p>
        <Button onClick={() => navigate('/dashboard')}>
          Вернуться на главную
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/admin')}
              className="hover:bg-transparent p-0 h-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Назад</span>
            </Button>
          </div>
          <h1 className="text-2xl font-bold mb-2">Управление пользователями</h1>
          <p className="text-gray-600">Управление аккаунтами пользователей и их подписками</p>
        </div>
        <div className="w-full md:w-auto mt-4 md:mt-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Поиск пользователей..."
              className="pl-8 pr-4"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Список пользователей</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Пользователь</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Дата регистрации</TableHead>
                    <TableHead>Подписка</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <div className="font-medium">
                                {user.first_name && user.last_name
                                  ? `${user.first_name} ${user.last_name}`
                                  : "Пользователь"
                                }
                              </div>
                              <div className="text-xs text-gray-500">
                                ID: {user.id.substring(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{user.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{format(new Date(user.created_at), 'dd MMM yyyy', { locale: ru })}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.subscription_status ? (
                            <div className="flex flex-col gap-1">
                              <Badge className={getStatusColor(user.subscription_status)}>
                                {getStatusLabel(user.subscription_status)}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                План: {getPlanName(user.subscription_type)}
                              </span>
                            </div>
                          ) : (
                            <Badge variant="outline">Нет подписки</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Действия</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => navigate(`/admin/users/${user.id}`)}>
                                <User className="h-4 w-4 mr-2" />
                                Просмотр профиля
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate(`/admin/users/${user.id}/subscription`)}>
                                <ChevronRight className="h-4 w-4 mr-2" />
                                Управление подпиской
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-16 text-center">
                        Пользователи не найдены
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
