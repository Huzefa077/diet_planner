const Footer = () => {
    return (
      <footer className="bg-gray-900 text-gray-300 py-10">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Left Side - Branding & Info */}
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-white">AI Diet Planner</h2>
              <p className="mt-2 text-gray-400 text-sm">
                Personalized AI-powered diet plans for a healthier lifestyle.
              </p>
            </div>
  
            {/* Center - Navigation Links */}
            <div className="mt-6 md:mt-0">
              <ul className="flex space-x-6">
                <li><a href="/" className="hover:text-green-500 transition">Home</a></li>
                <li><a href="/about" className="hover:text-green-500 transition">About</a></li>
                <li><a href="/contact" className="hover:text-green-500 transition">Contact</a></li>
                <li><a href="/privacy" className="hover:text-green-500 transition">Privacy Policy</a></li>
              </ul>
            </div>
  
            {/* Right Side - Social Icons */}
            <div className="mt-6 md:mt-0 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-instagram text-xl"></i>
              </a>
            </div>
          </div>
  
          {/* Copyright Section */}
          <div className="mt-8 text-center text-sm text-gray-500 border-t border-gray-700 pt-4">
            © {new Date().getFullYear()} AI Diet Planner. All rights reserved.
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  