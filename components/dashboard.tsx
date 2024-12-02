"use client"

import { useState } from 'react'
import { BarChart3, BookOpen, ChevronDown, ChevronLeft, ChevronRight, CreditCard, FileText, LayoutDashboard, LineChart, LogOut, Maximize2, Menu, Minimize2, PieChart as PieChartIcon, Receipt, Search, Settings, Train, ClipboardList, TrendingUp, X } from 'lucide-react'
import { 
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
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
import Link from 'next/link'
import { InvoiceForm } from "@/components/invoice-form"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Label } from "@/components/ui/label"


export function DashboardComponent() {
const [sidebarOpen, setSidebarOpen] = useState(true)
const [searchExpanded, setSearchExpanded] = useState(false)
const [activeTab, setActiveTab] = useState("budget")
const [expandedChart, setExpandedChart] = useState<string | null>(null)
const [showTaskDialog, setShowTaskDialog] = useState(false)
const [isLoadingTasks, setIsLoadingTasks] = useState(false)
const [selectedUnit, setSelectedUnit] = useState("富岡機廠")
const [selectedAccount, setSelectedAccount] = useState("510206-2809-31F")
const [selectedProject, setSelectedProject] = useState("951113021C141")

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
  { id: 23, title: "預算動", color: "bg-yellow-500" },
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
  { name: "富岡機廠", budget: 350000, actual: 320000 },
  { name: "潮州機廠", budget: 320000, actual: 310000 },
  { name: "花蓮機廠", budget: 280000, actual: 260000 },
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

const budgetSubItems = [  
  { id: "budget-planning", label: "預算編列" },  
  { id: "budget-execution", label: "預算動支" },
  { id: "budget-verification", label: "預算核銷" },
  { id: "budget-adjustment", label: "預算調整" },
  { id: "budget-review", label: "預算審查" },
  { id: "budget-analysis", label: "分析、比較報表" },
]

const tabs = [
  { 
    id: "budget", 
    label: "預算管理", 
    icon: <FileText className="h-4 w-4" />,
    subTabs: [      
      { id: "budget-planning", label: "預算編列" },      
      { id: "budget-execution", label: "預算動支" },
      { id: "budget-verification", label: "預算核銷" },
      { id: "budget-adjustment", label: "預算調整" },
      { id: "budget-review", label: "預算審查" },
      { id: "budget-analysis", label: "分析、比較報表" },
    ]
  },
  { 
    id: "payable", 
    label: "應付帳款管理", 
    icon: <Receipt className="h-4 w-4" />,
    subTabs: [
      { id: "payable-main", label: "應付帳款" },
      { id: "payment-process", label: "付款作業" },
      { id: "vendor-management", label: "廠商管理" },
      { id: "bank-maintenance", label: "銀行主檔維護" }
    ]
  },
  { 
    id: "receivable", 
    label: "應收帳款管理", 
    icon: <CreditCard className="h-4 w-4" />,
    subTabs: [
      { id: "receivable-main", label: "應收帳款" },
      { id: "collection-process", label: "收款、沖帳作業" },
      { id: "customer-management", label: "客戶管理" },
      { id: "collection-management", label: "催收作業" }
    ]
  },
  { 
    id: "ledger", 
    label: "總帳管理", 
    icon: <BookOpen className="h-4 w-4" />,
    subTabs: [
      { id: "voucher-maintenance", label: "總帳傳票維護" },
      { id: "account-query", label: "科目明細、餘額查詢" },
      { id: "ledger-maintenance", label: "總帳主檔維護" },
      { id: "ledger-period", label: "總帳開關帳期間" }
    ]
  },
  { 
    id: "invoice", 
    label: "發票管理", 
    icon: <Receipt className="h-4 w-4" />,
    subTabs: [
      { id: "invoice-maintenance", label: "發票主檔維護" },
      { id: "input-vat", label: "進項發票作業" },
      { id: "output-vat", label: "銷項發票作業" },
      { id: "zero-rate", label: "零稅率作業" },
      { id: "invoice-period", label: "發票開關帳期間" },
      { id: "vat-declaration", label: "發票申報作業" }
    ]
  },
  { 
    id: "apply", 
    label: "申請作業", 
    icon: <ClipboardList className="h-4 w-4" />,
    subTabs: [] // 如果申請作業沒有子選單，可以保持空陣列
  }
] as const;

const [activeSubTab, setActiveSubTab] = useState<string | null>("budget-analysis")

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

// 修改為 Tableau 的配色方案
const chartColors = {
  // Tableau 10 經典配色
  blue: '#4E79A7',       // 深藍
  orange: '#F28E2B',     // 橘色
  red: '#E15759',        // 紅色
  teal: '#76B7B2',       // 青綠
  green: '#59A14F',      // 綠色
  yellow: '#EDC948',     // 黃色
  purple: '#B07AA1',     // 紫色
  pink: '#FF9DA7',       // 粉色
  brown: '#9C755F',      // 棕色
  gray: '#BAB0AC',       // 灰色
  
  // 擴展配色
  lightBlue: '#86BCF7',  
  lightGreen: '#7EC37E',
  
  // 用於圖表的主要配色
  primary: '#4E79A7',    // 使用深藍作為主色
  secondary: '#59A14F',  // 使用綠色作為輔色
}

// 添加新的數據結構和處理函數
interface BudgetData {
  [key: string]: {
    [key: string]: {
      month: string;
      planned: number;
      actual: number;
    }[];
  };
}

const budgetDataByUnit: BudgetData = {
  "富岡機廠": {
    "951113021C141": [
      { month: "7月", planned: 15000000, actual: 14500000 },
      { month: "8月", planned: 16000000, actual: 15800000 },
      { month: "9月", planned: 15500000, actual: 16000000 },
      { month: "10月", planned: 17000000, actual: 16500000 },
      { month: "11月", planned: 18000000, actual: 17500000 },
      { month: "12月", planned: 22000000, actual: 21000000 },
      { month: "1月", planned: 20000000, actual: 18000000 },
    ],
    "951113021C142": [
      // 可以添加其他專案的數據...
    ]
  },
  "潮州機廠": {
    "951113021C142": [
      { month: "7月", planned: 10000000, actual: 7000000 },
      { month: "8月", planned: 11000000, actual: 9000000 },
      { month: "9月", planned: 11500000, actual: 9500000 },
      { month: "10月", planned: 12000000, actual: 8250000 },
      { month: "11月", planned: 13000000, actual: 8750000 },
      { month: "12月", planned: 15000000, actual: 10500000 },
      { month: "1月", planned: 10000000, actual: 11500000 },
    ]
  },
  "花蓮機廠": {
    "951113021C143": [  // 添加花蓮機廠的數據
      { month: "7月", planned: 8000000, actual: 5600000 },   // 80% of 潮州
      { month: "8月", planned: 8800000, actual: 7200000 },
      { month: "9月", planned: 9200000, actual: 7600000 },
      { month: "10月", planned: 9600000, actual: 6600000 },
      { month: "11月", planned: 10400000, actual: 7000000 },
      { month: "12月", planned: 12000000, actual: 8400000 },
      { month: "1月", planned: 8000000, actual: 9200000 },
    ]
  }
}

// 修改處理篩選的函數
const handleApplyFilter = () => {
  // 獲取選中單位的數據
  const unitData = budgetDataByUnit[selectedUnit]?.[selectedProject] || [];
  
  // 計算實際金額總和
  const actualTotal = unitData.reduce((sum, item) => sum + item.actual, 0);
  const plannedTotal = unitData.reduce((sum, item) => sum + item.planned, 0);
  const totalBudget = 600000000; // 6億預算
  const unexecutedAmount = totalBudget - actualTotal; // 未執行金額

  // 計算各機廠的預算和實際金額總和
  const departmentTotals = {
    "富岡機廠": budgetDataByUnit["富岡機廠"]["951113021C141"]?.reduce(
      (acc, item) => ({
        planned: acc.planned + item.planned,
        actual: acc.actual + item.actual
      }),
      { planned: 0, actual: 0 }
    ),
    "潮州機廠": budgetDataByUnit["潮州機廠"]["951113021C142"]?.reduce(
      (acc, item) => ({
        planned: acc.planned + item.planned,
        actual: acc.actual + item.actual
      }),
      { planned: 0, actual: 0 }
    ),
    "花蓮機廠": budgetDataByUnit["花蓮機廠"]["951113021C143"]?.reduce(
      (acc, item) => ({
        planned: acc.planned + item.planned,
        actual: acc.actual + item.actual
      }),
      { planned: 0, actual: 0 }
    ) // 如果有花蓮機廠的數據也可以加入
  };
  
  // 更新圖表數據
  setBudgetData({
    comparisonData: unitData.map(item => ({
      month: item.month,
      planned: item.planned,
      actual: item.actual
    })),
    departmentData: [
      { 
        name: "富岡機廠", 
        budget: departmentTotals["富岡機廠"]?.planned || 0, 
        actual: departmentTotals["富岡機廠"]?.actual || 0 
      },
      { 
        name: "潮州機廠", 
        budget: departmentTotals["潮州機廠"]?.planned || 0, 
        actual: departmentTotals["潮州機廠"]?.actual || 0 
      },
      { 
        name: "花蓮機廠", 
        budget: departmentTotals["花蓮機廠"]?.planned || 0, 
        actual: departmentTotals["花蓮機廠"]?.actual || 0 
      }
    ],
    projectData: [
      { 
        name: "實際執行", 
        value: actualTotal,
        fill: chartColors.blue,
      },
      { 
        name: "未執行金額", 
        value: unexecutedAmount > 0 ? unexecutedAmount : 0,
        fill: chartColors.secondary,
      }
    ]
  });
}

// 修改初始狀態設定
const [budgetData, setBudgetData] = useState(() => {
  // 獲取富岡機廠的初始數據
  const initialUnitData = budgetDataByUnit["富岡機廠"]["951113021C141"];
  const initialActualTotal = initialUnitData.reduce((sum, item) => sum + item.actual, 0);
  const totalBudget = 600000000;
  const unexecutedAmount = totalBudget - initialActualTotal;

  // 計算初始的部門數據
  const initialDepartmentTotals = {
    "富岡機廠": budgetDataByUnit["富岡機廠"]["951113021C141"].reduce(
      (acc, item) => ({
        planned: acc.planned + item.planned,
        actual: acc.actual + item.actual
      }),
      { planned: 0, actual: 0 }
    ),
    "潮州機廠": budgetDataByUnit["潮州機廠"]["951113021C142"].reduce(
      (acc, item) => ({
        planned: acc.planned + item.planned,
        actual: acc.actual + item.actual
      }),
      { planned: 0, actual: 0 }
    ),
    "花蓮機廠": budgetDataByUnit["花蓮機廠"]["951113021C143"].reduce(
      (acc, item) => ({
        planned: acc.planned + item.planned,
        actual: acc.actual + item.actual
      }),
      { planned: 0, actual: 0 }
    )
  };

  return {
    comparisonData: initialUnitData.map(item => ({
      month: item.month,
      planned: item.planned,
      actual: item.actual
    })),
    departmentData: [
      { 
        name: "富岡機廠", 
        budget: initialDepartmentTotals["富岡機廠"].planned, 
        actual: initialDepartmentTotals["富岡機廠"].actual 
      },
      { 
        name: "潮州機廠", 
        budget: initialDepartmentTotals["潮州機廠"].planned, 
        actual: initialDepartmentTotals["潮州機廠"].actual 
      },
      { 
        name: "花蓮機廠", 
        budget: initialDepartmentTotals["花蓮機廠"].planned, 
        actual: initialDepartmentTotals["花蓮機廠"].actual 
      }
    ],
    projectData: [
      { 
        name: "實際執行", 
        value: initialActualTotal,
        fill: chartColors.blue,
      },
      { 
        name: "未執行金額", 
        value: unexecutedAmount,
        fill: chartColors.secondary,
      }
    ]
  };
});

// 修改圖表渲染函數，使用 budgetData 中的數據
const renderBudgetComparisonChart = (height: number = 300) => (
  <ResponsiveContainer width="100%" height={height}>
    <AreaChart data={budgetData.comparisonData}>
      <defs>
        <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={chartColors.blue} stopOpacity={0.3}/>
          <stop offset="95%" stopColor={chartColors.blue} stopOpacity={0}/>
        </linearGradient>
        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={chartColors.green} stopOpacity={0.3}/>
          <stop offset="95%" stopColor={chartColors.green} stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
      <XAxis 
        dataKey="month" 
        axisLine={false}
        tickLine={false}
        tick={{ fill: '#666666' }}
      />
      <YAxis 
        axisLine={false}
        tickLine={false}
        tick={{ fill: '#666666' }}
        tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
      />
      <Tooltip 
        formatter={(value) => `${(Number(value) / 1000000).toFixed(2)}M`}
        labelStyle={{ color: '#666666' }}
        contentStyle={{ 
          backgroundColor: 'white',
          border: '1px solid #E5E7EB',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      />
      <Area 
        type="monotone" 
        dataKey="planned" 
        stroke={chartColors.blue}
        fill="url(#colorPlanned)"
        strokeWidth={2}
        name="預算"
      />
      <Area 
        type="monotone" 
        dataKey="actual" 
        stroke={chartColors.green}
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
    <BarChart data={budgetData.departmentData}>
      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
      <XAxis 
        dataKey="name"
        axisLine={false}
        tickLine={false}
        tick={{ fill: '#666666' }}
      />
      <YAxis 
        axisLine={false}
        tickLine={false}
        tick={{ fill: '#666666' }}
        tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
      />
      <Tooltip 
        formatter={(value) => `${(Number(value) / 1000000).toFixed(2)}M`}
        labelStyle={{ color: '#666666' }}
        contentStyle={{ 
          backgroundColor: 'white',
          border: '1px solid #E5E7EB',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      />
      <Legend />
      <Bar 
        dataKey="budget" 
        fill={chartColors.blue}
        name="預算"
        radius={[4, 4, 0, 0]}
      />
      <Bar 
        dataKey="actual" 
        fill={chartColors.green}
        name="實際"
        radius={[4, 4, 0, 0]}
      />
    </BarChart>
  </ResponsiveContainer>
)

const renderProjectBudgetChart = (height: number = 300) => (
  <ResponsiveContainer width="100%" height={height}>
    <RechartsPieChart>
      <Pie
        data={budgetData.projectData}
        cx="50%"
        cy="50%"
        innerRadius={0}
        outerRadius={100}
        paddingAngle={0}
        dataKey="value"
        labelLine={{ stroke: '#666666', strokeWidth: 1 }}
        label={({ name, value, percent }) => {
          return `${(percent * 100).toFixed(1)}%`
        }}
      >
        {budgetData.projectData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.fill} />
        ))}
      </Pie>
      <Tooltip 
        formatter={(value) => `${(Number(value) / 1000000).toFixed(2)}M`}
        labelStyle={{ color: '#666666' }}
        contentStyle={{ 
          backgroundColor: 'white',
          border: '1px solid #E5E7EB',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      />
      <Legend 
        verticalAlign="bottom"
        height={36}
        formatter={(value, entry) => {
          const { payload } = entry as any
          const total = budgetData.projectData.reduce((sum, item) => sum + item.value, 0)
          const percent = (payload.value / total * 100).toFixed(1)
          return `${value} (${percent}%)`
        }}
      />
    </RechartsPieChart>
  </ResponsiveContainer>
)

// 添加專案計畫對應關係的類型定義
const projectsByUnit: Record<string, string[]> = {
  "富岡機廠": ["951113021C141"],
  "潮州機廠": ["951113021C142"],
  "花蓮機廠": ["951113021C143"]
}

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
                  {budgetSubItems.map((item) => (
                    <Button 
                      key={item.id}
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => {
                        setActiveTab(item.id)
                        if (item.id === "budget-analysis") {
                          // 處理分析報表的邏輯
                        }
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
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
                    <span className="flex-1 text-left">應付帳款管理</span>
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="ml-4">
              {sidebarOpen && (
                <>                                                    
                  <Button variant="ghost" className="w-full justify-start">應付帳款</Button>
                  <Button variant="ghost" className="w-full justify-start">付款作業</Button>
                  <Button variant="ghost" className="w-full justify-start">廠商管理</Button>
                  <Button variant="ghost" className="w-full justify-start">銀行主檔維護</Button>
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
                    <span className="flex-1 text-left">應收帳款管理</span>
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
                    應收帳款
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start">收款、沖帳作業</Button>
                  <Button variant="ghost" className="w-full justify-start">客戶管理</Button>
                  <Button variant="ghost" className="w-full justify-start">催收作業</Button>
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
                    <span className="flex-1 text-left">總帳管理</span>
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
                      總帳傳票維護
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start">科目明細、餘額查詢</Button>
                  <Button variant="ghost" className="w-full justify-start">總帳主檔維護</Button>
                  <Button variant="ghost" className="w-full justify-start">總帳開關帳期間</Button>
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
      <main className="p-6 bg-slate-50">
        {/* Tab Navigation Card */}
        <Card className="mb-6 bg-white">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <div className="flex space-x-8 pb-4 border-b">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id)
                      if (tab.id === "budget") {
                        setActiveSubTab("budget-analysis")
                      } else {
                        setActiveSubTab(null)
                      }
                    }}
                    className={`flex items-center gap-2 relative ${
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
              
              {/* 子標籤導航 */}
              {activeTab && (
                <div className="flex space-x-4 pt-4">
                  {tabs.find(t => t.id === activeTab)?.subTabs?.map((subTab) => (
                    <button
                      key={subTab.id}
                      onClick={() => setActiveSubTab(subTab.id)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        activeSubTab === subTab.id
                          ? 'bg-blue-100 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {subTab.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {activeTab === "budget" && activeSubTab === "budget-analysis" && (
          <>
            {/* 篩選條件 Card */}
            <Card className="mb-6 w-full">
              <CardContent className="py-3">
                <div className="flex items-start gap-4">  {/* 改為 flex 並添加 gap */}
                  <div className="space-y-3 w-[340px]">
                    <div className="flex items-center">
                      <Label htmlFor="unit" className="w-24">作業單位</Label>
                      <Select 
                        value={selectedUnit} 
                        onValueChange={(value) => {
                          setSelectedUnit(value);
                          // 自動選擇對應的專案計畫
                          setSelectedProject(projectsByUnit[value][0]);
                        }}
                      >
                        <SelectTrigger id="unit" className="w-[240px]">
                          <SelectValue placeholder="選擇作業單位" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="富岡機廠">富岡機廠</SelectItem>
                          <SelectItem value="潮州機廠">潮州機廠</SelectItem>
                          <SelectItem value="花蓮機廠">花蓮機廠</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center">
                      <Label htmlFor="account" className="w-24">會計科目</Label>
                      <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                        <SelectTrigger id="account" className="w-[240px]">
                          <SelectValue placeholder="選擇會計科目" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="510206-2809-31F">510206-2809-31F</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center">
                      <Label htmlFor="project" className="w-24">專案計畫</Label>
                      <Select 
                        value={selectedProject} 
                        onValueChange={setSelectedProject}
                      >
                        <SelectTrigger id="project" className="w-[240px]">
                          <SelectValue placeholder="選擇專案計畫編號" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* 根據選擇的作業單位動態顯示對應的專案計畫 */}
                          {projectsByUnit[selectedUnit]?.map((project) => (
                            <SelectItem key={project} value={project}>
                              {project}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button 
                    onClick={handleApplyFilter}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    套用篩選
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 圖表區域 */}
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Account Payable Trend Chart */}
              <Card className="md:col-span-1 lg:col-span-1 bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-base font-semibold">預算與實際比較趨勢</CardTitle>
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
              <Card className="md:col-span-1 lg:col-span-1 bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-base font-semibold">部門預算與實際比較</CardTitle>
                    <p className="text-sm text-muted-foreground">各機廠預算/實際</p>
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
              <Card className="md:col-span-1 lg:col-span-1 bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-base font-semibold">預算執行率</CardTitle>
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
                    <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {renderProjectBudgetChart()}
                </CardContent>
              </Card>
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

            {/* 添加展開圖表的對話框 */}
            <Dialog open={expandedChart === 'budget-comparison'} onOpenChange={() => setExpandedChart(null)}>
              <DialogContent className="max-w-[900px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <div>
                    <DialogTitle className="text-base font-semibold">預算與實際比較明細</DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      作業單位：{selectedUnit} | 會計科目：{selectedAccount} | 計畫編號：{selectedProject}
                    </p>
                  </div>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="h-[400px]">
                    {renderBudgetComparisonChart(400)}
                  </div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>項目</TableHead>
                          <TableHead>Jul-23</TableHead>
                          <TableHead>Aug-23</TableHead>
                          <TableHead>Sep-23</TableHead>
                          <TableHead>Oct-23</TableHead>
                          <TableHead>Nov-23</TableHead>
                          <TableHead>Dec-23</TableHead>
                          <TableHead>Jan-24</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">預算金額</TableCell>
                          {budgetData.comparisonData.map((row) => (
                            <TableCell key={`budget-${row.month}`}>
                              {row.planned.toLocaleString()}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">實際金額</TableCell>
                          {budgetData.comparisonData.map((row) => (
                            <TableCell key={`actual-${row.month}`}>
                              {row.actual.toLocaleString()}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">差異金額</TableCell>
                          {budgetData.comparisonData.map((row) => (
                            <TableCell 
                              key={`diff-${row.month}`}
                              className={`text-right ${
                                row.actual - row.planned > 0 
                                  ? 'text-rose-600'
                                  : row.actual - row.planned < 0 
                                    ? 'text-emerald-600'
                                    : ''
                              }`}
                            >
                              {(row.actual - row.planned).toLocaleString()}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">達成率</TableCell>
                          {budgetData.comparisonData.map((row) => (
                            <TableCell 
                              key={`rate-${row.month}`}
                              className={`text-right ${
                                (row.actual / row.planned) < 1 
                                  ? 'text-rose-600'
                                  : 'text-emerald-600'
                              }`}
                            >
                              {((row.actual / row.planned) * 100).toFixed(1)}%
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* 添加部門預算比較的展開對話框 */}
            <Dialog open={expandedChart === 'budget'} onOpenChange={() => setExpandedChart(null)}>
              <DialogContent className="max-w-[900px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <div>
                    <DialogTitle className="text-base font-semibold">部門預算與實際比較明細</DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      作業單位：{selectedUnit} | 會計科目：{selectedAccount} | 計畫編號：{selectedProject}
                    </p>
                  </div>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="h-[400px]">
                    {renderDepartmentBudgetChart(400)}
                  </div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>機廠名稱</TableHead>
                          <TableHead className="text-right">預算金額</TableHead>
                          <TableHead className="text-right">實際金額</TableHead>
                          <TableHead className="text-right">差異金額</TableHead>
                          <TableHead className="text-right">執行率</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {departmentBudgetData.map((data) => (
                          <TableRow key={data.name}>
                            <TableCell>{data.name}</TableCell>
                            <TableCell className="text-right">{data.budget.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{data.actual.toLocaleString()}</TableCell>
                            <TableCell 
                              className={`text-right ${
                                data.actual - data.budget > 0 
                                  ? `text-[${chartColors.red}]`  // 使用 Tableau 的紅色
                                  : data.actual - data.budget < 0 
                                    ? `text-[${chartColors.green}]`  // 使用 Tableau 的綠色
                                    : ''
                              }`}
                            >
                              {(data.actual - data.budget).toLocaleString()}
                            </TableCell>
                            <TableCell 
                              className={`text-right ${
                                (data.actual / data.budget) < 1 
                                  ? 'text-red-600' 
                                  : 'text-green-600'
                              }`}
                            >
                              {((data.actual / data.budget) * 100).toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* 添加預算執行率的展開對話框 */}
            <Dialog open={expandedChart === 'project'} onOpenChange={() => setExpandedChart(null)}>
              <DialogContent className="max-w-[900px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <div>
                    <DialogTitle className="text-base font-semibold">預算執行率明細</DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      作業單位：{selectedUnit} | 會計科目：{selectedAccount} | 計畫編號：{selectedProject}
                    </p>
                  </div>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="h-[400px]">
                    {renderProjectBudgetChart(400)}
                  </div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>項目</TableHead>
                          <TableHead className="text-right">金額</TableHead>
                          <TableHead className="text-right">比例</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {budgetData.projectData.map((data) => (
                          <TableRow key={data.name}>
                            <TableCell>{data.name}</TableCell>
                            <TableCell className="text-right">{data.value.toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                              {((data.value / budgetData.projectData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell className="font-medium">總計</TableCell>
                          <TableCell className="text-right font-medium">
                            {budgetData.projectData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right font-medium">100%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </main>
    </div>
  </div>
)
}