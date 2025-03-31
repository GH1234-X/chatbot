import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
          <div className="px-5 py-2">
            <Link href="/about">
              <span className="text-base text-gray-500 hover:text-gray-900 cursor-pointer">
                About
              </span>
            </Link>
          </div>

          <div className="px-5 py-2">
            <span className="text-base text-gray-500 hover:text-gray-900 cursor-pointer">
              Blog
            </span>
          </div>

          <div className="px-5 py-2">
            <span className="text-base text-gray-500 hover:text-gray-900 cursor-pointer">
              Contact
            </span>
          </div>

          <div className="px-5 py-2">
            <span className="text-base text-gray-500 hover:text-gray-900 cursor-pointer">
              Privacy
            </span>
          </div>

          <div className="px-5 py-2">
            <span className="text-base text-gray-500 hover:text-gray-900 cursor-pointer">
              Terms
            </span>
          </div>
        </nav>
        <div className="mt-8 flex justify-center space-x-6">
          <span className="text-gray-400 hover:text-gray-500 cursor-pointer">
            <span className="sr-only">Facebook</span>
            <i className="fab fa-facebook-f"></i>
          </span>

          <span className="text-gray-400 hover:text-gray-500 cursor-pointer">
            <span className="sr-only">Instagram</span>
            <i className="fab fa-instagram"></i>
          </span>

          <span className="text-gray-400 hover:text-gray-500 cursor-pointer">
            <span className="sr-only">Twitter</span>
            <i className="fab fa-twitter"></i>
          </span>

          <span className="text-gray-400 hover:text-gray-500 cursor-pointer">
            <span className="sr-only">LinkedIn</span>
            <i className="fab fa-linkedin-in"></i>
          </span>
        </div>
        <p className="mt-8 text-center text-base text-gray-400">
          &copy; 2025 StudyAI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
