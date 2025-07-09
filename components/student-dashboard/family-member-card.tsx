"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { FamilyMember } from "@/app/student/my-family/page" // Adjust path
import { Edit, Trash2, User } from "lucide-react"

interface FamilyMemberCardProps {
  member: FamilyMember
  onDelete: (id: string) => void
  onEdit: (member: FamilyMember) => void
}

export default function FamilyMemberCard({ member, onDelete, onEdit }: FamilyMemberCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="h-7 w-7 text-purple-600" />
            <div>
              <CardTitle>{member.fullName}</CardTitle>
              <CardDescription>{member.relationship}</CardDescription>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-gray-500 hover:text-gray-700"
              onClick={() => onEdit(member)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(member.id)}
              className="h-7 w-7 text-red-400 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        <p>
          <span className="font-medium">Date of Birth:</span> {new Date(member.dateOfBirth).toLocaleDateString()}
        </p>
        {member.occupation && (
          <p>
            <span className="font-medium">Occupation:</span> {member.occupation}
          </p>
        )}
        {member.contactNumber && (
          <p>
            <span className="font-medium">Contact:</span> {member.contactNumber}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
