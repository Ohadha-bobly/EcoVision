import { MapPin, Satellite, TreePine } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: MapPin,
      title: "Explore Projects",
      description: "Browse conservation projects worldwide using our interactive satellite map. Filter by location, type, and impact.",
    },
    {
      icon: Satellite,
      title: "Track Progress",
      description: "View real-time satellite imagery, NDVI data, and weather patterns to monitor environmental recovery.",
    },
    {
      icon: TreePine,
      title: "Make Impact",
      description: "Pledge your support to projects and watch your contribution grow forests and restore ecosystems.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
          How It Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {index + 1}. {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
