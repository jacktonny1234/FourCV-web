"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Monitor, Video, Scan, Users, ArrowRight, Brain } from "lucide-react";
import Link from "next/link";
import NavBar from "@/components/layout/nav-bar"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar/>
      {/* Fixed Navigation Bar */}
      {/* <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold">FourCV</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-indigo-600">Home</Link>
              <Link href="/introduce" className="text-gray-700 hover:text-indigo-600">About Us</Link>
              <Link href="#" className="text-gray-700 hover:text-indigo-600">Services</Link>
              <Button asChild>
                <Link href="/report">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav> */}

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Empowering the Future of Computer Vision
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              At FourCV, we are dedicated to pioneering advancements in computer vision technology, transforming industries and enhancing the way we interact with the world through innovative solutions.
            </p>
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Comprehensive CV Services</h2>
          <p className="text-gray-600 text-center mb-12">Empowering businesses with state-of-the-art computer vision solutions.</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <Monitor className="h-12 w-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Image Recognition</h3>
                <p className="text-gray-600">
                  Advanced image recognition services that enable machines to identify and classify objects accurately, enhancing automation and data analysis.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <Video className="h-12 w-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Video Analytics</h3>
                <p className="text-gray-600">
                  Real-time video analytics solutions providing valuable insights by analyzing footage, making it easier to monitor and optimize operations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <Scan className="h-12 w-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Facial Recognition</h3>
                <p className="text-gray-600">
                  Cutting-edge facial recognition technology ensuring secure and efficient identity verification across various applications.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Partner Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Your Trusted Partner</h2>
          <p className="text-gray-600 text-center mb-12">Experience, reliability, and innovation at your service.</p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Technology workspace"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Proven Track Record</h3>
              <p className="text-gray-600 mb-4">Years of experience delivering successful projects across diverse sectors.</p>
              <Button variant="outline" className="w-full">
                Read More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <img
                src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Modern technology"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Cutting-Edge Technology</h3>
              <p className="text-gray-600 mb-4">Leveraging the latest advancements for maximum efficiency and productivity.</p>
              <Button variant="outline" className="w-full">
                Read More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Team collaboration"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Client-Centric Approach</h3>
              <p className="text-gray-600 mb-4">Prioritizing client needs and objectives through collaborative solutions.</p>
              <Button variant="outline" className="w-full">
                Read More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Our Clients Speak</h2>
          <p className="text-gray-400 text-center mb-12">Real feedback from those who have experienced our services firsthand.</p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <p className="text-gray-300 mb-4">
                "FourCV has transformed our operations with their innovative computer vision solutions. Their expertise and commitment to our success have been invaluable."
              </p>
              <div className="flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                  alt="Client"
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h4 className="font-semibold">John Doe</h4>
                  <p className="text-gray-400">CTO, Tech Innovations</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <p className="text-gray-300 mb-4">
                "The team at FourCV was exceptional from start to finish. They understood our needs and delivered a solution that exceeded our expectations."
              </p>
              <div className="flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                  alt="Client"
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h4 className="font-semibold">Jane Smith</h4>
                  <p className="text-gray-400">CEO, Digital Solutions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}