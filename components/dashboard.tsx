"use client"

import { useState } from 'react'
import { BarChart3, BookOpen, ChevronDown, ChevronLeft, ChevronRight, CreditCard, FileText, LayoutDashboard, LineChart, LogOut, Maximize2, Menu, Minimize2, PieChart, Receipt, Search, Settings, Train, ClipboardList, TrendingUp, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
Dialog,
DialogContent,
DialogHeader,
DialogTitle,
} from "@/components/ui/dialog"
import {
Collapsible,
CollapsibleContent,
CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
Area,
AreaChart,
Bar,
BarChart,
CartesianGrid,
Cell,
Legend,
Line,
ResponsiveContainer,
Tooltip,
XAxis,
YAxis,
} from "recharts"
import Link from 'next/link'
import { InvoiceForm } from "@/components/invoice-form"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

export function DashboardComponent() {
const [sidebarOpen, setSidebarOpen] = useState(true)
const [searchExpanded, setSearchExpanded] = useState(false)
const [activeTab, setActiveTab] = useState("budget")
const [expandedChart, setExpandedChart] = useState<string | null>(null)
const [showTaskDialog, setShowTaskDialog] = useState(false)
const [isLoadingTasks, setIsLoadingTasks] = useState(false)

// 先定義 pendingTasks
const pendingTasks = [
  { 
    id: "INV-20240321-001", 
    title: "機車零件採購", 
    type: "預算編列",
    amount: 150000,
    submitter: "陳送審",
    submitDate: "2024/03/21",
    status: "待核簽"
  }
]

// 然後再初始化 tasks 狀態
const [tasks, setTasks] = useState(pendingTasks)

const todoItems = [
  { id: 1, title: "預算編列", color: "bg-blue-500" },
  { id: 52, title: "預算審查", color: "bg-green-500" },
  { id: 23, title: "預算動支", color: "bg-yellow-500" },
  { id: 14, title: "預算調整", color: "bg-purple-500" },
  { id: 35, title: "預算核銷", color: "bg-red-500" },
  { id: 46, title: "預算比較", color: "bg-indigo-500" },
]

const budgetComparisonData = [
  { month: "7月", planned: 1500000, actual: 1450000 },
  { month: "8月", planned: 1600000, actual: 1580000 },
  { month: "9月", planned: 1550000, actual: 1600000 },
  { month: "10月", planned: 1700000, actual: 1650000 },
  { month: "11月", planned: 1800000, actual: 1750000 },
  { month: "12月", planned: 2200000, actual: 2100000 },
  { month: "1月", planned: 2500000, actual: 2300000 },
]

const departmentBudgetData = [
  { name: "富岡機廠", amount: 350000 },
  { name: "潮州機廠", amount: 320000 },
  { name: "花蓮機廠", amount: 280000 },
  
]

const projectPlanData = [
  { month: "7月", amount: 500000, average: 500000 },
  { month: "8月", amount: 600000, average: 550000 },
  { month: "9月", amount: 550000, average: 550000 },
  { month: "10月", amount: 700000, average: 587500 },
  { month: "11月", amount: 800000, average: 630000 },
  { month: "12月", amount: 1200000, average: 725000 },
  { month: "1月", amount: 1500000, average: 835714 },
]

const tabs = [
  { id: "budget", label: "預算", icon: <FileText className="h-4 w-4" /> },
  { id: "payable", label: "應付帳款", icon: <Receipt className="h-4 w-4" /> },
  { id: "receivable", label: "應收帳款", icon: <CreditCard className="h-4 w-4" /> },
  { id: "ledger", label: "總帳管理", icon: <BookOpen className="h-4 w-4" /> },
  { id: "payable-ledger", label: "應付立帳", icon: <BookOpen className="h-4 w-4" /> },
]

const loadTasks = async () => {
  setIsLoadingTasks(true)
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    setTasks(pendingTasks)
  } finally {
    setIsLoadingTasks(false)
  }
}

const handleOpenTaskDialog = () => {
  setShowTaskDialog(true)
  loadTasks()
}

