
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AdminUser } from "@/services/admin-service";

interface UserEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
  editForm: {
    first_name: string;
    last_name: string;
  };
  setEditForm: React.Dispatch<React.SetStateAction<{
    first_name: string;
    last_name: string;
  }>>;
  onSave: () => Promise<void>;
}

const UserEditDialog = ({
  isOpen,
  onClose,
  user,
  editForm,
  setEditForm,
  onSave,
}: UserEditDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактирование пользователя</DialogTitle>
        </DialogHeader>
        {user && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName">Имя</Label>
              <Input 
                id="firstName" 
                value={editForm.first_name} 
                onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Фамилия</Label>
              <Input 
                id="lastName" 
                value={editForm.last_name} 
                onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })} 
              />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Отмена</Button>
          <Button onClick={onSave}>Сохранить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditDialog;
