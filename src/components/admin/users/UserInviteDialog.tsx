
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

interface UserInviteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  setEmail: (email: string) => void;
  onInvite: () => void;
}

const UserInviteDialog = ({
  isOpen,
  onClose,
  email,
  setEmail,
  onInvite,
}: UserInviteDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Пригласить нового пользователя</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="inviteEmail">Email</Label>
            <Input 
              id="inviteEmail" 
              type="email"
              placeholder="email@example.com"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Отмена</Button>
          <Button 
            onClick={onInvite}
            disabled={!email || !email.includes('@')}
          >
            <Mail className="w-4 h-4 mr-2" />
            Отправить приглашение
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserInviteDialog;