const renderBudgetComparisonChart = (height: number = 300) => (
  <ResponsiveContainer width="100%" height={height}>
    <AreaChart data={budgetComparisonData}>
      <defs>
        <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
        </linearGradient>
        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis 
        dataKey="month" 
        axisLine={false}
        tickLine={false}
        tick={{ fill: '#888888' }}
      />
      <YAxis 
        axisLine={false}
        tickLine={false}
        tick={{ fill: '#888888' }}
        tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
      />
      <Tooltip 
        formatter={(value) => `${(Number(value) / 1000000).toFixed(2)}M`}
        labelStyle={{ color: '#888888' }}
      />
      <Area 
        type="monotone" 
        dataKey="planned" 
        stroke="#2563eb" 
        fill="url(#colorPlanned)"
        strokeWidth={2}
        name="預算"
      />
      <Area 
        type="monotone" 
        dataKey="actual" 
        stroke="#10b981" 
        fill="url(#colorActual)"
        strokeWidth={2}
        name="實際"
      />
      <Legend />
    </AreaChart>
  </ResponsiveContainer>
)

const renderDepartmentBudgetChart = (height: number = 300) => (
  <ResponsiveContainer width="100%" height={height}>
    <BarChart data={departmentBudgetData}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis 
        dataKey="name"
        axisLine={false}
        tickLine={false}
        tick={{ fill: '#888888' }}
      />
      <YAxis 
        axisLine={false}
        tickLine={false}
        tick={{ fill: '#888888' }}
        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
      />
      <Tooltip 
        formatter={(value) => `${(Number(value) / 1000).toFixed(1)}k`}
        labelStyle={{ color: '#888888' }}
      />
      <Bar 
        dataKey="amount" 
        fill="#4F46E5"
        radius={[4, 4, 0, 0]}
      >
        {departmentBudgetData.map((entry, index) => (
          <Cell 
            key={`cell-${index}`} 
            fill={[
              '#4F46E5',  // Deep blue
              '#EAB308',  // Yellow
              '#93C5FD',  // Light blue
              '#FEF3C7',  // Light yellow
              '#1E3A8A',  // Navy
            ][index % 5]} 
          />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
)

const renderProjectPlanChart = (height: number = 300) => (
  <ResponsiveContainer width="100%" height={height}>
    <AreaChart data={projectPlanData}>
      <defs>
        <linearGradient id="colorProjectAmount" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis 
        dataKey="month" 
        axisLine={false}
        tickLine={false}
        tick={{ fill: '#888888' }}
      />
      <YAxis 
        axisLine={false}
        tickLine={false}
        tick={{ fill: '#888888' }}
        tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
      />
      <Tooltip 
        formatter={(value) => `${(Number(value) / 1000000).toFixed(2)}M`}
        labelStyle={{ color: '#888888' }}
      />
      <Area 
        type="monotone" 
        dataKey="amount" 
        stroke="#10b981" 
        fill="url(#colorProjectAmount)"
        strokeWidth={2}
      />
      <Line 
        type="monotone" 
        dataKey="average" 
        stroke="#888888" 
        strokeDasharray="3 3"
        dot={false}
      />
    </AreaChart>
  </ResponsiveContainer>
)

return (
  <div className="flex h-screen bg-gray-50">
    {/* Sidebar */}
    <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 ease-in-out border-r bg-white`}>
      <div className="flex h-14 items-center border-b px-4">
        {sidebarOpen && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Train className="h-4 w-4 text-primary-foreground" />
            </div>
            <h2 className="text-lg font-semibold">臺鐵會計系統</h2>
          </div>
        )}
        <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
      <div className="px-2 py-2">
        <nav className="flex flex-col gap-1">
          <Button variant="ghost" className={`w-full justify-start gap-2 ${!sidebarOpen && 'justify-center'}`}>
            <LayoutDashboard className="h-4 w-4" />
            {sidebarOpen && <span>Dashboard</span>}
          </Button>
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className={`w-full justify-start gap-2 ${!sidebarOpen && 'justify-center'}`}>
                <FileText className="h-4 w-4" />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left">預算管理</span>
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="ml-4">
              {sidebarOpen && (
                <>
                  <Button variant="ghost" className="w-full justify-start">預算編列</Button>
                  <Button variant="ghost" className="w-full justify-start">預算審查</Button>
                  <Button variant="ghost" className="w-full justify-start">預算執行</Button>
                </>
              )}
            </CollapsibleContent>
          </Collapsible>
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className={`w-full justify-start gap-2 ${!sidebarOpen && 'justify-center'}`}>
                <Receipt className="h-4 w-4" />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left">應付帳款</span>
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="ml-4">
              {sidebarOpen && (
                <>                  
                  <Link href="/invoice" className="w-full">
                    <Button variant="ghost" className="w-full justify-start">
                      發票管理
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start">付款作業</Button>
                </>
              )}
            </CollapsibleContent>
          </Collapsible>
          <Button variant="ghost" className={`w-full justify-start gap-2 ${!sidebarOpen && 'justify-center'}`}>
            <CreditCard className="h-4 w-4" />
            {sidebarOpen && <span>應收帳款</span>}
          </Button>
          <Button variant="ghost" className={`w-full justify-start gap-2 ${!sidebarOpen && 'justify-center'}`}>
            <BookOpen className="h-4 w-4" />
            {sidebarOpen && <span>總帳管理</span>}
          </Button>
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className={`w-full justify-start gap-2 ${!sidebarOpen && 'justify-center'}`}>
                <Receipt className="h-4 w-4" />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left">應付立帳</span>
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="ml-4">
              {sidebarOpen && (
                <>
                  <Button variant="ghost" className="w-full justify-start">廠商管理</Button>
                  
                  
                </>
              )}
            </CollapsibleContent>
          </Collapsible>
        </nav>
      </div>
    </div>

    {/* Main Content */}
    <div className="flex-1 overflow-auto">
      {/* Top Bar */}
      <header className="flex h-14 items-center gap-4 border-b bg-white px-6">
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex-1 flex items-center">
          {searchExpanded ? (
            <div className="w-full flex items-center">
              <Input
                type="search"
                placeholder="搜尋..."
                className="flex-1"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchExpanded(false)}
                className="ml-2"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchExpanded(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Avatar>
            <AvatarImage src="/placeholder.svg" alt="0751002" />
            <AvatarFallback>陳</AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="p-6">
        {/* Updated Tab Navigation */}
        <div className="border-b mb-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-4 relative ${
                  activeTab === tab.id 
                    ? 'text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 transition-all" />
                )}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "budget" && (
          <>
            <div className="grid gap-4 md:grid-cols-6">
              {todoItems.map((item) => (
                <Card 
                  key={item.id} 
                  className="md:col-span-1 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => item.title === "預算編列" && handleOpenTaskDialog()}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`h-8 w-1 ${item.color} rounded-full`} />
                      <div className="flex flex-col">
                        <div className="text-sm font-medium">{item.title}</div>
                        <div className="text-xl font-bold text-gray-900">{item.id}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Account Payable Trend Chart */}
              <Card className="md:col-span-1 lg:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-base font-semibold">預算計畫與實際比較趨勢</CardTitle>
                    <p className="text-sm text-muted-foreground">計畫編號: 951113021C141</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setExpandedChart('budget-comparison')}
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {renderBudgetComparisonChart()}
                </CardContent>
              </Card>

              {/* Department Budget Allocation Chart */}
              <Card className="md:col-span-1 lg:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-base font-semibold">部門預算分配</CardTitle>
                    <p className="text-sm text-muted-foreground">各機廠預算統計</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setExpandedChart('budget')}
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {renderDepartmentBudgetChart()}
                </CardContent>
              </Card>

              {/* Project Plan Trend Chart */}
              <Card className="md:col-span-1 lg:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-base font-semibold">專案計畫趨勢</CardTitle>
                    <p className="text-sm text-muted-foreground">計畫編號: 951113021C141</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setExpandedChart('project')}
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                    <LineChart className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {renderProjectPlanChart()}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>

    {/* 添加待核簽工作清單對話框 */}
    <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>待核簽工作清單</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">單號</TableHead>
                  <TableHead className="w-[200px]">標題</TableHead>
                  <TableHead className="w-[100px]">類型</TableHead>
                  <TableHead className="w-[120px] text-right">金額</TableHead>
                  <TableHead className="w-[100px]">提交人</TableHead>
                  <TableHead className="w-[120px]">提交日期</TableHead>
                  <TableHead className="w-[100px]">狀態</TableHead>
                  <TableHead className="w-[100px] text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingTasks ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse ml-auto" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.id}</TableCell>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>{task.type}</TableCell>
                      <TableCell className="text-right">
                        {task.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{task.submitter}</TableCell>
                      <TableCell>{task.submitDate}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800">
                          {task.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href="/invoice">
                          <Button variant="ghost" size="sm">
                            處理
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
)
}