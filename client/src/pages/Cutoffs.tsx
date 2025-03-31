import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

interface CutoffData {
  institution: string;
  program: string;
  cutoff: string;
  year: string;
  category?: string;
}

const engineeringCutoffs: CutoffData[] = [
  { institution: "MIT", program: "Computer Science", cutoff: "SAT 1550+", year: "2023", category: "Engineering" },
  { institution: "Stanford University", program: "Electrical Engineering", cutoff: "SAT 1500+", year: "2023", category: "Engineering" },
  { institution: "Georgia Tech", program: "Mechanical Engineering", cutoff: "SAT 1450+", year: "2023", category: "Engineering" },
  { institution: "Caltech", program: "Aerospace Engineering", cutoff: "SAT 1550+", year: "2023", category: "Engineering" },
  { institution: "UC Berkeley", program: "Civil Engineering", cutoff: "SAT 1400+", year: "2023", category: "Engineering" },
];

const medicalCutoffs: CutoffData[] = [
  { institution: "Harvard Medical School", program: "Medicine", cutoff: "MCAT 520+", year: "2023", category: "Medical" },
  { institution: "Johns Hopkins", program: "Medicine", cutoff: "MCAT 518+", year: "2023", category: "Medical" },
  { institution: "Stanford Medicine", program: "Medicine", cutoff: "MCAT 519+", year: "2023", category: "Medical" },
  { institution: "UCSF", program: "Medicine", cutoff: "MCAT 516+", year: "2023", category: "Medical" },
  { institution: "Mayo Clinic School of Medicine", program: "Medicine", cutoff: "MCAT 517+", year: "2023", category: "Medical" },
];

const businessCutoffs: CutoffData[] = [
  { institution: "Harvard Business School", program: "MBA", cutoff: "GMAT 730+", year: "2023", category: "Business" },
  { institution: "Stanford GSB", program: "MBA", cutoff: "GMAT 732+", year: "2023", category: "Business" },
  { institution: "Wharton", program: "MBA", cutoff: "GMAT 720+", year: "2023", category: "Business" },
  { institution: "MIT Sloan", program: "MBA", cutoff: "GMAT 720+", year: "2023", category: "Business" },
  { institution: "Chicago Booth", program: "MBA", cutoff: "GMAT 725+", year: "2023", category: "Business" },
];

export default function Cutoffs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("engineering");

  const getCurrentData = () => {
    let data: CutoffData[] = [];
    
    switch (currentTab) {
      case "engineering":
        data = engineeringCutoffs;
        break;
      case "medical":
        data = medicalCutoffs;
        break;
      case "business":
        data = businessCutoffs;
        break;
      default:
        data = [...engineeringCutoffs, ...medicalCutoffs, ...businessCutoffs];
    }
    
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      return data.filter(
        item => 
          item.institution.toLowerCase().includes(term) || 
          item.program.toLowerCase().includes(term)
      );
    }
    
    return data;
  };

  const filteredData = getCurrentData();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">
              College Cutoffs
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Explore cutoff scores for different programs and institutions
            </p>
          </div>
          
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search by institution or program..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs defaultValue="engineering" onValueChange={setCurrentTab}>
            <div className="flex justify-center mb-6">
              <TabsList>
                <TabsTrigger value="engineering">Engineering</TabsTrigger>
                <TabsTrigger value="medical">Medical</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="engineering" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Engineering Program Cutoffs</CardTitle>
                  <CardDescription>
                    Minimum score requirements for top engineering programs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="text-left py-3 px-4">Institution</th>
                          <th className="text-left py-3 px-4">Program</th>
                          <th className="text-left py-3 px-4">Cutoff</th>
                          <th className="text-left py-3 px-4">Year</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-3 px-4">{item.institution}</td>
                            <td className="py-3 px-4">{item.program}</td>
                            <td className="py-3 px-4">{item.cutoff}</td>
                            <td className="py-3 px-4">{item.year}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {filteredData.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        No results found. Try a different search term.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="medical" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Medical Program Cutoffs</CardTitle>
                  <CardDescription>
                    Minimum score requirements for top medical programs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="text-left py-3 px-4">Institution</th>
                          <th className="text-left py-3 px-4">Program</th>
                          <th className="text-left py-3 px-4">Cutoff</th>
                          <th className="text-left py-3 px-4">Year</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-3 px-4">{item.institution}</td>
                            <td className="py-3 px-4">{item.program}</td>
                            <td className="py-3 px-4">{item.cutoff}</td>
                            <td className="py-3 px-4">{item.year}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {filteredData.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        No results found. Try a different search term.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="business" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Business Program Cutoffs</CardTitle>
                  <CardDescription>
                    Minimum score requirements for top business programs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="text-left py-3 px-4">Institution</th>
                          <th className="text-left py-3 px-4">Program</th>
                          <th className="text-left py-3 px-4">Cutoff</th>
                          <th className="text-left py-3 px-4">Year</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-3 px-4">{item.institution}</td>
                            <td className="py-3 px-4">{item.program}</td>
                            <td className="py-3 px-4">{item.cutoff}</td>
                            <td className="py-3 px-4">{item.year}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {filteredData.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        No results found. Try a different search term.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
