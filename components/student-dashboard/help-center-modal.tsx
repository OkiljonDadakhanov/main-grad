"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Input } from "../ui/input"

interface HelpCenterModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmitMessage: (data: HelpMessageFormData) => void
}

const helpMessageSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(100, "Subject too long"),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message too long"),
})

export type HelpMessageFormData = z.infer<typeof helpMessageSchema>

export default function HelpCenterModal({ isOpen, onClose, onSubmitMessage }: HelpCenterModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HelpMessageFormData>({
    resolver: zodResolver(helpMessageSchema),
  })

  const onSubmit = (data: HelpMessageFormData) => {
    onSubmitMessage(data)
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contact Help Center</DialogTitle>
          <DialogDescription>Send a message to our support team. We'll get back to you soon.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" {...register("subject")} placeholder="e.g., Issue with application form" />
            {errors.subject && <p className="text-sm text-red-500">{errors.subject.message}</p>}
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              {...register("message")}
              placeholder="Describe your issue or question in detail..."
              rows={5}
            />
            {errors.message && <p className="text-sm text-red-500">{errors.message.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              Send Message
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
