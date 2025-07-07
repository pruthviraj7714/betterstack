import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Globe,
  Clock,
  Shield,
  Zap,
  BarChart3,
  Bell,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-gray-800 bg-gray-900">
        <Link className="flex items-center justify-center" href="#">
          <Shield className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-bold">BetterStack</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#features"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#pricing"
          >
            Pricing
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#dashboard"
          >
            Dashboard
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Monitor Your Websites Globally
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                  Get real-time monitoring of your websites every 3 minutes from
                  multiple regions worldwide. Track uptime, response times, and
                  get instant alerts when something goes wrong.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="cursor-pointer" size="lg">
                  Start Monitoring Free
                </Button>

                <Link href={"/signup"}>
                  <Button
                    className="bg-white text-gray-700 hover:bg-white/80 cursor-pointer"
                    size="lg"
                  >
                    Sign up
                  </Button>
                </Link>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-300">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  Free 14-day trial
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  No credit card required
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-800/50"
        >
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Powerful Monitoring Features
                </h2>
                <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to keep your websites running smoothly
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <Clock className="h-10 w-10 text-white" />
                  <CardTitle className="text-white">
                    3-Minute Monitoring
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Continuous monitoring every 3 minutes to catch issues before
                    your users do
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <Globe className="h-10 w-10 text-white" />
                  <CardTitle className="text-white">Global Regions</CardTitle>
                  <CardDescription className="text-gray-400">
                    Monitor from multiple regions worldwide to ensure global
                    performance
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <Zap className="h-10 w-10 text-white" />
                  <CardTitle className="text-white">Real-time Alerts</CardTitle>
                  <CardDescription className="text-gray-400">
                    Instant notifications via email, SMS, or Slack when your
                    site goes down
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <BarChart3 className="h-10 w-10 text-white" />
                  <CardTitle className="text-white">
                    Response Time Tracking
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Monitor response times in milliseconds and track performance
                    trends
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <Bell className="h-10 w-10 text-white" />
                  <CardTitle className="text-white">Status Pages</CardTitle>
                  <CardDescription className="text-gray-400">
                    Beautiful public status pages to keep your users informed
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <Shield className="h-10 w-10 text-white" />
                  <CardTitle className="text-white">99.9% Uptime SLA</CardTitle>
                  <CardDescription className="text-gray-400">
                    Reliable monitoring infrastructure with enterprise-grade
                    uptime
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
        <section id="dashboard" className="w-full py-12 md:py-24 lg:py-32">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Real-time Dashboard
                </h2>
                <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Monitor all your websites from a single, intuitive dashboard
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-6xl py-12">
              <Card className="p-6 bg-gray-800 border-gray-700">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">
                      Website Status Overview
                    </h3>
                    <Badge variant="secondary">
                      Last updated: 2 minutes ago
                    </Badge>
                  </div>
                  <div className="grid gap-4">
                    <Card className="p-4 bg-gray-800 border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="font-medium text-white">
                              example.com
                            </p>
                            <p className="text-sm text-gray-300">Production</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant="secondary"
                            className="bg-green-900 text-green-300"
                          >
                            UP
                          </Badge>
                          <p className="text-sm text-gray-300 mt-1">
                            Response: 245ms
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-4 gap-2 text-xs">
                        <div className="text-center">
                          <p className="font-medium text-white">US East</p>
                          <Badge variant="outline" className="text-green-600">
                            UP
                          </Badge>
                          <p className="text-gray-300">234ms</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-white">EU West</p>
                          <Badge variant="outline" className="text-green-600">
                            UP
                          </Badge>
                          <p className="text-gray-300">189ms</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-white">Asia Pacific</p>
                          <Badge variant="outline" className="text-green-600">
                            UP
                          </Badge>
                          <p className="text-gray-300">312ms</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-white">US West</p>
                          <Badge variant="outline" className="text-green-600">
                            UP
                          </Badge>
                          <p className="text-gray-300">198ms</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 bg-gray-800 border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <XCircle className="h-5 w-5 text-red-500" />
                          <div>
                            <p className="font-medium text-white">
                              api.myapp.com
                            </p>
                            <p className="text-sm text-gray-300">
                              API Endpoint
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="destructive">DOWN</Badge>
                          <p className="text-sm text-gray-300 mt-1">Timeout</p>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-4 gap-2 text-xs">
                        <div className="text-center">
                          <p className="font-medium text-white">US East</p>
                          <Badge variant="outline" className="text-red-600">
                            DOWN
                          </Badge>
                          <p className="text-gray-300">Timeout</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-white">EU West</p>
                          <Badge variant="outline" className="text-red-600">
                            DOWN
                          </Badge>
                          <p className="text-gray-300">Timeout</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-white">Asia Pacific</p>
                          <Badge variant="outline" className="text-green-600">
                            UP
                          </Badge>
                          <p className="text-gray-300">445ms</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-white">US West</p>
                          <Badge variant="outline" className="text-red-600">
                            DOWN
                          </Badge>
                          <p className="text-gray-300">Timeout</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 bg-gray-800 border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="font-medium text-white">
                              blog.company.com
                            </p>
                            <p className="text-sm text-gray-300">Blog</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant="secondary"
                            className="bg-green-900 text-green-300"
                          >
                            UP
                          </Badge>
                          <p className="text-sm text-gray-300 mt-1">
                            Response: 156ms
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-4 gap-2 text-xs">
                        <div className="text-center">
                          <p className="font-medium text-white">US East</p>
                          <Badge variant="outline" className="text-green-600">
                            UP
                          </Badge>
                          <p className="text-gray-300">145ms</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-white">EU West</p>
                          <Badge variant="outline" className="text-green-600">
                            UP
                          </Badge>
                          <p className="text-gray-300">123ms</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-white">Asia Pacific</p>
                          <Badge variant="outline" className="text-green-600">
                            UP
                          </Badge>
                          <p className="text-gray-300">234ms</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-white">US West</p>
                          <Badge variant="outline" className="text-green-600">
                            UP
                          </Badge>
                          <p className="text-gray-300">167ms</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section
          id="pricing"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-800/50"
        >
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Simple, Transparent Pricing
                </h2>
                <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the plan that fits your monitoring needs
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Starter</CardTitle>
                  <CardDescription className="text-gray-400">
                    Perfect for small projects
                  </CardDescription>
                  <div className="text-3xl font-bold text-white">
                    $9<span className="text-sm font-normal">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-white">Up to 5 websites</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-white">3-minute monitoring</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-white">4 global regions</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-white">Email alerts</span>
                    </li>
                  </ul>
                  <Button className="w-full">Get Started</Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Professional</CardTitle>
                    <Badge>Most Popular</Badge>
                  </div>
                  <CardDescription className="text-gray-400">
                    For growing businesses
                  </CardDescription>
                  <div className="text-3xl font-bold text-white">
                    $29<span className="text-sm font-normal">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-white">Up to 25 websites</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-white">1-minute monitoring</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-white">8 global regions</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-white">
                        Email, SMS & Slack alerts
                      </span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-white">Status pages</span>
                    </li>
                  </ul>
                  <Button className="w-full">Get Started</Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Enterprise</CardTitle>
                  <CardDescription className="text-gray-400">
                    For large organizations
                  </CardDescription>
                  <div className="text-3xl font-bold text-white">
                    $99<span className="text-sm font-normal">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-white">Unlimited websites</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-white">30-second monitoring</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-white">12 global regions</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-white">All alert channels</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-white">Priority support</span>
                    </li>
                  </ul>
                  <Button className="w-full">Contact Sales</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Start Monitoring Today
                </h2>
                <p className="max-w-[600px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of developers who trust BetterStack to monitor
                  their websites
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Button size="lg" className="w-full">
                  Start Free Trial
                </Button>
                <p className="text-xs text-gray-300">
                  14-day free trial • No credit card required
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
