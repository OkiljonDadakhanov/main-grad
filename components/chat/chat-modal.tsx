"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChatContainer } from "./chat-container";
import { MessageSquare } from "lucide-react";

interface ChatModalProps {
  applicationId: number;
  universityName: string;
  programName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatModal({
  applicationId,
  universityName,
  programName,
  open,
  onOpenChange,
}: ChatModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <div className="flex flex-col">
              <span>Chat with {universityName}</span>
              <span className="text-sm font-normal text-gray-500">{programName}</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <ChatContainer applicationId={applicationId} className="h-full" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
