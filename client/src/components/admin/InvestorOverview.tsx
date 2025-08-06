import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, FileText, TrendingUp, Edit } from "lucide-react";

interface InvestorOverviewProps {
  accessRequests: any[];
  totalInvestors: number;
  activeInvestors: number;
  totalInvestment: string;
  monthlyGrowth: string;
}

export function InvestorOverview({ 
  accessRequests, 
  totalInvestors, 
  activeInvestors, 
  totalInvestment, 
  monthlyGrowth 
}: InvestorOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-battles-gold">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-battles-gold">
              Total Investors
            </CardTitle>
            <Users className="h-4 w-4 text-battles-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalInvestors}</div>
            <p className="text-xs text-gray-400">
              {activeInvestors} active this month
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-battles-gold">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-battles-gold">
              Total Investment
            </CardTitle>
            <DollarSign className="h-4 w-4 text-battles-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalInvestment}</div>
            <p className="text-xs text-gray-400">
              +{monthlyGrowth} from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-battles-gold">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-battles-gold">
              Pending Requests
            </CardTitle>
            <FileText className="h-4 w-4 text-battles-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {accessRequests?.filter((req: any) => req.status === 'pending').length || 0}
            </div>
            <p className="text-xs text-gray-400">
              Require admin review
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-battles-gold">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-battles-gold">
              Growth Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-battles-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">+{monthlyGrowth}</div>
            <p className="text-xs text-gray-400">
              Monthly investor growth
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gray-900 border-battles-gold">
        <CardHeader>
          <CardTitle className="text-battles-gold">Quick Actions</CardTitle>
          <CardDescription className="text-gray-400">
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-battles-gold text-battles-black hover:bg-yellow-600">
              <Users className="h-4 w-4 mr-2" />
              Review Access Requests
            </Button>
            <Button variant="outline" className="border-battles-gold text-battles-gold hover:bg-battles-gold hover:text-battles-black">
              <FileText className="h-4 w-4 mr-2" />
              Upload Documents
            </Button>
            <Button variant="outline" className="border-battles-gold text-battles-gold hover:bg-battles-gold hover:text-battles-black">
              <TrendingUp className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Investors */}
      <Card className="bg-gray-900 border-battles-gold">
        <CardHeader>
          <CardTitle className="text-battles-gold">Current Investors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-200">Early Investor 1</h4>
                <p className="text-sm text-gray-400">Committed Investment • Access Level: Investor</p>
                <p className="text-sm text-gray-400">Joined: January 2025</p>
              </div>
              <div className="flex space-x-2">
                <Badge className="bg-green-900 text-green-300">Active</Badge>
                <Button size="sm" variant="outline" className="border-battles-gold text-battles-gold">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Access Levels */}
      <Card className="bg-gray-900 border-battles-gold">
        <CardHeader>
          <CardTitle className="text-battles-gold">Access Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-700 rounded-lg">
              <h4 className="font-medium text-battles-gold mb-2">Investor</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• View updates</li>
                <li>• Access documents</li>
                <li>• Financial reports</li>
                <li>• Communication access</li>
              </ul>
            </div>
            <div className="p-4 border border-gray-700 rounded-lg">
              <h4 className="font-medium text-battles-gold mb-2">Advisor</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• All investor access</li>
                <li>• Strategic input</li>
                <li>• Board meeting access</li>
                <li>• Advanced reporting</li>
              </ul>
            </div>
            <div className="p-4 border border-gray-700 rounded-lg">
              <h4 className="font-medium text-battles-gold mb-2">Board Member</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Full access</li>
                <li>• Voting rights</li>
                <li>• Strategic decisions</li>
                <li>• Admin privileges</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}