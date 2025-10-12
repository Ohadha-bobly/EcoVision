import { Button } from "@/components/ui/button";
import { Leaf, MapPin, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export function HeroSection() {
  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Hero background image with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000&auto=format&fit=crop"
          alt="Aerial view of lush forest"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/60" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Restore Our Planet's Forests
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
          Join a global movement to combat climate change through reforestation. Track real-time environmental impact with satellite data.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/map">
            <Button size="lg" className="text-base" data-testid="button-explore-projects">
              <MapPin className="mr-2 h-5 w-5" />
              Explore Projects
            </Button>
          </Link>
          <Link href="/pledge">
            <Button size="lg" variant="outline" className="text-base bg-background/20 backdrop-blur-sm border-white/30 text-white hover:bg-background/30" data-testid="button-make-pledge">
              <Leaf className="mr-2 h-5 w-5" />
              Make a Pledge
            </Button>
          </Link>
        </div>

        {/* Live stats */}
        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white">2.5M+</div>
            <div className="text-sm text-white/80 mt-1">Trees Planted</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white">45</div>
            <div className="text-sm text-white/80 mt-1">Countries</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white">1,200</div>
            <div className="text-sm text-white/80 mt-1">Hectares Restored</div>
          </div>
        </div>
      </div>
    </section>
  );
}
