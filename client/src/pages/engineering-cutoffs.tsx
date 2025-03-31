import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ChevronDown, Search, BookOpen, School } from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CutoffData {
  id: string;
  collegeName: string;
  course: string;
  generalCutoff: string;
  obcCutoff: string;
  scstCutoff: string;
  academicYear: string;
}

const EngineeringCutoffs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All Courses");
  const [institutes, setInstitutes] = useState<CutoffData[]>([]);
  const [filteredInstitutes, setFilteredInstitutes] = useState<CutoffData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useLocation();

  // List of engineering courses
  const courses = [
    "COMPUTER ENGINEERING",
    "INFORMATION TECHNOLOGY",
    "MECHANICAL ENGINEERING",
    "CIVIL ENGINEERING",
    "ARTIFICIAL INTELLIGENCE AND DATA SCIENCE",
    "ELECTRONICS & COMMUNICATION ENGG",
    "ELECTRICAL ENGINEERING",
    "CHEMICAL ENGINEERING",
    "AUTOMOBILE ENGINEERING",
    "AERONAUTICAL ENGINEERING",
    "All Courses",
  ];

  // Fetch data from Firestore
  useEffect(() => {
    const fetchCutoffData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!db) {
          throw new Error(
            "Firestore is not initialized. Check Firebase configuration."
          );
        }

        const cutoffsCollection = collection(db, "cutoffs");
        let cutoffsQuery = cutoffsCollection;

        // If a course is selected (except "All Courses"), filter by course
        if (selectedCourse && selectedCourse !== "All Courses") {
          cutoffsQuery = query(
            cutoffsCollection,
            where("courseName", "==", selectedCourse)
          );
        } else {
          cutoffsQuery = query(cutoffsCollection);
        }

        const cutoffSnapshot = await getDocs(cutoffsQuery);

        // Group data by institute and organize by categories
        const groupedData: Record<string, CutoffData> = {};

        cutoffSnapshot.docs.forEach((doc) => {
          const data = doc.data();
          const instName = data.instName || "";
          const courseName = data.courseName || "";
          const category = data.category || "";
          const key = `${instName}|${courseName}`;

          if (!groupedData[key]) {
            groupedData[key] = {
              id: doc.id,
              collegeName: instName,
              course: courseName,
              generalCutoff: "",
              obcCutoff: "",
              scstCutoff: "",
              academicYear: "2023-2024",
            };
          }

          // Set cutoffs based on category
          if (category === "GEN") {
            groupedData[key].generalCutoff = data.lastRank || "";
          } else if (category === "SEBC" || category === "OBC") {
            groupedData[key].obcCutoff = data.lastRank || "";
          } else if (category === "SC" || category === "ST") {
            groupedData[key].scstCutoff = data.lastRank || "";
          }
        });

        // Convert grouped data to array
        const cutoffData = Object.values(groupedData);
        setInstitutes(cutoffData);
        setFilteredInstitutes(cutoffData);
        setIsLoading(false);
      } catch (err: any) {
        console.error("Error fetching cutoff data:", err);
        setError("Failed to load data. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchCutoffData();
  }, [selectedCourse]);

  // Filter institutes based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredInstitutes(institutes);
    } else {
      const filtered = institutes.filter((institute) =>
        institute.collegeName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredInstitutes(filtered);
    }
  }, [searchQuery, institutes]);

  const handleCourseChange = (value: string) => {
    setSelectedCourse(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gujarat Engineering Cutoffs</h1>
          <p className="text-gray-600 mt-1">
            View admission cutoff ranks for engineering colleges in Gujarat
          </p>
        </div>
        
        <Button
          onClick={() => setLocation("/cutoffs")}
          className="flex items-center gap-2"
          variant="outline"
        >
          <BookOpen size={18} />
          View All Cutoffs
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search Engineering Cutoffs</CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Course dropdown */}
            <div className="w-full md:w-1/3">
              <Label className="mb-2">Select Course</Label>
              <Select value={selectedCourse} onValueChange={handleCourseChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course, index) => (
                    <SelectItem key={index} value={course}>
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search input */}
            <div className="w-full md:w-2/3">
              <Label className="mb-2">Search Institute</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search by college name..."
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Results section */}
          <div className="mt-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">{error}</div>
            ) : filteredInstitutes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <School className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p>No institutes found matching your criteria.</p>
                <p className="text-sm mt-2">
                  Try adjusting your search or selecting a different course.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>College Name</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>General Cutoff</TableHead>
                      <TableHead>OBC Cutoff</TableHead>
                      <TableHead>SC/ST Cutoff</TableHead>
                      <TableHead>Academic Year</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInstitutes.map((institute) => (
                      <TableRow key={institute.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          {institute.collegeName}
                        </TableCell>
                        <TableCell>{institute.course}</TableCell>
                        <TableCell>{institute.generalCutoff}</TableCell>
                        <TableCell>{institute.obcCutoff}</TableCell>
                        <TableCell>{institute.scstCutoff}</TableCell>
                        <TableCell>{institute.academicYear}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EngineeringCutoffs;