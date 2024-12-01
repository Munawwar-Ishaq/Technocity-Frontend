import React from "react";

const Footer = () => {
  return (
    <footer className="bg-blue-100 text-gray-600 py-6">
      <div className="container mx-auto flex flex-col items-center text-center px-4">
        {/* Branding Section */}
        <div className="mb-4">
          <h3 className="text-2xl font-bold">TechnoCity Billing Management</h3>
          <p className="mt-2 text-gray-400">
            Simplifying billing processes with efficient technology.
          </p>
        </div>

        {/* Contact Section */}
        <div className="mb-4">
          <h4 className="text-lg font-semibold">Contact</h4>
          <p className="mt-2">
            Email:{" "}
            <a
              href="mailto:muhammadmunawwar124@gmail.com"
              className="text-blue-400 hover:underline"
            >
              muhammadmunawwar124@gmail.com
            </a>
          </p>
          <p>Phone: +92-314-1304783</p>
          <p>Address: Godhra Colony, Sector 11-G, New Karachi, Pakistan</p>
        </div>

        {/* Author Attribution */}
        <div className="bg-gray-300 py-4 w-full">
          <p className="text-gray-400">
            Designed & Developed by{" "}
            <a
              href="https://mhacodex.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Munawwar Ishaq
            </a>
          </p>
        </div>

        {/* Copyright Section */}
        <div className="bg-gray-400 py-3 w-full">
          <p className="text-gray-00">
            © {new Date().getFullYear()} TechnoCity Billing Management. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
