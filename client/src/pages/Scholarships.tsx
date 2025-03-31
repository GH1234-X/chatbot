import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ScholarshipData {
  name: string;
  organization: string;
  amount: string;
  deadline: string;
  category: string;
  eligibility: string;
  url: string;
  tags: string[];
}

const undergraduateScholarships: ScholarshipData[] = [
  {
    name: "National Merit Scholarship",
    organization: "National Merit Scholarship Corporation",
    amount: "$2,500",
    deadline: "October 2023",
    category: "Undergraduate",
    eligibility: "High school students with high PSAT scores",
    url: "#",
    tags: ["merit-based", "national"]
  },
  {
    name: "Coca-Cola Scholars Program",
    organization: "The Coca-Cola Company",
    amount: "$20,000",
    deadline: "October 31, 2023",
    category: "Undergraduate",
    eligibility: "Graduating high school seniors with leadership experience",
    url: "#",
    tags: ["leadership", "community-service"]
  },
  {
    name: "Jack Kent Cooke Foundation Scholarship",
    organization: "Jack Kent Cooke Foundation",
    amount: "Up to $55,000 per year",
    deadline: "November 2023",
    category: "Undergraduate",
    eligibility: "High-achieving high school seniors with financial need",
    url: "#",
    tags: ["need-based", "high-achievement"]
  },
  {
    name: "Gates Scholarship",
    organization: "Bill & Melinda Gates Foundation",
    amount: "Full cost of attendance",
    deadline: "September 2023",
    category: "Undergraduate",
    eligibility: "Minority students with high academic achievement and leadership",
    url: "#",
    tags: ["minority", "leadership", "need-based"]
  }
];

const graduateScholarships: ScholarshipData[] = [
  {
    name: "Fulbright Program",
    organization: "U.S. Department of State",
    amount: "Varies",
    deadline: "October 2023",
    category: "Graduate",
    eligibility: "U.S. citizens pursuing graduate studies abroad",
    url: "#",
    tags: ["international", "research"]
  },
  {
    name: "Rhodes Scholarship",
    organization: "Rhodes Trust",
    amount: "Full tuition and expenses",
    deadline: "October 2023",
    category: "Graduate",
    eligibility: "Outstanding students for study at Oxford University",
    url: "#",
    tags: ["international", "academic-excellence"]
  },
  {
    name: "NSF Graduate Research Fellowship",
    organization: "National Science Foundation",
    amount: "$34,000 stipend + $12,000 cost of education",
    deadline: "October 2023",
    category: "Graduate",
    eligibility: "Graduate students in NSF-supported disciplines",
    url: "#",
    tags: ["research", "stem"]
  },
  {
    name: "AAUW International Fellowships",
    organization: "American Association of University Women",
    amount: "$18,000 - $30,000",
    deadline: "November 15, 2023",
    category: "Graduate",
    eligibility: "Women pursuing full-time graduate or postdoctoral study in the U.S.",
    url: "#",
    tags: ["women", "international"]
  }
];

const internationalScholarships: ScholarshipData[] = [
  {
    name: "Chevening Scholarships",
    organization: "UK Government",
    amount: "Full tuition and expenses",
    deadline: "November 2023",
    category: "International",
    eligibility: "International students for master's programs in the UK",
    url: "#",
    tags: ["international", "master's"]
  },
  {
    name: "DAAD Scholarships",
    organization: "German Academic Exchange Service",
    amount: "Varies",
    deadline: "Varies by program",
    category: "International",
    eligibility: "International students for study in Germany",
    url: "#",
    tags: ["international", "research", "germany"]
  },
  {
    name: "Commonwealth Scholarships",
    organization: "Commonwealth Scholarship Commission",
    amount: "Full tuition and expenses",
    deadline: "Varies by country",
    category: "International",
    eligibility: "Students from Commonwealth countries",
    url: "#",
    tags: ["international", "commonwealth"]
  },
  {
    name: "Erasmus Mundus Joint Master Degrees",
    organization: "European Union",
    amount: "Up to €25,000 per year",
    deadline: "Varies by program",
    category: "International",
    eligibility: "International students for study in Europe",
    url: "#",
    tags: ["international", "europe", "master's"]
  }
];

