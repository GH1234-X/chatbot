import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface CollegeCutoff {
  id: number;
  university: string;
  program: string;
  country: string;
  gpa: string;
  testScores: string;
  acceptanceRate: string;
  academicYear: string;
}

const CutoffsPage = () => {
  const [country, setCountry] = useState("All");
  const [university, setUniversity] = useState("All");
  const [program, setProgram] = useState("All");
  const [academicYear, setAcademicYear] = useState("2023-2024");

  const { data: cutoffs, isLoading } = useQuery({
    queryKey: ["/api/college-cutoffs", country, university, program, academicYear],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (country !== "All") params.append("country", country);
      if (university !== "All") params.append("university", university);
      if (program !== "All") params.append("program", program);
      params.append("academicYear", academicYear);

      const res = await fetch(`/api/college-cutoffs?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch cutoffs");
      }
      return res.json() as Promise<CollegeCutoff[]>;
    },
  });

  // These would typically come from the database
  const countries = ["All", "United States", "Canada", "United Kingdom", "Australia"];
  const universities = ["All", "Harvard University", "Stanford University", "MIT", "California Institute of Technology"];
  const programs = ["All", "Computer Science", "Engineering", "Business", "Medicine"];
  const academicYears = ["2023-2024", "2022-2023", "2021-2022"];

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-12">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">College Cutoffs</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Admission Requirements Data
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Explore cutoff percentages, GPA requirements, and acceptance rates for various universities and programs.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-4">
          <div>
            <Label htmlFor="country">Country</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger id="country" className="mt-1">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="university">University</Label>
            <Select value={university} onValueChange={setUniversity}>
              <SelectTrigger id="university" className="mt-1">
                <SelectValue placeholder="Select university" />
              </SelectTrigger>
              <SelectContent>
                {universities.map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="program">Program</Label>
            <Select value={program} onValueChange={setProgram}>
              <SelectTrigger id="program" className="mt-1">
                <SelectValue placeholder="Select program" />
              </SelectTrigger>
              <SelectContent>
                {programs.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="year">Academic Year</Label>
            <Select value={academicYear} onValueChange={setAcademicYear}>
              <SelectTrigger id="year" className="mt-1">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {academicYears.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Cutoffs Table */}
        <div className="mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                  University
                </TableHead>
                <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Program
                </TableHead>
                <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  GPA Cutoff
                </TableHead>
                <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  SAT/ACT
                </TableHead>
                <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Acceptance Rate
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(4).fill(0).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  </TableRow>
                ))
              ) : cutoffs && cutoffs.length > 0 ? (
                cutoffs.map((cutoff) => (
                  <TableRow key={cutoff.id}>
                    <TableCell className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                      {cutoff.university}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {cutoff.program}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {cutoff.gpa}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {cutoff.testScores}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {cutoff.acceptanceRate}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No cutoff data found for the selected filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Note on Cutoff Data</h3>
          <p className="text-gray-600">
            Cutoff values represent minimum requirements and may vary each year. For the most accurate and up-to-date information, always check the official university websites or contact their admissions office directly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CutoffsPage;
