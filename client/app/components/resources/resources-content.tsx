"use client";

import {
  Search,
  Phone,
  Home,
  Scale,
  BookOpen,
  Users,
  Download,
  MapPin,
  ExternalLink,
  Globe,
  Heart,
  Shield,
  Brain,
  Video,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

// Global Emergency Hotlines by Region
const emergencyHotlines = {
  "North America": [
    {
      country: "United States",
      services: [
        {
          name: "National Domestic Violence Hotline",
          contact: "1-800-799-7233",
          available: "24/7",
          website: "https://www.thehotline.org",
        },
        {
          name: "National Sexual Assault Hotline (RAINN)",
          contact: "1-800-656-4673",
          available: "24/7",
          website: "https://www.rainn.org",
        },
        {
          name: "Suicide & Crisis Lifeline",
          contact: "988",
          available: "24/7",
          website: "https://988lifeline.org",
        },
        {
          name: "Crisis Text Line",
          contact: "Text HOME to 741741",
          available: "24/7",
          website: "https://www.crisistextline.org",
        },
      ],
    },
    {
      country: "Canada",
      services: [
        {
          name: "Canada Suicide Prevention Service",
          contact: "1-833-456-4566",
          available: "24/7",
          website: "https://talksuicide.ca",
        },
        {
          name: "Assaulted Women's Helpline",
          contact: "1-866-863-0511",
          available: "24/7",
          website: "https://www.awhl.org",
        },
      ],
    },
    {
      country: "Mexico",
      services: [
        {
          name: "Línea de la Vida",
          contact: "800-911-2000",
          available: "24/7",
        },
        {
          name: "Línea Nacional Contra la Violencia",
          contact: "01-800-108-4053",
          available: "24/7",
        },
      ],
    },
  ],
  Europe: [
    {
      country: "United Kingdom",
      services: [
        {
          name: "National Domestic Abuse Helpline",
          contact: "0808-2000-247",
          available: "24/7",
          website: "https://www.nationaldahelpline.org.uk",
        },
        {
          name: "Rape Crisis England & Wales",
          contact: "0808-802-9999",
          available: "24/7",
          website: "https://rapecrisis.org.uk",
        },
        {
          name: "Samaritans",
          contact: "116-123",
          available: "24/7",
          website: "https://www.samaritans.org",
        },
      ],
    },
    {
      country: "Germany",
      services: [
        {
          name: "Hilfetelefon",
          contact: "116-016",
          available: "24/7",
          website: "https://www.hilfetelefon.de",
        },
        {
          name: "Telefonseelsorge",
          contact: "0800-111-0-111",
          available: "24/7",
        },
      ],
    },
    {
      country: "France",
      services: [
        { name: "Violences Femmes Infos", contact: "3919", available: "24/7" },
        { name: "SOS Amitié", contact: "09-72-39-40-50", available: "24/7" },
      ],
    },
    {
      country: "Ireland",
      services: [
        {
          name: "Women's Aid 24hr Helpline",
          contact: "1800-341-900",
          available: "24/7",
          website: "https://www.womensaid.ie",
        },
        {
          name: "Rape Crisis 24 Hour Helpline",
          contact: "1800-778-888",
          available: "24/7",
          website: "https://www.drcc.ie",
        },
      ],
    },
    {
      country: "Spain",
      services: [{ name: "Línea 016", contact: "016", available: "24/7" }],
    },
    {
      country: "Italy",
      services: [
        { name: "Numero Antiviolenza", contact: "1522", available: "24/7" },
      ],
    },
    {
      country: "Netherlands",
      services: [
        { name: "Veilig Thuis", contact: "0800-2000", available: "24/7" },
      ],
    },
  ],
  Asia: [
    {
      country: "India",
      services: [
        { name: "Women Helpline", contact: "1091", available: "24/7" },
        {
          name: "KIRAN Mental Health",
          contact: "1800-599-0019",
          available: "24/7",
        },
        { name: "NCW Helpline", contact: "7827-170-170", available: "24/7" },
      ],
    },
    {
      country: "Japan",
      services: [
        { name: "Purple Dial", contact: "0120-941-826", available: "24/7" },
        {
          name: "TELL Lifeline",
          contact: "03-5774-0992",
          available: "9am-11pm",
        },
      ],
    },
    {
      country: "Philippines",
      services: [
        { name: "NCMH Crisis", contact: "1553", available: "24/7" },
        {
          name: "Natasha Goulbourn Foundation",
          contact: "0918-873-4673",
          available: "24/7",
        },
      ],
    },
    {
      country: "Singapore",
      services: [
        {
          name: "AWARE Women's Helpline",
          contact: "1800-777-5555",
          available: "Mon-Fri 10am-6pm",
          website: "https://www.aware.org.sg",
        },
        {
          name: "Samaritans of Singapore",
          contact: "1800-221-4444",
          available: "24/7",
        },
      ],
    },
  ],
  Africa: [
    {
      country: "South Africa",
      services: [
        {
          name: "GBV Command Centre",
          contact: "0800-428-428",
          available: "24/7",
        },
        {
          name: "Lifeline South Africa",
          contact: "0861-322-322",
          available: "24/7",
        },
      ],
    },
    {
      country: "Kenya",
      services: [
        {
          name: "Gender Violence Recovery Centre",
          contact: "0800-720-553",
          available: "24/7",
        },
      ],
    },
  ],
  Oceania: [
    {
      country: "Australia",
      services: [
        {
          name: "1800Respect",
          contact: "1800-737-732",
          available: "24/7",
          website: "https://www.1800respect.org.au",
        },
        {
          name: "Lifeline Australia",
          contact: "13-11-14",
          available: "24/7",
          website: "https://www.lifeline.org.au",
        },
        {
          name: "Beyond Blue",
          contact: "1300-224-636",
          available: "24/7",
          website: "https://www.beyondblue.org.au",
        },
      ],
    },
    {
      country: "New Zealand",
      services: [
        {
          name: "Domestic Violence Crisis Line",
          contact: "0800-456-450",
          available: "24/7",
        },
        {
          name: "Lifeline Aotearoa",
          contact: "0800-543-354",
          available: "24/7",
        },
      ],
    },
  ],
  "Latin America": [
    {
      country: "Brazil",
      services: [
        {
          name: "Central de Atendimento à Mulher",
          contact: "180",
          available: "24/7",
        },
        { name: "CVV", contact: "188", available: "24/7" },
      ],
    },
    {
      country: "Argentina",
      services: [{ name: "Línea 144", contact: "144", available: "24/7" }],
    },
  ],
};

const mentalHealthResources = [
  {
    name: "Understanding Trauma After Sexual Violence",
    description:
      "Comprehensive guide on recognizing trauma responses and starting the healing process",
    type: "Article",
    url: "https://rainn.org/help-and-healing/overcoming-trauma-after-sexual-violence/",
    icon: Brain,
  },
  {
    name: "Recovering from Rape and Sexual Trauma",
    description:
      "Step-by-step recovery guide with therapeutic approaches and self-help strategies",
    type: "Guide",
    url: "https://www.helpguide.org/mental-health/ptsd-trauma/recovering-from-rape-and-sexual-trauma",
    icon: Heart,
  },
  {
    name: "Fight, Flight, Freeze & Fawn Responses",
    description: "Understanding your survival responses to trauma and violence",
    type: "Article",
    url: "https://rainn.org/articles/fight-flight-freeze-fawn",
    icon: Brain,
  },
  {
    name: "How To Find a Trauma-Informed Therapist",
    description:
      "Guide to finding mental health professionals who specialize in trauma",
    type: "Guide",
    url: "https://rainn.org/help-and-healing/overcoming-trauma-after-sexual-violence/mental-health-therapy-support-after-sexual-violence/",
    icon: Users,
  },
  {
    name: "Mind-Body Healing Approaches",
    description:
      "Trauma-informed yoga, mindfulness, and somatic practices for survivors",
    type: "Article",
    url: "https://www.svri.org/mind-body-approaches-for-healing-after-sexual-violence/",
    icon: Heart,
  },
  {
    name: "Understanding the Impact of Trauma",
    description: "Scientific guide to how trauma affects the brain and body",
    type: "Research",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK207191/",
    icon: BookOpen,
  },
];

const legalResources = [
  {
    name: "Know Your Rights - RAINN",
    description:
      "Comprehensive legal rights guide for survivors in the United States",
    type: "Guide",
    url: "https://rainn.org/articles/your-rights-crime-victim",
    icon: Scale,
  },
  {
    name: "Women's Aid Survivors Handbook",
    description: "Practical legal support and information for survivors (UK)",
    type: "Handbook",
    url: "https://www.womensaid.org.uk/information-support/the-survivors-handbook/",
    icon: BookOpen,
  },
  {
    name: "Domestic Violence Legal Aid Directory",
    description: "Find free legal assistance in your area",
    type: "Directory",
    url: "https://www.thehotline.org/resources/legal-resources/",
    icon: MapPin,
  },
  {
    name: "Immigration Legal Help (U Visa & VAWA)",
    description: "Legal resources for immigrant survivors",
    type: "Legal Aid",
    url: "https://www.immigrantjustice.org/issues/victims-violence-and-trafficking",
    icon: Scale,
  },
];

const safetyPlanningResources = [
  {
    name: "Create Your Personal Safety Plan",
    description: "Interactive tool to create a customized safety plan",
    type: "Interactive",
    url: "https://www.thehotline.org/plan-for-safety/create-your-personal-safety-plan/",
    icon: Shield,
  },
  {
    name: "Domestic Violence Safety Planning Guide (PDF)",
    description: "Comprehensive PDF guide for planning your safety",
    type: "PDF",
    url: "https://www.shelterforhelpinemergency.org/images/pdfs/DV-Safety-Plan.pdf",
    icon: Download,
  },
  {
    name: "Women's Aid Safety Planning Booklet (PDF)",
    description: "Detailed safety strategies for various situations",
    type: "PDF",
    url: "https://www.womensaidnel.org/wp-content/uploads/2019/07/Safety-Planning-Feb11.pdf",
    icon: Download,
  },
  {
    name: "Workplace Safety Planning Guide (PDF)",
    description: "Creating safety plans for the workplace",
    type: "PDF",
    url: "https://humanrights.gov.au/sites/default/files/Annex%20B%20safety_planning.pdf",
    icon: Download,
  },
];

const educationalContent = [
  {
    name: "Warning Signs of Abuse in Relationships",
    description: "How to recognize abusive behavior patterns and red flags",
    type: "Article",
    url: "https://www.thehotline.org/identify-abuse/domestic-abuse-warning-signs/",
    icon: AlertCircle,
  },
  {
    name: "Recognizing Abusive Relationships",
    description:
      "Detailed guide to identifying controlling and harmful behaviors",
    type: "Guide",
    url: "https://wadvocates.org/find-help/about-domestic-violence/warning-signs-of-abuse/",
    icon: AlertCircle,
  },
  {
    name: "Is My Relationship Healthy?",
    description: "Self-assessment tool and guidance from Women's Aid",
    type: "Article",
    url: "https://www.womensaid.org.uk/information-support/the-survivors-handbook/im-not-sure-if-my-relationship-is-healthy/",
    icon: Heart,
  },
  {
    name: "Dating Abuse Warning Signs",
    description: "Recognizing warning signs in dating relationships",
    type: "Article",
    url: "https://www.loveisrespect.org/dating-basics-for-healthy-relationships/warning-signs-of-abuse/",
    icon: AlertCircle,
  },
  {
    name: "Books on Trauma & Recovery",
    description: "Recommended reading list for survivors",
    type: "Resource List",
    url: "https://sexualrespect.columbia.edu/resources-healing-resilience-readings",
    icon: BookOpen,
  },
];

const ngoPartners = [
  {
    name: "RAINN (Rape, Abuse & Incest National Network)",
    description:
      "Largest anti-sexual violence organization in the United States",
    website: "rainn.org",
    url: "https://www.rainn.org",
    type: "International",
  },
  {
    name: "The National Domestic Violence Hotline",
    description: "24/7 support, resources, and safety planning for survivors",
    website: "thehotline.org",
    url: "https://www.thehotline.org",
    type: "National",
  },
  {
    name: "Women's Aid (UK)",
    description: "UK domestic abuse charity providing support and advocacy",
    website: "womensaid.org.uk",
    url: "https://www.womensaid.org.uk",
    type: "National",
  },
  {
    name: "UN Women",
    description:
      "International organization for gender equality and women's empowerment",
    website: "unwomen.org",
    url: "https://www.unwomen.org",
    type: "International",
  },
  {
    name: "Asian Pacific Institute on GBV",
    description: "Resources for Asian and Pacific Islander communities",
    website: "api-gbv.org",
    url: "https://api-gbv.org",
    type: "Community",
  },
  {
    name: "Love Is Respect",
    description: "Support and education for healthy relationships (ages 13-26)",
    website: "loveisrespect.org",
    url: "https://www.loveisrespect.org",
    type: "Youth",
  },
];

const featuredResources = [
  {
    title: "Create Your Safety Plan",
    description: "Interactive tool to build a personalized safety plan",
    type: "Interactive",
    icon: Shield,
    url: "https://www.thehotline.org/plan-for-safety/create-your-personal-safety-plan/",
  },
  {
    title: "Find Nearest Shelter",
    description: "Search database of domestic violence shelters in your area",
    type: "Directory",
    icon: MapPin,
    url: "https://www.domesticshelters.org",
  },
  {
    title: "Safety Planning PDF",
    description: "Download comprehensive safety planning guide",
    type: "PDF",
    icon: Download,
    url: "https://www.shelterforhelpinemergency.org/images/pdfs/DV-Safety-Plan.pdf",
  },
];

export function ResourcesContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("North America");

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 space-y-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Resources Hub
          </h1>
          <p className="text-base text-muted-foreground md:text-lg">
            Access emergency contacts, mental health support, legal aid,
            educational content, and support networks worldwide
          </p>
        </div>

        {/* Emergency Alert */}
        <Card className="border-destructive bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Phone className="h-5 w-5" />
              In Immediate Danger?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              If you are in immediate danger, call your local emergency number
              (911, 999, 112) or use the hotlines below.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Button
                variant="destructive"
                className="w-full justify-start"
                size="lg"
                asChild
              >
                <a href="tel:18007997233">
                  <Phone className="mr-2 h-4 w-4" />
                  Call 1-800-799-7233
                </a>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                size="lg"
                asChild
              >
                <a
                  href="https://www.domesticshelters.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Find Nearest Shelter
                </a>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                size="lg"
                asChild
              >
                <a
                  href="https://www.thehotline.org/resources/legal-resources/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Scale className="mr-2 h-4 w-4" />
                  Legal Aid Now
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Featured Resources */}
        <div className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-foreground md:text-2xl">
            Featured Resources
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredResources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <Card key={index} className="transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Icon className="h-8 w-8 text-primary" />
                      <Badge variant="secondary">{resource.type}</Badge>
                    </div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" size="sm" asChild>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Access Resource
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Global Emergency Hotlines */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Globe className="h-6 w-6 text-destructive" />
              <CardTitle className="text-xl md:text-2xl">
                Global Emergency Hotlines
              </CardTitle>
            </div>
            <CardDescription>
              24/7 crisis support and emergency services by region
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedRegion} onValueChange={setSelectedRegion}>
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                {Object.keys(emergencyHotlines).map((region) => (
                  <TabsTrigger key={region} value={region} className="text-xs">
                    {region}
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(emergencyHotlines).map(([region, countries]) => (
                <TabsContent
                  key={region}
                  value={region}
                  className="space-y-4 mt-6"
                >
                  {countries.map((country, idx) => (
                    <Card key={idx} className="border-2">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {country.country}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {country.services.map((service, sIdx) => (
                            <div key={sIdx} className="p-3 bg-muted rounded-lg">
                              <p className="font-semibold text-sm">
                                {service.name}
                              </p>
                              <a
                                href={`tel:${service.contact.replace(
                                  /\s/g,
                                  ""
                                )}`}
                                className="text-primary font-mono text-lg hover:underline"
                              >
                                {service.contact}
                              </a>
                              <div className="flex items-center justify-between mt-2">
                                <Badge variant="secondary" className="text-xs">
                                  {service.available}
                                </Badge>
                                {service.website && (
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="h-auto p-0"
                                    asChild
                                  >
                                    <a
                                      href={service.website}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Mental Health Support */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl md:text-2xl">
                Mental Health & Recovery Resources
              </CardTitle>
            </div>
            <CardDescription>
              Expert guides on trauma, healing, and therapy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mentalHealthResources.map((resource, index) => {
                const Icon = resource.icon;
                return (
                  <Card
                    key={index}
                    className="border-2 transition-all hover:border-primary"
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <Icon className="h-5 w-5 text-primary" />
                          <Badge variant="outline" className="text-xs">
                            {resource.type}
                          </Badge>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">
                            {resource.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {resource.description}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          asChild
                        >
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-2 h-3 w-3" />
                            Read More
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Safety Planning */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-secondary" />
              <CardTitle className="text-xl md:text-2xl">
                Safety Planning Resources
              </CardTitle>
            </div>
            <CardDescription>
              Create personalized safety plans and download guides
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {safetyPlanningResources.map((resource, index) => {
                const Icon = resource.icon;
                return (
                  <Card
                    key={index}
                    className="border-2 transition-all hover:border-primary"
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <Icon className="h-5 w-5 text-primary" />
                          <Badge variant="outline" className="text-xs">
                            {resource.type}
                          </Badge>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground text-sm mb-1">
                            {resource.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {resource.description}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          asChild
                        >
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Icon className="mr-2 h-3 w-3" />
                            Access
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Educational Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-accent" />
              <CardTitle className="text-xl md:text-2xl">
                Educational Content
              </CardTitle>
            </div>
            <CardDescription>
              Learn about abuse patterns, warning signs, and recovery
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {educationalContent.map((resource, index) => {
                const Icon = resource.icon;
                return (
                  <Card
                    key={index}
                    className="border-2 transition-all hover:border-primary"
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <Icon className="h-5 w-5 text-primary" />
                          <Badge variant="outline" className="text-xs">
                            {resource.type}
                          </Badge>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">
                            {resource.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {resource.description}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          asChild
                        >
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-2 h-3 w-3" />
                            Learn More
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* NGO Partners */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-success" />
              <CardTitle className="text-xl md:text-2xl">
                Trusted NGO Partners
              </CardTitle>
            </div>
            <CardDescription>
              Organizations providing support, advocacy, and resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ngoPartners.map((ngo, index) => (
                <Card
                  key={index}
                  className="border-2 transition-all hover:border-primary"
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <Users className="h-5 w-5 text-primary" />
                        <Badge variant="outline" className="text-xs">
                          {ngo.type}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {ngo.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {ngo.description}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        asChild
                      >
                        <a
                          href={ngo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-2 h-3 w-3" />
                          Visit {ngo.website}
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
