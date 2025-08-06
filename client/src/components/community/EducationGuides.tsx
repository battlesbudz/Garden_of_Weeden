import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { educationGuides, type EducationGuide } from "@/data/educationGuides";
import { 
  BookOpen, 
  Play, 
  Clock, 
  Search, 
  GraduationCap,
  ExternalLink,
  ChevronDown
} from "lucide-react";

export function EducationGuides() {
  const [selectedGuide, setSelectedGuide] = useState<EducationGuide | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter guides based on search and category
  const filteredGuides = educationGuides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || guide.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(educationGuides.map(guide => guide.category)))];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search education guides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Education Guides Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredGuides.map((guide) => (
          <Card key={guide.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg">{guide.title}</CardTitle>
                  <CardDescription>{guide.description}</CardDescription>
                </div>
                <img 
                  src={guide.thumbnail} 
                  alt={guide.title}
                  className="w-16 h-16 object-cover rounded-md"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={getDifficultyColor(guide.difficulty)}>
                  {guide.difficulty}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="h-3 w-3" />
                  {guide.duration}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <BookOpen className="h-3 w-3" />
                  {guide.steps.length} steps
                </div>
                {guide.videoUrl && (
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <Play className="h-3 w-3" />
                    Video
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1 mb-4">
                {guide.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button 
                onClick={() => {
                  setSelectedGuide(guide);
                  setCurrentStep(0);
                }}
                className="w-full"
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                Start Guide
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGuides.length === 0 && (
        <div className="text-center py-12">
          <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No guides found</h3>
          <p className="text-gray-600">Try adjusting your search terms or category filter.</p>
        </div>
      )}

      {/* Guide Modal */}
      <Dialog open={!!selectedGuide} onOpenChange={() => setSelectedGuide(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedGuide && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  {selectedGuide.title}
                </DialogTitle>
                <DialogDescription>{selectedGuide.description}</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(((currentStep + 1) / selectedGuide.steps.length) * 100)}%</span>
                  </div>
                  <Progress value={((currentStep + 1) / selectedGuide.steps.length) * 100} />
                </div>

                {/* Current Step */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">
                      Step {currentStep + 1}: {selectedGuide.steps[currentStep].title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      {selectedGuide.steps[currentStep].content}
                    </p>
                    
                    {selectedGuide.steps[currentStep].tips && (
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r">
                        <div className="flex">
                          <div className="ml-3">
                            <p className="text-sm font-medium text-blue-800">💡 Tip</p>
                            <p className="text-sm text-blue-700 mt-1">
                              {selectedGuide.steps[currentStep].tips}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {selectedGuide.steps[currentStep].warnings && (
                      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r">
                        <div className="flex">
                          <div className="ml-3">
                            <p className="text-sm font-medium text-red-800">⚠️ Warning</p>
                            <p className="text-sm text-red-700 mt-1">
                              {selectedGuide.steps[currentStep].warnings}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Video Section */}
                {selectedGuide.videoUrl && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Play className="h-5 w-5" />
                        Educational Video
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-w-16 aspect-h-9">
                        <iframe
                          src={selectedGuide.videoUrl}
                          title="Educational video"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-64 rounded-md"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Navigation */}
                <div className="flex justify-between items-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                  >
                    Previous Step
                  </Button>
                  
                  <span className="text-sm text-gray-500">
                    {currentStep + 1} of {selectedGuide.steps.length}
                  </span>
                  
                  {currentStep < selectedGuide.steps.length - 1 ? (
                    <Button onClick={() => setCurrentStep(currentStep + 1)}>
                      Next Step
                    </Button>
                  ) : (
                    <Button onClick={() => setSelectedGuide(null)} className="bg-green-600 hover:bg-green-700">
                      Complete Guide
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}