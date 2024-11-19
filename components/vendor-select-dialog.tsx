"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export interface Vendor {
  id: string
  name: string
  taxId: string
}

// 模擬的廠商數據，實際應用中可能來自 API
const vendors: Vendor[] = [
  { id: "V001", name: "台灣高鐵股份有限公司", taxId: "12345678" },
  { id: "V002", name: "台灣車輛股份有限公司", taxId: "23456789" },
  { id: "V003", name: "台灣鐵道股份有限公司", taxId: "34567890" },
  { id: "V004", name: "中興工程顧問股份有限公司", taxId: "45678901" },
  { id: "V005", name: "台灣世曦工程顧問股份有限公司", taxId: "56789012" },
]

interface VendorSelectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (vendor: Vendor) => void
}

export function VendorSelectDialog({
  open,
  onOpenChange,
  onSelect,
}: VendorSelectDialogProps) {
  const [searchVendor, setSearchVendor] = useState("")

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.id.toLowerCase().includes(searchVendor.toLowerCase()) ||
      vendor.name.toLowerCase().includes(searchVendor.toLowerCase()) ||
      vendor.taxId.includes(searchVendor)
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>廠商查詢</DialogTitle>
          <DialogDescription>
            請輸入廠商編號或名稱進行查詢
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="搜尋廠商..."
              value={searchVendor}
              onChange={(e) => setSearchVendor(e.target.value)}
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">廠商編號</TableHead>
                  <TableHead>廠商名稱</TableHead>
                  <TableHead className="w-[120px]">統一編號</TableHead>
                  <TableHead className="w-[100px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell>{vendor.id}</TableCell>
                    <TableCell>{vendor.name}</TableCell>
                    <TableCell>{vendor.taxId}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          onSelect(vendor)
                          onOpenChange(false)
                        }}
                      >
                        選擇
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 