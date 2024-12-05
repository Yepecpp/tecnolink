import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Star, Shield, PenTool } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context";

export default function LandingPage() {
  const { auth, logout } = useAuth();
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" to="#">
          <PenTool className="h-6 w-6 mr-2" />
          <span className="font-bold">Tecnolink</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="#"
          >
            How It Works
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="#"
          >
            Services
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/create"
          >
            For Technicians
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="#"
          >
            About Us
          </Link>
          {!auth ? (
            <Link
              className="text-sm font-medium hover:underline underline-offset-4"
              to="/login"
            >
              Login
            </Link>
          ) : (
            <>
              <p
                className="text-sm font-medium hover:underline underline-offset-4 cursor-pointer"
                onClick={() => {
                  logout();
                }}
              >
                Log out
              </p>
              <p className="text-sm font-medium hover:underline">
                {auth.user.name} {auth.user.lastName}
              </p>
            </>
          )}
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Connect with Trusted Technicians
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Find reliable professionals for all your technical needs. We
                  vet every technician to ensure quality service.
                </p>
              </div>
              <div className="space-x-4">
                <Button>
                  <Link to="/tecnician">Find a Technician</Link>
                </Button>
                <Button variant="outline">
                  <Link to="/create">Join as a Technician</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Our Services
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Computer Repair</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Expert technicians to fix your computer issues quickly and
                    efficiently.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Network Setup</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Professional network installation and configuration for
                    homes and businesses.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Smart Home Installation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Turn your house into a smart home with our expert
                    installation services.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Our Vetting Process
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <CheckCircle className="h-8 w-8 mb-2 text-green-500" />
                  <CardTitle>Background Check</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    We conduct thorough background checks on all our
                    technicians.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Star className="h-8 w-8 mb-2 text-yellow-500" />
                  <CardTitle>Skills Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Rigorous testing to ensure top-notch technical skills.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Shield className="h-8 w-8 mb-2 text-blue-500" />
                  <CardTitle>Certification Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    We verify all relevant certifications and qualifications.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <PenTool className="h-8 w-8 mb-2 text-purple-500" />
                  <CardTitle>Hands-on Evaluation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Practical assessments to ensure real-world competency.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Get Started?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Join TechConnect today and experience the difference of
                  working with vetted professionals.
                </p>
              </div>
              <div className="space-x-4">
                <Button size="lg">Find a Technician</Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 TechConnect. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
