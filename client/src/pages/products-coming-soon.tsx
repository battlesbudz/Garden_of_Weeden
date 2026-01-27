import { Leaf, Package } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductsComingSoon() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-28 pb-16 sm:pb-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <div className="bg-garden-green/10 p-6 rounded-full">
              <Package className="h-16 w-16 text-garden-green" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Products <span className="text-garden-green">Coming Soon</span>
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            We're carefully curating a premium selection of cannabis products for you. 
            Check back soon or visit our shop to stay updated.
          </p>
          
          <Card className="mt-12">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Leaf className="h-12 w-12 text-garden-green" />
              </div>
              <CardTitle>Quality is Our Priority</CardTitle>
              <CardDescription>
                We're working hard to bring you the finest cannabis products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Our team is dedicated to sourcing and developing premium products 
                that meet the highest standards. Stay tuned for updates on our 
                product launch.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
