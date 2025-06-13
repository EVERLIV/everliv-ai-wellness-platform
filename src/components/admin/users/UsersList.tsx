
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdminUser } from "@/services/admin-service";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import UserListActions from "./UserListActions";
import UserAvatar from "./UserAvatar";

interface UsersListProps {
  users: AdminUser[];
  filteredUsers: AdminUser[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onEditUser: (user: AdminUser) => void;
  onManageSubscription: (user: AdminUser) => void;
  onCancelSubscription: (userId: string, subscriptionId?: string) => void;
  onInviteUser: () => void;
}

const UsersList = ({
  users,
  filteredUsers,
  isLoading,
  searchQuery,
  setSearchQuery,
  onEditUser,
  onManageSubscription,
  onCancelSubscription,
  onInviteUser,
}: UsersListProps) => {
  console.log('UsersList render:', { 
    usersCount: users.length, 
    filteredUsersCount: filteredUsers.length, 
    isLoading 
  });

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление пользователями</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Поиск пользователей..." 
              className="pl-9 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={onInviteUser}>
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" x2="19" y1="8" y2="14"></line><line x1="22" x2="16" y1="11" y2="11"></line></svg>
              Добавить пользователя
            </span>
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6">
              <Skeleton className="h-12 w-full mb-4" />
              <Skeleton className="h-12 w-full mb-4" />
              <Skeleton className="h-12 w-full mb-4" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Пользователь
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата регистрации
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Подписка
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Срок действия
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length === 0 && !isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center">
                      <div className="text-gray-500">
                        {searchQuery ? (
                          <div>
                            <p className="text-lg font-medium mb-2">Пользователи не найдены</p>
                            <p className="text-sm">Попробуйте изменить критерии поиска</p>
                          </div>
                        ) : users.length === 0 ? (
                          <div>
                            <p className="text-lg font-medium mb-2">Пользователи не зарегистрированы</p>
                            <p className="text-sm">Пока что в системе нет зарегистрированных пользователей</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-lg font-medium mb-2">Результаты не найдены</p>
                            <p className="text-sm">По вашему запросу ничего не найдено</p>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <UserAvatar user={user} />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.first_name && user.last_name 
                                ? `${user.first_name} ${user.last_name}` 
                                : user.first_name || user.last_name || "Без имени"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            user.subscription_status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : user.subscription_status === 'canceled'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {user.subscription_status === 'active'
                            ? 'Активная'
                            : user.subscription_status === 'canceled'
                            ? 'Отменена'
                            : 'Нет подписки'}
                        </span>
                        {user.subscription_type && (
                          <span className="ml-1 text-xs text-gray-500">
                            ({
                              user.subscription_type === 'basic'
                                ? 'Базовый'
                                : user.subscription_type === 'standard'
                                ? 'Стандарт'
                                : 'Премиум'
                            })
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.subscription_expires_at 
                          ? format(new Date(user.subscription_expires_at), "dd.MM.yyyy")
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <UserListActions 
                          user={user}
                          onEditUser={onEditUser}
                          onManageSubscription={onManageSubscription}
                          onCancelSubscription={onCancelSubscription}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        <div className="flex items-center justify-between px-6 py-3 bg-gray-50">
          <div>
            <p className="text-sm text-gray-700">
              Всего пользователей: <span className="font-medium">{filteredUsers.length}</span>
              {searchQuery && users.length !== filteredUsers.length && (
                <span className="text-gray-500"> из {users.length}</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersList;
