import { Link } from "wouter";
import { 
  ClipboardList, 
  DollarSign
} from "lucide-react";

interface ResourceItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  linkText: string;
}

const resources: ResourceItem[] = [
  {
    icon: <ClipboardList className="h-6 w-6" />,
    title: "College Cutoffs",
    description: "Browse comprehensive lists of cutoff scores for various programs and institutions.",
    link: "/cutoffs",
    linkText: "Explore cutoffs"
  },
  {
    icon: <DollarSign className="h-6 w-6" />,
    title: "Scholarships",
    description: "Find scholarships tailored to your academic achievements, interests, and background.",
    link: "/scholarships",
    linkText: "Find scholarships"
  }
];

export default function ResourcesSection() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Resources</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Explore our comprehensive educational resources
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource, index) => (
              <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-primary-600 rounded-md p-3 text-white">
                      {resource.icon}
                    </div>
                    <div className="ml-5 text-lg leading-6 font-medium text-gray-900">{resource.title}</div>
                  </div>
                  <div className="mt-3 text-base text-gray-500">
                    {resource.description}
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <Link href={resource.link}>
                    <span className="text-base font-medium text-primary-600 hover:text-primary-500 cursor-pointer">
                      {resource.linkText} <span aria-hidden="true">&rarr;</span>
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
