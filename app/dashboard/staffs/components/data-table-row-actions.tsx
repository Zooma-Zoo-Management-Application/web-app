"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row, Table, TableMeta } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { deleteNewById } from "@/lib/api/newAPI"
import { format } from "date-fns"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ProfileForm } from "./ProfileForm"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { banUser, unbanUser } from "@/lib/api/userAPI"
import useRefresh from "@/stores/refresh-store"


interface DataTableRowActionsProps<TData> {
  row: Row<TData>,
  table: Table<TData>
}

export function DataTableRowActions<TData>({
  row,
  table
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  const meta : TableMeta<TData> | undefined = table.options.meta;

  const [viewOpen, setViewOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)

  const { refresh } = useRefresh()

  const handleDelete = () => {
    if(row.getValue("status") as boolean){
      banUser(row.getValue("id"))
      .then(res => {
        if(res.error != null){
          toast({
            title: "Ban Failed!",
            description: "Something went wrong.",
            variant: "destructive"
          })
        } else {
          toast({
            title: "Ban Success!",
            description: "Staff has been banned."
          })
        }
      })
      .catch((err:any) => {
        toast({
          title: "Ban Failed!",
          description: "Something went wrong.",
          variant: "destructive"
        })
      })
      .finally(() => {
        setTimeout(() => {
          refresh()
        }, 1000)
      })
    } else {
      unbanUser(row.getValue("id"))
      .then(res => {
        if(res.error != null){
          toast({
            title: "Unban Failed!",
            description: "Something went wrong.",
            variant: "destructive"
          })
        } else {
          toast({
            title: "Unban Success!",
            description: "Staff has been unbanned."
          })
        }
      })
      .catch((err:any) => {
        toast({
          title: "Ban Failed!",
          description: "Something went wrong.",
          variant: "destructive"
        })
      })
      .finally(() => {
        setTimeout(() => {
          refresh()
        }, 1000)
      })
    }
    
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <DotsHorizontalIcon className="w-5 h-5"/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={5} alignOffset={-5}>
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => setViewOpen(true)}>
            View
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setUpdateOpen(true)}>
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleDelete}>
            {row.getValue("status") ? "Ban" : "Unban"}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
      <UpdateFormDialog open={updateOpen} setOpen={setUpdateOpen} row={row} table={table}/>
      <ViewFormDialog open={viewOpen} setOpen={setViewOpen} row={row} table={table}/>
    </DropdownMenu>
  )
}

const ViewFormDialog = ({ open, setOpen, row, table }:{
  open: boolean,
  setOpen: (value: boolean) => void,
  row: Row<any>,
  table: Table<any>
}) => {

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>View Profile</DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-2">
          <Avatar className="h-16 w-16">
            <AvatarImage src={(row.getValue("avatarUrl")) || "/peguin.jpg"} alt={(row.getValue("user") as any)?.userName} />
            <AvatarFallback>{(row.getValue("user") as any)?.userName.slice(0,2)}</AvatarFallback>
          </Avatar>
          <div className="text-lg font-semibold">{row.getValue("userName")}</div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <div>
              <div className="text-sm font-semibold">Email</div>
              <div className="text-sm">{row.getValue("email")}</div>
            </div>
            <div>
              <div className="text-sm font-semibold">Phone Number</div>
              <div className="text-sm">{row.getValue("phoneNumber")}</div>
            </div>
            <div>
              <div className="text-sm font-semibold">Date Of Birth</div>
              <div className="text-sm">{format(new Date(row.getValue("dateOfBirth")), "dd/MM/yyyy")}</div>
            </div>
          </div>
          <div className="flex-1">
            <div>
              <div className="text-sm font-semibold">Phone Number</div>
              <div className="text-sm">{row.getValue("phoneNumber")}</div>
            </div>
            <div>
              <div className="text-sm font-semibold">Full Name</div>
              <div className="text-sm">{row.getValue("fullName")}</div>
            </div>
            <div>
              <div className="text-sm font-semibold">Gender</div>
              <div className="text-sm">{row.getValue("gender")}</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const UpdateFormDialog = ({ open, setOpen, row, table }:{
  open: boolean,
  setOpen: (value: boolean) => void,
  row: Row<any>,
  table: Table<any>
}) => {

  const handleClose = () => {
    setOpen(false)
  }

  const values = {
    userName: row.getValue("userName"),
    email: row.getValue("email"),
    fullName: row.getValue("fullName"),
    gender: row.getValue("gender"),
    dateOfBirth: row.getValue("dateOfBirth"),
    avatarUrl: row.getValue("avatarUrl"),
    phoneNumber: row.getValue("phoneNumber"),
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>Update Profile</DialogHeader>
        <ProfileForm userId={row.getValue("id")} values={values} setOpen={setOpen}/>
      </DialogContent>
    </Dialog>
  )
}