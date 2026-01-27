import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Package, Tags, LayoutDashboard, Mail } from "lucide-react";
import BrandsManager from "@/components/admin/brands-manager";
import ProductsManager from "@/components/admin/products-manager";

interface NewsletterSubscriber {
  id: number;
  email: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const { data: adminCheck, isLoading: checkingAdmin } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/admin/check"],
    enabled: isAuthenticated,
  });

  const { data: subscribers, isLoading: loadingSubscribers } = useQuery<NewsletterSubscriber[]>({
    queryKey: ["/api/admin/subscribers"],
    enabled: isAuthenticated && adminCheck?.isAdmin,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-battles-black">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
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

  if (checkingAdmin) {
    return (
      <div className="min-h-screen bg-battles-black">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-battles-gold border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Verifying admin access...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!adminCheck?.isAdmin) {
    return (
      <div className="min-h-screen bg-battles-black">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <LayoutDashboard className="w-10 h-10 text-battles-gold" />
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400">Manage your shop content and settings</p>
          </div>
        </div>

        <Tabs defaultValue="brands" className="space-y-6">
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="brands" className="data-[state=active]:bg-battles-gold data-[state=active]:text-black">
              <Tags className="w-4 h-4 mr-2" />
              Brands
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-battles-gold data-[state=active]:text-black">
              <Package className="w-4 h-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="subscribers" className="data-[state=active]:bg-battles-gold data-[state=active]:text-black">
              <Mail className="w-4 h-4 mr-2" />
              Subscribers
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
                  Add, edit, and manage the brands displayed on your shop page.
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
                  Add, edit, and manage the products displayed on your shop page.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProductsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscribers">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-battles-gold" />
                  Newsletter Subscribers
                </CardTitle>
                <CardDescription className="text-gray-400">
                  View all users who have signed up for email updates.
                </CardDescription>
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
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
