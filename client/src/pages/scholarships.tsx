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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Scholarship {
  id: number;
  name: string;
  amount: string;
  fieldOfStudy: string;
  deadline: string;
  eligibility: string;
  description: string;
}

const ScholarshipsPage = () => {
  const [fieldOfStudy, setFieldOfStudy] = useState("All Fields");
  const [amount, setAmount] = useState("Any Amount");
  const [deadline, setDeadline] = useState("All Deadlines");
  const [eligibility, setEligibility] = useState("All Students");

  const { data: scholarships, isLoading } = useQuery({
    queryKey: ["/api/scholarships", fieldOfStudy, amount, deadline, eligibility],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (fieldOfStudy !== "All Fields") params.append("fieldOfStudy", fieldOfStudy);
      if (amount !== "Any Amount") params.append("amount", amount);
      if (deadline !== "All Deadlines") params.append("deadline", deadline);
      if (eligibility !== "All Students") params.append("eligibility", eligibility);

      const res = await fetch(`/api/scholarships?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch scholarships");
      }
      return res.json() as Promise<Scholarship[]>;
    },
  });

  // Filter options
  const fieldOptions = ["All Fields", "Computer Science", "Engineering", "Business", "Medicine"];
  const amountOptions = ["Any Amount", "$1,000 - $5,000", "$5,000 - $10,000", "$10,000 - $25,000", "$25,000+"];
  const deadlineOptions = ["All Deadlines", "Within 1 Month", "Within 3 Months", "Within 6 Months"];
  const eligibilityOptions = ["All Students", "Undergraduate", "Graduate", "International Students", "Minority Students"];

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-12">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Scholarships</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Financial Aid Opportunities
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Discover scholarship opportunities tailored to your field of study, eligibility, and needs.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-4">
          <div>
            <Label htmlFor="field">Field of Study</Label>
            <Select value={fieldOfStudy} onValueChange={setFieldOfStudy}>
              <SelectTrigger id="field" className="mt-1">
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                {fieldOptions.map((field) => (
                  <SelectItem key={field} value={field}>
                    {field}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="amount">Amount</Label>
            <Select value={amount} onValueChange={setAmount}>
              <SelectTrigger id="amount" className="mt-1">
                <SelectValue placeholder="Select amount" />
              </SelectTrigger>
              <SelectContent>
                {amountOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="deadline">Deadline</Label>
            <Select value={deadline} onValueChange={setDeadline}>
              <SelectTrigger id="deadline" className="mt-1">
                <SelectValue placeholder="Select deadline" />
              </SelectTrigger>
              <SelectContent>
                {deadlineOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="eligibility">Eligibility</Label>
            <Select value={eligibility} onValueChange={setEligibility}>
              <SelectTrigger id="eligibility" className="mt-1">
                <SelectValue placeholder="Select eligibility" />
              </SelectTrigger>
              <SelectContent>
                {eligibilityOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Scholarships Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array(3).fill(0).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center">
                    <Skeleton className="h-12 w-12 rounded-md flex-shrink-0" />
                    <div className="ml-5 w-0 flex-1">
                      <Skeleton className="h-5 w-40 mb-2" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-8 w-32 mt-3" />
                </div>
              </Card>
            ))
          ) : scholarships && scholarships.length > 0 ? (
            scholarships.map((scholarship) => (
              <Card key={scholarship.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-primary rounded-md p-3">
                      <i className="fas fa-graduation-cap text-white"></i>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <h3 className="text-sm font-medium text-gray-500 truncate">
                        {scholarship.name}
                      </h3>
                      <p className="text-lg font-medium text-gray-900">
                        {scholarship.amount}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <div className="font-medium text-gray-700">Deadline: {scholarship.deadline}</div>
                    <div className="mt-1 text-gray-500">{scholarship.description}</div>
                    <div className="mt-3">
                      <Button variant="link" className="p-0 text-primary hover:text-primary-700 font-medium">
                        View Details &rarr;
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No scholarships found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your filters to see more results.
              </p>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" disabled={isLoading}>
            Load More Scholarships
          </Button>
        </div>

        <div className="mt-12 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Need help finding scholarships?</h3>
          <p className="text-gray-600 mb-4">
            Our AI assistant can help you discover scholarships tailored to your specific profile and goals.
          </p>
          <div className="text-center">
            <Button asChild>
              <a href="/chat">Chat with StudyAI</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipsPage;
