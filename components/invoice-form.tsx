"use client"

import { useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { Upload, Send, Paperclip, X, ChevronDown, UserPlus, Clock, FileText } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"

export function InvoiceForm() {
  const [status, setStatus] = useState("incomplete")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const currentDate = format(new Date(), "yyyy/MM/dd")
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false)
  const [showAddSigner, setShowAddSigner] = useState(false)
  const [selectedAddSigner, setSelectedAddSigner] = useState("")
  const [addSignPosition, setAddSignPosition] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsLoading(false)
    }
    loadData()
  }, [])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles])
  }, [])

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles(files => files.filter(file => file !== fileToRemove))
  }

  const signFlowData = [
    { id: 1, role: "承辦人", name: "王小明", status: "completed" },
    { id: 2, role: "會計主管", name: "李大華", status: "current" },
    { id: 3, role: "副廠長", name: "張三", status: "pending" },
    { id: 4, role: "廠長", name: "林四", status: "pending" },
  ]

  const SignFlowChart = () => (
    <div className="py-4">
      <div className="flex justify-between items-center relative">
        {signFlowData.map((node, index) => (
          <div key={node.id} className="flex flex-col items-center relative z-10">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center
                ${node.status === 'completed' ? 'bg-green-500 text-white' :
                  node.status === 'current' ? 'bg-blue-500 text-white' :
                  'bg-gray-200'}`}
            >
              {node.status === 'completed' ? '✓' : (index + 1)}
            </div>
            <div className="mt-2 text-sm font-medium">{node.role}</div>
            <div className="text-xs text-gray-500">{node.name}</div>
          </div>
        ))}
        <div className="absolute top-4 left-0 right-0 h-[2px] bg-gray-200 -z-0">
          <div 
            className="h-full bg-green-500" 
            style={{ width: '25%' }}
          />
        </div>
      </div>
    </div>
  )

  const handleSignClick = () => {
    setIsSignDialogOpen(true)
  }

  const availableSigners = [
    { id: "1", name: "陳經理", title: "業務經理" },
    { id: "2", name: "王主任", title: "採購主任" },
    { id: "3", name: "林組長", title: "稽核組長" },
  ]

  const SignDialog = () => (
    <Dialog open={isSignDialogOpen} onOpenChange={setIsSignDialogOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>核簽流程</DialogTitle>
          <DialogDescription>
            文件編號：INV-20240321-001
          </DialogDescription>
        </DialogHeader>
        
        <SignFlowChart />
        
        <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <Label>加簽設定</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddSigner(!showAddSigner)}
            >
              {showAddSigner ? "取消加簽" : "新增加簽"}
            </Button>
          </div>
          
          {showAddSigner && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>選擇加簽人員</Label>
                  <Select
                    value={selectedAddSigner}
                    onValueChange={setSelectedAddSigner}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="請選擇加簽人員" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSigners.map((signer) => (
                        <SelectItem key={signer.id} value={signer.id}>
                          {signer.name} - {signer.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>加簽位置</Label>
                  <Select
                    value={addSignPosition?.toString() || ""}
                    onValueChange={(value) => setAddSignPosition(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="請選擇加簽位置" />
                    </SelectTrigger>
                    <SelectContent>
                      {signFlowData.map((node, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          {node.role} 之前
                        </SelectItem>
                      ))}
                      <SelectItem value={signFlowData.length.toString()}>
                        流程最後
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                className="w-full"
                variant="secondary"
                onClick={() => {
                  if (selectedAddSigner && addSignPosition !== null) {
                    const newSigner = availableSigners.find(
                      (s) => s.id === selectedAddSigner
                    )
                    if (newSigner) {
                      const newSignFlow = [...signFlowData]
                      newSignFlow.splice(addSignPosition, 0, {
                        id: Date.now(),
                        role: newSigner.title,
                        name: newSigner.name,
                        status: "pending"
                      })
                      // 這裡需要更新 signFlowData
                      // 如果 signFlowData 是狀態，需要使用 setState
                      setShowAddSigner(false)
                      setSelectedAddSigner("")
                      setAddSignPosition(null)
                    }
                  }
                }}
              >
                確認加簽
              </Button>
            </div>
          )}
        </div>

        <div className="h-[1px] bg-gray-200 my-4" />
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="comment">核簽意見</Label>
            <Textarea
              id="comment"
              placeholder="請輸入您的核簽意見..."
              className="min-h-[100px]"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsSignDialogOpen(false)}
            >
              取消
            </Button>
            <Button
              onClick={() => {
                setIsSignDialogOpen(false)
              }}
            >
              確認送出
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  const UploadDialog = () => (
    <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" onClick={() => setIsUploadDialogOpen(true)}>
          <Paperclip className="mr-2 h-4 w-4" />
          附件上傳
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>上傳附件</DialogTitle>
          <DialogDescription>
            拖拉文件到此處或點擊選擇文件進行上傳。
          </DialogDescription>
        </DialogHeader>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            const files = Array.from(e.dataTransfer.files)
            onDrop(files)
          }}
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          <input
            id="fileInput"
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files || [])
              onDrop(files)
            }}
          />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            拖拉文件到此處或點擊選擇文件
          </p>
        </div>
        <div className="mt-4 space-y-2">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
              <span className="text-sm truncate">{file.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(file)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={() => setIsUploadDialogOpen(false)}>完成</Button>
        </div>
      </DialogContent>
    </Dialog>
  )

  const FormSkeleton = () => (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center space-x-1">
        <div className="h-4 w-16 bg-gray-200 rounded" />
        <div className="h-4 w-4 bg-gray-200 rounded" />
        <div className="h-4 w-20 bg-gray-200 rounded" />
        <div className="h-4 w-4 bg-gray-200 rounded" />
        <div className="h-4 w-24 bg-gray-200 rounded" />
      </div>

      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="flex space-x-2">
          <div className="h-9 w-20 bg-gray-200 rounded" />
          <div className="h-9 w-20 bg-gray-200 rounded" />
          <div className="h-9 w-20 bg-gray-200 rounded" />
          <div className="h-9 w-24 bg-gray-200 rounded" />
          <div className="h-9 w-24 bg-gray-200 rounded" />
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-9 w-full bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 w-24 bg-gray-200 rounded" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="space-y-2">
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                    <div className="h-9 w-full bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="h-6 w-32 bg-gray-200 rounded" />
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <TableHead key={i}>
                      <div className="h-4 w-full bg-gray-200 rounded" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 12 }).map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-9 w-full bg-gray-200 rounded" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">
      {isLoading ? (
        <FormSkeleton />
      ) : (
        <>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Link 
              href="/" 
              className="flex items-center hover:text-foreground"
            >
              <Home className="h-4 w-4 mr-1" />
              首頁
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link 
              href="/" 
              className="hover:text-foreground"
            >
              應付帳款
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-foreground">發票輸入作業</span>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">發票輸入作業</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => setStatus("incomplete")}>
                未完成
              </Button>
              <Button variant="outline" onClick={() => setStatus("matched")}>
                比對
              </Button>
              <Button variant="default" onClick={() => setStatus("completed")}>
                完成
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary">
                    <Send className="mr-2 h-4 w-4" />
                    核簽
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleSignClick}>
                    <Send className="mr-2 h-4 w-4" />
                    送核簽
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <UserPlus className="mr-2 h-4 w-4" />
                    加簽
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Clock className="mr-2 h-4 w-4" />
                    核簽進度
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" />
                    核簽紀錄
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <UploadDialog />
            </div>
          </div>

          <div className="space-y-4">
            {/* Basic Information Section */}
            <Card>
              <CardContent className="p-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="billingType">帳單類型</Label>
                    <div className="flex gap-2">
                      <Input id="billingType" className="w-24" />
                      <Input className="flex-1" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billingCategory">帳單類別</Label>
                    <Select defaultValue="default">
                      <SelectTrigger>
                        <SelectValue placeholder="選擇類別" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">預設類別</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billingPerson">開立人</Label>
                    <Input id="billingPerson" defaultValue="KEVIN-CS" />
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNum">發票號碼</Label>
                    <Input id="invoiceNum" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoiceDate">發票日期</Label>
                    <Input id="invoiceDate" defaultValue={currentDate} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="glDate">總帳日期</Label>
                    <Input id="glDate" defaultValue={currentDate} />
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="currency">幣別</Label>
                    <Input id="currency" defaultValue="NTD" className="w-24" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxCode">稅碼</Label>
                    <Select defaultValue="vat">
                      <SelectTrigger>
                        <SelectValue placeholder="選擇稅碼" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vat">應稅</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="costCenter">成本中心</Label>
                    <Input id="costCenter" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amount Sections */}
            <div className="grid gap-4 md:grid-cols-3">
              {/* Invoice Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">發票</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="invoiceSalesAmount">銷售金額</Label>
                      <Input id="invoiceSalesAmount" type="number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="invoiceTaxAmount">稅額</Label>
                      <Input id="invoiceTaxAmount" type="number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="invoiceTotalAmount">總金額</Label>
                      <Input id="invoiceTotalAmount" type="number" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Function Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">功能</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="functionSalesAmount">銷售金額</Label>
                      <Input id="functionSalesAmount" type="number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="functionTaxAmount">稅額</Label>
                      <Input id="functionTaxAmount" type="number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="functionTotalAmount">總金額</Label>
                      <Input id="functionTotalAmount" type="number" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* GUI Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">GUI</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="guiSalesAmount">銷售金額</Label>
                      <Input id="guiSalesAmount" type="number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guiTaxAmount">稅額</Label>
                      <Input id="guiTaxAmount" type="number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guiTotalAmount">總金額</Label>
                      <Input id="guiTotalAmount" type="number" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Receipt Detail Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">收據明細 GUI/VAT</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>單據類型</TableHead>
                        <TableHead>GUI日期</TableHead>
                        <TableHead>GUI號碼</TableHead>
                        <TableHead>稅碼</TableHead>
                        <TableHead>GUI類型</TableHead>
                        <TableHead>幣別</TableHead>
                        <TableHead>GUI匯率</TableHead>
                        <TableHead>銷售金額</TableHead>
                        <TableHead>稅額</TableHead>
                        <TableHead>總金額</TableHead>
                        <TableHead>廠商編號</TableHead>
                        <TableHead>廠商名稱</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Select defaultValue="tw">
                            <SelectTrigger>
                              <SelectValue placeholder="選擇類型" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tw">TW_發票</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input defaultValue={currentDate} />
                        </TableCell>
                        <TableCell>
                          <Input />
                        </TableCell>
                        <TableCell>
                          <Select defaultValue="vat">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="vat">應稅</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="選擇類型" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="standard">標準</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input defaultValue="NTD" />
                        </TableCell>
                        <TableCell>
                          <Input defaultValue="1" />
                        </TableCell>
                        <TableCell>
                          <Input type="number" />
                        </TableCell>
                        <TableCell>
                          <Input type="number" />
                        </TableCell>
                        <TableCell>
                          <Input type="number" />
                        </TableCell>
                        <TableCell>
                          <Input />
                        </TableCell>
                        <TableCell>
                          <Input />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
          <SignDialog />
        </>
      )}
    </div>
  )
}