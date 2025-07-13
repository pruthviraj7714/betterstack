"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  Activity,
  TrendingUp,
  Zap,
  Timer,
  Calendar,
  MapPin,
  BarChart3,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import axios from "axios"
import { BACKEND_URL } from "@/lib/config"
import { formatDistance } from "date-fns"

interface ITick {
  id: string
  reponseTimeMs: number
  status: "UP" | "DOWN" | "UNKNOWN"
  regionId: string
  websiteId: string
  createdAt: Date
}

interface IRegionData {
  regionId: string
  regionName: string
  ticks: ITick[]
  uptime: number
  avgResponseTime: number
  currentStatus: "UP" | "DOWN" | "UNKNOWN"
  lastChecked: Date
}

interface IWebsite {
  id: string
  url: string
  regions: IRegionData[]
  globalUptime: number
  totalChecks: number
}

const REGION_NAMES: { [key: string]: string } = {
  "fde53372-5ed1-4224-8674-39caadf3efa9": "India",
  "8d76c6e8-5069-4c06-abb8-812b5a9c317d": "USA",
}

export default function MultiRegionWebsiteDetailsPage() {
  const { websiteId } = useParams()
  const [website, setWebsite] = useState<IWebsite | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  const fetchWebsiteInfo = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/website/status/${websiteId}`, {
        headers : {
          Authorization : `Bearer ${localStorage.getItem("token")}`
        }
      });

      const processedData = processRegionalData(res.data.website);
      setWebsite(processedData)
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }
  
  const processRegionalData = (data: any): IWebsite => {
    const regionMap = new Map<string, ITick[]>()

    data.ticks?.forEach((tick: ITick) => {
      if (!regionMap.has(tick.regionId)) {
        regionMap.set(tick.regionId, [])
      }
      regionMap.get(tick.regionId)?.push(tick)
    })

    const regions: IRegionData[] = Array.from(regionMap.entries()).map(([regionId, ticks]) => {
      const upTicks = ticks.filter((tick) => tick.status === "UP")
      const uptime = ticks.length > 0 ? (upTicks.length / ticks.length) * 100 : 0
      const avgResponseTime =
        upTicks.length > 0 ? Math.round(upTicks.reduce((sum, tick) => sum + tick.reponseTimeMs, 0) / upTicks.length) : 0

      return {
        regionId,
        regionName: REGION_NAMES[regionId] || regionId ,
        ticks: ticks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
        uptime,
        avgResponseTime,
        currentStatus: ticks[0]?.status || "UNKNOWN",
        lastChecked: new Date(ticks[0]?.createdAt || new Date()),
      }
    })

    const totalTicks = regions.reduce((sum, region) => sum + region.ticks.length, 0)
    const totalUpTicks = regions.reduce(
      (sum, region) => sum + region.ticks.filter((tick) => tick.status === "UP").length,
      0,
    )
    const globalUptime = totalTicks > 0 ? (totalUpTicks / totalTicks) * 100 : 0

    return {
      id: data.id,
      url: data.url,
      regions,
      globalUptime,
      totalChecks: totalTicks,
    }
  }

  const getStatusBadge = (status: string) => {
    if (status === "UP") {
      return (
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30 transition-colors">
          <CheckCircle className="w-3 h-3 mr-1" />
          UP
        </Badge>
      )
    } else if (status === "DOWN") {
      return (
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30 transition-colors">
          <XCircle className="w-3 h-3 mr-1" />
          DOWN
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30 transition-colors">
          <AlertTriangle className="w-3 h-3 mr-1" />
          UNKNOWN
        </Badge>
      )
    }
  }

  const getResponseTimeColor = (responseTime: number, status: string) => {
    if (status === "DOWN") return "text-red-400"
    if (responseTime < 150) return "text-emerald-400"
    if (responseTime < 300) return "text-amber-400"
    return "text-red-400"
  }

  const getRegionHealthColor = (uptime: number) => {
    if (uptime >= 99) return "text-emerald-400"
    if (uptime >= 95) return "text-amber-400"
    return "text-red-400"
  }

  useEffect(() => {
    fetchWebsiteInfo()
  }, [])

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/80">
        <div className="relative flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-sm font-medium animate-pulse">
            Loading, please wait...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <header className="relative bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className="text-slate-300 cursor-pointer hover:text-white hover:bg-slate-700/50 mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center">
              <div className="relative">
                <Globe className="h-8 w-8 text-blue-400" />
                <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-lg"></div>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-white">{website?.url}</h1>
                <p className="text-slate-400 text-sm">Multi-Region Monitoring Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/70 transition-all duration-200 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Global Uptime</CardTitle>
                <TrendingUp className="h-5 w-5 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-400">{website?.globalUptime.toFixed(1)}%</div>
                <p className="text-xs text-slate-400 flex items-center mt-1">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Across all regions
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/70 transition-all duration-200 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Active Regions</CardTitle>
                <MapPin className="h-5 w-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">{website?.regions.length || 0}</div>
                <p className="text-xs text-slate-400 flex items-center mt-1">
                  <Globe className="w-3 h-3 mr-1" />
                  Monitoring locations
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/70 transition-all duration-200 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Total Checks</CardTitle>
                <BarChart3 className="h-5 w-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400">{website?.totalChecks || 0}</div>
                <p className="text-xs text-slate-400 flex items-center mt-1">
                  <Activity className="w-3 h-3 mr-1" />
                  All regions combined
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/70 transition-all duration-200 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Healthy Regions</CardTitle>
                <CheckCircle className="h-5 w-5 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-400">
                  {website?.regions.filter((r) => r.currentStatus === "UP").length || 0}/{website?.regions.length || 0}
                </div>
                <p className="text-xs text-slate-400 flex items-center mt-1">
                  <Activity className="w-3 h-3 mr-1" />
                  Currently online
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                Regional Status Overview
              </CardTitle>
              <CardDescription className="text-slate-400">
                Current status and performance metrics for each monitoring region
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {website?.regions.map((region) => (
                  <Card
                    key={region.regionId}
                    className="bg-slate-900/50 border-slate-700/50 hover:bg-slate-900/70 transition-all duration-200"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-white">{region.regionName}</CardTitle>
                        {getStatusBadge(region.currentStatus)}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400">Uptime</span>
                          <span className={`text-sm font-bold ${getRegionHealthColor(region.uptime)}`}>
                            {region.uptime.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400">Avg Response</span>
                          <span
                            className={`text-sm font-bold ${getResponseTimeColor(region.avgResponseTime, region.currentStatus)}`}
                          >
                            {region.avgResponseTime}ms
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400">Last Check</span>
                          <span className="text-xs text-slate-300">
                            {formatDistance(region.lastChecked, new Date(), { addSuffix: true })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400">Total Checks</span>
                          <span className="text-xs text-slate-300">{region.ticks.length}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Tabs value={selectedRegion} onValueChange={setSelectedRegion} className="space-y-6">
            <TabsList className="bg-slate-800/50 border-slate-700/50">
              <TabsTrigger value="all" className="data-[state=active]:bg-slate-700 text-white">
                All Regions
              </TabsTrigger>
              {website?.regions.map((region) => (
                <TabsTrigger key={region.regionId} value={region.regionId} className="data-[state=active]:bg-slate-700 text-white">
                  {region.regionName}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-blue-400" />
                    Global Response Time Overview
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Response times across all monitoring regions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {website?.regions.map((region) => {
                      const maxResponseTime = Math.max(
                        ...region.ticks.filter((t) => t.status === "UP").map((t) => t.reponseTimeMs),
                        1,
                      )

                      return (
                        <div key={region.regionId} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-white">{region.regionName}</h4>
                            {getStatusBadge(region.currentStatus)}
                          </div>
                          <div className="relative h-16 bg-slate-900/50 rounded-lg p-2 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
                            <div className="relative flex items-end justify-between h-full">
                              {region.ticks
                                .slice(0, 10)
                                .reverse()
                                .map((tick, index) => {
                                  const height =
                                    tick.status === "DOWN" ? 4 : (tick.reponseTimeMs / maxResponseTime) * 40 + 8
                                  return (
                                    <div key={tick.id} className="flex flex-col items-center group cursor-pointer">
                                      <div
                                        className={`w-4 rounded-t-lg transition-all duration-300 group-hover:scale-110 ${
                                          tick.status === "DOWN"
                                            ? "bg-red-500/70 hover:bg-red-400"
                                            : tick.reponseTimeMs < 150
                                              ? "bg-emerald-500/70 hover:bg-emerald-400"
                                              : tick.reponseTimeMs < 300
                                                ? "bg-amber-500/70 hover:bg-amber-400"
                                                : "bg-red-500/70 hover:bg-red-400"
                                        }`}
                                        style={{ height: `${height}px` }}
                                      />
                                      <div className="mt-1 text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {tick.status === "DOWN" ? "DOWN" : `${tick.reponseTimeMs}ms`}
                                      </div>
                                    </div>
                                  )
                                })}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {website?.regions.map((region) => (
              <TabsContent key={region.regionId} value={region.regionId} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-300">Current Status</CardTitle>
                      <Activity className="h-5 w-5 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2">{getStatusBadge(region.currentStatus)}</div>
                      <p className="text-xs text-slate-400 mt-2">
                        Last checked {formatDistance(region.lastChecked, new Date(), { addSuffix: true })}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-300">Regional Uptime</CardTitle>
                      <TrendingUp className="h-5 w-5 text-emerald-400" />
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${getRegionHealthColor(region.uptime)}`}>
                        {region.uptime.toFixed(1)}%
                      </div>
                      <p className="text-xs text-slate-400 flex items-center mt-1">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Last {region.ticks.length} checks
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-300">Avg Response</CardTitle>
                      <Timer className="h-5 w-5 text-amber-400" />
                    </CardHeader>
                    <CardContent>
                      <div
                        className={`text-2xl font-bold ${getResponseTimeColor(region.avgResponseTime, region.currentStatus)}`}
                      >
                        {region.avgResponseTime}ms
                      </div>
                      <p className="text-xs text-slate-400 flex items-center mt-1">
                        <Zap className="w-3 h-3 mr-1" />
                        Average response time
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-xl text-white flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-purple-400" />
                      {region.regionName} - Status Timeline
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Chronological view of monitoring checks for this region
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {region.ticks.map((tick, index) => (
                        <div
                          key={tick.id}
                          className="flex items-center space-x-4 p-4 bg-slate-900/30 rounded-lg border border-slate-700/30 hover:bg-slate-900/50 transition-all duration-200 group"
                        >
                          <div className="relative">
                            <div
                              className={`w-4 h-4 rounded-full ${
                                tick.status === "UP" ? "bg-emerald-500" : "bg-red-500"
                              } group-hover:scale-110 transition-transform`}
                            />
                            {index === 0 && (
                              <div
                                className={`absolute inset-0 w-4 h-4 rounded-full animate-ping ${
                                  tick.status === "UP" ? "bg-emerald-500" : "bg-red-500"
                                } opacity-75`}
                              />
                            )}
                          </div>
                          <div className="flex-1 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div>{getStatusBadge(tick.status)}</div>
                              <div>
                                <p className="text-white font-medium">
                                  {tick.status === "UP" ? "Website is online" : "Website is offline"}
                                </p>
                                <p className="text-slate-400 text-sm flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {new Date(tick.createdAt).toLocaleString("en-US", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p
                                className={`text-lg font-mono font-bold ${getResponseTimeColor(
                                  tick.reponseTimeMs,
                                  tick.status,
                                )}`}
                              >
                                {tick.status === "DOWN" ? "—" : `${tick.reponseTimeMs}ms`}
                              </p>
                              <p className="text-slate-400 text-xs">Response time</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  )
}
