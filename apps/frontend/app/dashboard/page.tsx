"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Shield,
  Plus,
  Search,
  MoreHorizontal,
  User,
  Settings,
  LogOut,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  AlertTriangle,
  RefreshCcw,
  Zap,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { BACKEND_URL } from "@/lib/config";
import axios from "axios";
import { useRouter } from "next/navigation";

interface ITicks {
  id: string;
  reponseTimeMs: number;
  status: "UP" | "DOWN" | "UNKNOWN";
  regionId: string;
  websiteId: string;
  createdAt: Date;
}

interface IWebsite {
  id: string;
  url: string;
  ticks: ITicks[];
}

export default function DashboardPage() {
  const [websites, setWebsites] = useState<IWebsite[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [filteredWebsites, setFilteredWebsites] = useState<IWebsite[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const fetchWebsites = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/website/websites`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setWebsites(res.data);
    } catch (error: any) {
      alert(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addWebsite = async () => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/website`,
        {
          url: websiteUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setIsOpen(false);
      setWebsites(res.data);
      fetchWebsites();
    } catch (error: any) {
      alert(error.response.data.message);
    }
  };

  const handleRefresh = async () => {
    await fetchWebsites();
  };

  const handleDeleteWebsite = async (websiteId: string) => {
    try {
      await axios.delete(`${BACKEND_URL}/website/${websiteId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchWebsites();
    } catch (error: any) {
      alert(error.response.data.message);
    }
  };

  const handleOnClickWebsiteDetails = async (websiteId: string) => {
    router.push(`/website/${websiteId}`);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(token) {
      fetchWebsites();
    }else {
      router.push('/');
    }
  }, []);

  useEffect(() => {
    if (websites && websites.length > 0) {
      const filteredWebsites = websites?.filter((website) =>
        website.url.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setTimeout(() => {
        setFilteredWebsites(filteredWebsites);
      }, 400);
    }
  }, [searchTerm, websites]);

  const getStatusBadge = (status: string) => {
    if (status === "UP") {
      return (
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30 transition-colors">
          <CheckCircle className="w-3 h-3 mr-1" />
          UP
        </Badge>
      );
    } else if (status === "Checking") {
      return (
        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30 transition-colors">
          <Clock className="w-3 h-3 mr-1" />
          Checking
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30 transition-colors">
          <XCircle className="w-3 h-3 mr-1" />
          DOWN
        </Badge>
      );
    }
  };

  const getResponseTimeColor = (responseTime: number, status: string) => {
    if (status === "DOWN") return "text-red-400";
    if (responseTime < 200) return "text-emerald-400";
    if (responseTime < 500) return "text-amber-400";
    return "text-red-400";
  };

  if (isLoading) {
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
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
            <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold text-lg text-primary hover:opacity-80 transition"
        >
          <div className="p-1.5 bg-gradient-to-br from-green-400 to-blue-500 rounded-full shadow-md">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl text-white font-extrabold tracking-tight">
            BetterStack
          </span>
        </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r bg-gray-900 cursor-pointer text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Website
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-slate-800 border-slate-700 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Add Website
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                      Add website URL to monitor here
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      addWebsite();
                    }}
                  >
                    <div className="grid gap-4">
                      <div className="grid gap-3">
                        <Label htmlFor="url" className="text-slate-300">
                          Website URL:
                        </Label>
                        <Input
                          onChange={(e) => setWebsiteUrl(e.target.value)}
                          id="url"
                          name="url"
                          placeholder="https://google.com"
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <DialogFooter className="mt-6">
                      <DialogClose asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="bg-red-500 hover:bg-red-600 cursor-pointer hover:text-white"
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        type="submit"
                        className="bg-gray-900 hover:bg-gray-950 cursor-pointer"
                      >
                        Add Website
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <Button
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/");
                }}
                className="cursor-pointer"
                variant={"destructive"}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="mt-2 text-slate-400 text-lg">
              Monitor your websites and track their performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/70 transition-all duration-200 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  Total Websites
                </CardTitle>
                <div className="relative">
                  <Globe className="h-5 w-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-md group-hover:bg-blue-300/30 transition-colors"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  {websites.length}
                </div>
                <p className="text-xs text-slate-400 flex items-center mt-1">
                  <Zap className="w-3 h-3 mr-1" />
                  Active monitoring
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/70 transition-all duration-200 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  Websites Up
                </CardTitle>
                <div className="relative">
                  <CheckCircle className="h-5 w-5 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                  <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-md group-hover:bg-emerald-300/30 transition-colors"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-400">
                  {websites &&
                    websites.length > 0 &&
                    websites?.filter((w) => w.ticks[0]?.status === "UP")
                      .length || 0}
                </div>
                <p className="text-xs text-slate-400 flex items-center mt-1">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Currently online
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/70 transition-all duration-200 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  Websites Down
                </CardTitle>
                <div className="relative">
                  <AlertTriangle className="h-5 w-5 text-red-400 group-hover:text-red-300 transition-colors" />
                  <div className="absolute inset-0 bg-red-400/20 rounded-full blur-md group-hover:bg-red-300/30 transition-colors"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-400">
                  {websites &&
                    websites.length > 0 &&
                    websites?.filter((w) => w.ticks[0]?.status === "DOWN")
                      .length || 0}
                </div>
                <p className="text-xs text-slate-400 flex items-center mt-1">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Need attention
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl text-white">
                    Monitored Websites
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Overview of all your monitored websites and their current
                    status
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search websites..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleRefresh}
                    variant="ghost"
                    className="flex items-center cursor-pointer space-x-2 text-slate-300 hover:text-white hover:bg-slate-700/50"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    <span>Refresh</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-slate-700/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700/50 hover:bg-slate-700/30">
                      <TableHead className="text-slate-300 font-semibold">
                        URL
                      </TableHead>
                      <TableHead className="text-slate-300 font-semibold">
                        Status
                      </TableHead>
                      <TableHead className="text-slate-300 font-semibold">
                        Response Time
                      </TableHead>
                      <TableHead className="text-slate-300 font-semibold">
                        Last Checked
                      </TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWebsites.map((website) => (
                      <TableRow
                        key={website.id}
                        className="border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                      >
                        <TableCell>
                          <a
                            href={website.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                          >
                            {website.url}
                          </a>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(
                            website.ticks.length > 0
                              ? website.ticks[0]?.status
                              : "Checking"
                          )}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`font-mono ${getResponseTimeColor(
                              website.ticks[0]?.reponseTimeMs,
                              website.ticks[0]?.status
                            )}`}
                          >
                            {website.ticks.length === 0
                              ? "—"
                              : website.ticks[0]?.status === "DOWN"
                                ? "—"
                                : `${website.ticks[0]?.reponseTimeMs}ms`}
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-400 font-mono">
                          {website.ticks.length > 0
                            ? new Date(
                                website?.ticks[0]?.createdAt
                              ).toLocaleString("en-US", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })
                            : "—"}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700/50"
                              >
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-slate-800 border-slate-700 text-white"
                            >
                              <DropdownMenuLabel className="text-slate-300">
                                Actions
                              </DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleOnClickWebsiteDetails(website.id)
                                }
                                className="text-slate-300 hover:bg-slate-700 hover:text-white"
                              >
                                View details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-slate-700" />
                              <DropdownMenuItem
                                onClick={() => handleDeleteWebsite(website.id)}
                                className="text-red-400 hover:bg-red-500/20 hover:text-red-300"
                              >
                                Remove website
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {filteredWebsites.length === 0 && (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-400 text-lg">
                    No websites found matching your search.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
