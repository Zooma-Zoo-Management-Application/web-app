"use client"

import { ColumnDef } from "@tanstack/react-table"
import { statuses } from "../data/data"
import { Order } from "../data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { format } from "date-fns"
import { formatVND, getStatus } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { twMerge } from "tailwind-merge"

export const columns: ColumnDef<Order>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected()}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.label)

      return (
        <div className="flex space-x-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="max-w-[500px] truncate font-medium">
            <div className="flex gap-2 items-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src={(row.getValue("user") as Order["user"]).avatarUrl} alt={(row.getValue("user") as Order["user"]).userName} />
              <AvatarFallback>{(row.getValue("user") as Order["user"]).userName.slice(0,2)}</AvatarFallback>
            </Avatar>
            {(row.getValue("user") as Order["user"]).userName}
            </div>
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "orderDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order Date" />
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.label)

      return (
        <div className="flex space-x-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="max-w-[500px] truncate font-medium">
            {/* format time */}
            {format(new Date(row.getValue("orderDate")), "HH:mm dd/MM/yyyy")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "totalPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Price" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {formatVND(row.getValue("totalPrice"))}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "paymentMethod",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Method" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("paymentMethod")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "notes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Notes" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("notes")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "orderDetails",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ticket" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            { (row.getValue("orderDetails") as any[]).map((orderDetail: any) => (
              <div key={orderDetail.id + orderDetail.ticketDate} className="flex flex-col">
                <div className="flex space-x-2">
                  <span className="max-w-[500px] truncate font-medium">
                    TicketId: {orderDetail.ticketId}
                  </span>
                  <span className="max-w-[500px] truncate font-medium">
                    Quantity: {orderDetail.quantity}
                  </span>
                </div>
              </div>
            ))}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return (
          <span className={twMerge("text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-3", getStatus(row.getValue("status")).color)}>{
                          getStatus(row.getValue("status")).text
          }</span>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
]