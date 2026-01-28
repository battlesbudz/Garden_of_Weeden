import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Package, Tags, LayoutDashboard, Mail, Download, Settings, Users, FileText, Home, Image, ShoppingBag, ClipboardList } from "lucide-react";
import BrandsManager from "@/components/admin/brands-manager";
import ProductsManager from "@/components/admin/products-manager";
import ShopManager from "@/components/admin/shop-manager";
import OrdersManager from "@/components/admin/orders-manager";
import SettingsManager from "@/components/admin/settings-manager";
import UsersManager from "@/components/admin/users-manager";
import BlogManager from "@/components/admin/blog-manager";
import HomepageManager from "@/components/admin/homepage-manager";
import MediaLibrary from "@/components/admin/media-library";
import AdminTutorial from "@/components/admin/admin-tutorial";

interface NewsletterSubscriber {
  id: number;
  email: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("brands");

  const { data: adminCheck, isLoading: checkingAdmin } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/admin/check"],
    enabled: isAuthenticated,
  });
  
  // Show loading while auth is checking OR admin check is in progress
  const isVerifying = authLoading || (isAuthenticated && checkingAdmin);

  const { data: subscribers, isLoading: loadingSubscribers } = useQuery<NewsletterSubscriber[]>({
    queryKey: ["/api/admin/subscribers"],
    enabled: isAuthenticated && adminCheck?.isAdmin,
  });

  const handleExportSubscribers = () => {
    window.open("/api/admin/download/subscribers", "_blank");
  };

  // Show loading spinner while verifying
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-battles-black">
        <Navigation />
        <div className="container mx-auto px-4 pt-28 pb-20 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-battles-gold border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Verifying admin access...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-battles-black">
        <Navigation />
        <div className="container mx-auto px-4 pt-28 pb-20 text-center">
          <Shield className="w-16 h-16 mx-auto text-battles-gold mb-4" />
          <h1 className="text-3xl font-bold text-white mb-4">Admin Access Required</h1>
          <p className="text-gray-400 mb-8">Please log in to access the admin dashboard.</p>
          <Button onClick={() => setLocation("/login")} className="bg-battles-gold text-black hover:bg-battles-gold/90">
            Log In
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Logged in but not admin
  if (!adminCheck?.isAdmin) {
    return (
      <div className="min-h-screen bg-battles-black">
        <Navigation />
        <div className="container mx-auto px-4 pt-28 pb-20 text-center">
          <Shield className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-8">You do not have permission to access the admin dashboard.</p>
          <Button onClick={() => setLocation("/")} variant="outline" className="border-battles-gold text-battles-gold hover:bg-battles-gold hover:text-black">
            Go Home
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-battles-black">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <LayoutDashboard className="w-10 h-10 text-battles-gold" />
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400">Manage your shop content and settings</p>
            </div>
          </div>
          <AdminTutorial onTabChange={setActiveTab} currentTab={activeTab} />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-zinc-900 border border-zinc-800 flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="brands" className="data-[state=active]:bg-battles-gold data-[state=active]:text-black">
              <Tags className="w-4 h-4 mr-2" />
              Brands
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-battles-gold data-[state=active]:text-black">
              <Package className="w-4 h-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="shop" className="data-[state=active]:bg-battles-gold data-[state=active]:text-black">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Shop
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-battles-gold data-[state=active]:text-black">
              <ClipboardList className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="subscribers" className="data-[state=active]:bg-battles-gold data-[state=active]:text-black">
              <Mail className="w-4 h-4 mr-2" />
              Subscribers
            </TabsTrigger>
            <TabsTrigger value="blog" className="data-[state=active]:bg-battles-gold data-[state=active]:text-black">
              <FileText className="w-4 h-4 mr-2" />
              Blog
            </TabsTrigger>
            <TabsTrigger value="homepage" className="data-[state=active]:bg-battles-gold data-[state=active]:text-black">
              <Home className="w-4 h-4 mr-2" />
              Homepage
            </TabsTrigger>
            <TabsTrigger value="media" className="data-[state=active]:bg-battles-gold data-[state=active]:text-black">
              <Image className="w-4 h-4 mr-2" />
              Media
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-battles-gold data-[state=active]:text-black">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-battles-gold data-[state=active]:text-black">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="brands">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Tags className="w-5 h-5 text-battles-gold" />
                  Brand Management
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Add, edit, and manage the brands displayed on your shop page. Brands help customers filter and find products easily.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BrandsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-battles-gold" />
                  Product Management
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Add, edit, and manage the products displayed on your shop page. Set prices, categories, and mark items as featured.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProductsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shop">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-battles-gold" />
                  Shop Management
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Import products from your catalog to display on the shop page. Set shop-specific pricing and quantities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ShopManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-battles-gold" />
                  Order Management
                </CardTitle>
                <CardDescription className="text-gray-400">
                  View and manage customer orders. Update order status and track payments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OrdersManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscribers">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Mail className="w-5 h-5 text-battles-gold" />
                      Newsletter Subscribers
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      View all users who have signed up for email updates.
                    </CardDescription>
                  </div>
                  {subscribers && subscribers.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportSubscribers}
                      className="border-battles-gold/50 text-battles-gold hover:bg-battles-gold hover:text-black"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {loadingSubscribers ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-battles-gold border-t-transparent rounded-full"></div>
                  </div>
                ) : subscribers && subscribers.length > 0 ? (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-400 mb-4">
                      Total subscribers: <span className="text-battles-gold font-semibold">{subscribers.length}</span>
                    </div>
                    <div className="rounded-md border border-zinc-800 overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                            <TableHead className="text-gray-300">Email</TableHead>
                            <TableHead className="text-gray-300">Signed Up</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {subscribers.map((subscriber) => (
                            <TableRow key={subscriber.id} className="border-zinc-800 hover:bg-zinc-800/50">
                              <TableCell className="text-white font-medium">{subscriber.email}</TableCell>
                              <TableCell className="text-gray-400">
                                {new Date(subscriber.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    No subscribers yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blog">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-battles-gold" />
                  Blog Management
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Create, edit, and publish blog posts. Share news, updates, and educational content with your audience.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BlogManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="homepage">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Home className="w-5 h-5 text-battles-gold" />
                  Homepage Content
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Customize the text and messaging on your homepage. Edit headlines, taglines, and feature descriptions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HomepageManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Image className="w-5 h-5 text-battles-gold" />
                  Media Library
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Upload and manage images for use across your website. All uploaded files are organized here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MediaLibrary />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-battles-gold" />
                  User Management
                </CardTitle>
                <CardDescription className="text-gray-400">
                  View all registered users and manage their roles. Promote users to admin or demote them to regular customer access.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UsersManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-battles-gold" />
                  Site Settings
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configure your website's general information, contact details, and social media links. These settings appear across the site.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SettingsManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