export default function Scholarships() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("undergraduate");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const getCurrentData = () => {
    let data: ScholarshipData[] = [];
    
    switch (currentTab) {
      case "undergraduate":
        data = undergraduateScholarships;
        break;
      case "graduate":
        data = graduateScholarships;
        break;
      case "international":
        data = internationalScholarships;
        break;
      default:
        data = [...undergraduateScholarships, ...graduateScholarships, ...internationalScholarships];
    }
    
    // Filter by tag if one is selected
    if (selectedTag) {
      data = data.filter(item => item.tags.includes(selectedTag));
    }
    
    // Filter by search term
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      return data.filter(
        item => 
          item.name.toLowerCase().includes(term) || 
          item.organization.toLowerCase().includes(term) ||
          item.eligibility.toLowerCase().includes(term)
      );
    }
    
    return data;
  };

  const filteredData = getCurrentData();
  
  // Get unique tags from current data category
  const getAllTags = () => {
    let data: ScholarshipData[] = [];
    
    switch (currentTab) {
      case "undergraduate":
        data = undergraduateScholarships;
        break;
      case "graduate":
        data = graduateScholarships;
        break;
      case "international":
        data = internationalScholarships;
        break;
      default:
        data = [...undergraduateScholarships, ...graduateScholarships, ...internationalScholarships];
    }
    
    const tags = data.flatMap(item => item.tags);
    return Array.from(new Set(tags));
  };
  
  const uniqueTags = getAllTags();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Scholarships
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Find scholarships that match your academic profile and career goals
            </p>
          </div>
          
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search scholarships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={selectedTag || ""} onValueChange={(value) => setSelectedTag(value || null)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Tags</SelectItem>
                {uniqueTags.map((tag, index) => (
                  <SelectItem key={index} value={tag}>{tag.replace("-", " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Tabs defaultValue="undergraduate" onValueChange={setCurrentTab}>
            <div className="flex justify-center mb-6">
              <TabsList>
                <TabsTrigger value="undergraduate">Undergraduate</TabsTrigger>
                <TabsTrigger value="graduate">Graduate</TabsTrigger>
                <TabsTrigger value="international">International</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="undergraduate" className="mt-0">
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {filteredData.map((scholarship, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{scholarship.name}</CardTitle>
                      <CardDescription>{scholarship.organization}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="font-medium">Amount:</span>
                          <span>{scholarship.amount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Deadline:</span>
                          <span>{scholarship.deadline}</span>
                        </div>
                        <div>
                          <span className="font-medium">Eligibility:</span>
                          <p className="mt-1 text-gray-600">{scholarship.eligibility}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                          {scholarship.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="capitalize">
                              {tag.replace("-", " ")}
                            </Badge>
                          ))}
                        </div>
                        <Button variant="outline" className="w-full" asChild>
                          <a href={scholarship.url} target="_blank" rel="noopener noreferrer">
                            Apply <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {filteredData.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No scholarships found matching your criteria. Try a different search term or filter.
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="graduate" className="mt-0">
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {filteredData.map((scholarship, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{scholarship.name}</CardTitle>
                      <CardDescription>{scholarship.organization}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="font-medium">Amount:</span>
                          <span>{scholarship.amount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Deadline:</span>
                          <span>{scholarship.deadline}</span>
                        </div>
                        <div>
                          <span className="font-medium">Eligibility:</span>
                          <p className="mt-1 text-gray-600">{scholarship.eligibility}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                          {scholarship.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="capitalize">
                              {tag.replace("-", " ")}
                            </Badge>
                          ))}
                        </div>
                        <Button variant="outline" className="w-full" asChild>
                          <a href={scholarship.url} target="_blank" rel="noopener noreferrer">
                            Apply <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {filteredData.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No scholarships found matching your criteria. Try a different search term or filter.
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="international" className="mt-0">
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {filteredData.map((scholarship, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{scholarship.name}</CardTitle>
                      <CardDescription>{scholarship.organization}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="font-medium">Amount:</span>
                          <span>{scholarship.amount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Deadline:</span>
                          <span>{scholarship.deadline}</span>
                        </div>
                        <div>
                          <span className="font-medium">Eligibility:</span>
                          <p className="mt-1 text-gray-600">{scholarship.eligibility}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                          {scholarship.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="capitalize">
                              {tag.replace("-", " ")}
                            </Badge>
                          ))}
                        </div>
                        <Button variant="outline" className="w-full" asChild>
                          <a href={scholarship.url} target="_blank" rel="noopener noreferrer">
                            Apply <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {filteredData.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No scholarships found matching your criteria. Try a different search term or filter.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
