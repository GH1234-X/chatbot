import { 
  Lightbulb, 
  Archive, 
  ClipboardList, 
  Lock 
} from "lucide-react";

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: FeatureItem[] = [
  {
    icon: <Lightbulb className="h-6 w-6" />,
    title: "AI-Powered Assistance",
    description: "Get instant answers to your academic questions using our advanced AI powered by Groq Cloud API."
  },
  {
    icon: <Archive className="h-6 w-6" />,
    title: "Scholarship Database",
    description: "Browse and filter through comprehensive scholarship opportunities tailored to your profile."
  },
  {
    icon: <ClipboardList className="h-6 w-6" />,
    title: "Cutoff Information",
    description: "Access up-to-date cutoff scores and admission requirements for various institutions and programs."
  },
  {
    icon: <Lock className="h-6 w-6" />,
    title: "Secure User Accounts",
    description: "Create an account to save your inquiries, track your applications, and receive personalized recommendations."
  }
];

export default function FeatureSection() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need for your academic decisions
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Access comprehensive resources and personalized AI assistance to support your educational journey.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature, index) => (
              <div key={index} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-600 text-white">
                    {feature.icon}
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.title}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
