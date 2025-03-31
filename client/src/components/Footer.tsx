import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
          <div className="px-5 py-2">
            <Link href="/about">
              <a className="text-base text-gray-500 hover:text-gray-900">
                About
              </a>
            </Link>
          </div>

          <div className="px-5 py-2">
            <a href="#" className="text-base text-gray-500 hover:text-gray-900">
              Blog
            </a>
          </div>

          <div className="px-5 py-2">
            <a href="#" className="text-base text-gray-500 hover:text-gray-900">
              Contact
            </a>
          </div>

          <div className="px-5 py-2">
            <a href="#" className="text-base text-gray-500 hover:text-gray-900">
              Privacy
            </a>
          </div>

          <div className="px-5 py-2">
            <a href="#" className="text-base text-gray-500 hover:text-gray-900">
              Terms
            </a>
          </div>
        </nav>
        <div className="mt-8 flex justify-center space-x-6">
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Facebook</span>
            <i className="fab fa-facebook-f"></i>
          </a>

          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Instagram</span>
            <i className="fab fa-instagram"></i>
          </a>

          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Twitter</span>
            <i className="fab fa-twitter"></i>
          </a>

          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">LinkedIn</span>
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
        <p className="mt-8 text-center text-base text-gray-400">
          &copy; {new Date().getFullYear()} StudyAI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
