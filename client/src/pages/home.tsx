import { useState } from "react";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { MissionSection } from "@/components/mission-section";
import { HowItWorks } from "@/components/how-it-works";
import { AuthDialog } from "@/components/auth-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Globe } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onAuthClick={() => setAuthOpen(true)} />

      <HeroSection />
      <MissionSection />
      <HowItWorks />

      {/* Impact Dashboard */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            Our Global Impact
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-4xl font-bold text-primary">2.5M+</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Trees Planted Worldwide</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-3">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-4xl font-bold text-primary">45</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Countries Participating</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-4xl font-bold text-primary">50K+</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Active Contributors</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join the Movement
          </h2>
          <p className="text-lg mb-8 text-primary-foreground/90">
            Every tree planted brings us closer to a sustainable future. Start your impact journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/map">
              <Button size="lg" variant="secondary" data-testid="button-cta-explore">
                Explore Projects
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => setAuthOpen(true)}
              data-testid="button-cta-signup"
            >
              Sign Up Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">About</h3>
              <p className="text-sm text-muted-foreground">
                EcoVision empowers global reforestation through transparency and technology.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Projects</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/projects"><a className="hover:text-primary">All Projects</a></Link></li>
                <li><Link href="/map"><a className="hover:text-primary">Interactive Map</a></Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Get Involved</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/pledge"><a className="hover:text-primary">Make a Pledge</a></Link></li>
                <li><a href="#" className="hover:text-primary">Become a Partner</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <p className="text-sm text-muted-foreground">
                Follow our journey on social media and stay updated on environmental impact.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2025 EcoVision. Educational clone for demonstration purposes only.</p>
          </div>
        </div>
      </footer>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}
