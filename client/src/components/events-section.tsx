import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Calendar, Users, GraduationCap, Coffee, ExternalLink, Ticket } from "lucide-react";
import { insertEventBookingSchema, type InsertEventBooking } from "@shared/schema";
import silentDiscoFlyer from "@assets/IMG_4089_1759374577725.png";

export default function EventsSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const eventBookingMutation = useMutation({
    mutationFn: async (data: InsertEventBooking) => {
      return apiRequest("POST", "/api/events/book", data);
    },
    onSuccess: () => {
      toast({
        title: "Booking Request Submitted!",
        description: "We'll contact you within 24 hours to confirm your event details.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/events/bookings"] });
    },
    onError: (error: any) => {
      toast({
        title: "Booking Error",
        description: error.message || "Failed to submit booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<InsertEventBooking>({
    resolver: zodResolver(insertEventBookingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      eventType: "",
      preferredDate: "",
      guestCount: "",
      message: "",
    },
  });

  const onSubmit = (data: InsertEventBooking) => {
    eventBookingMutation.mutate(data);
  };

  const eventTypes = [
    {
      id: "private-tasting",
      name: "Private Tasting",
      description: "Exclusive guided cannabis tasting experience",
      icon: Coffee,
      duration: "2-3 hours",
      capacity: "2-8 guests",
    },
    {
      id: "educational-workshop",
      name: "Educational Workshop",
      description: "Learn about cannabis cultivation and processing",
      icon: GraduationCap,
      duration: "3-4 hours",
      capacity: "6-15 guests",
    },
    {
      id: "group-tour",
      name: "Group Tour",
      description: "Behind-the-scenes facility tour and consumption",
      icon: Users,
      duration: "1-2 hours",
      capacity: "4-20 guests",
    },
  ];

  return (
    <section id="events" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-battles-black mb-6">
            <span className="text-battles-gold">Premium</span> Lounge Events
          </h2>
          <p className="text-xl text-battles-gray max-w-3xl mx-auto">
            Book exclusive experiences in our state-of-the-art consumption lounge. 
            From private tastings to educational workshops - create unforgettable cannabis tourism memories.
          </p>
        </div>

        {/* Featured Event - Silent Disco Party */}
        <div className="bg-gradient-to-r from-battles-black to-gray-900 rounded-2xl overflow-hidden shadow-2xl mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Flyer Image */}
            <div className="relative">
              <img 
                src={silentDiscoFlyer} 
                alt="Silent Disco Party - October 25th"
                className="w-full h-full object-cover"
                data-testid="img-silent-disco-flyer"
              />
            </div>

            {/* Event Details */}
            <div className="p-8 lg:p-12 flex flex-col justify-center text-white">
              <div className="flex items-center gap-2 mb-4">
                <Ticket className="h-6 w-6 text-battles-gold" />
                <span className="text-battles-gold font-semibold uppercase tracking-wider text-sm">
                  Featured Event
                </span>
              </div>
              
              <h3 className="text-4xl md:text-5xl font-playfair font-bold mb-4">
                Silent Disco <span className="text-battles-gold">Party</span>
              </h3>
              
              <div className="space-y-4 mb-8 text-gray-300">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-battles-gold flex-shrink-0" />
                  <span className="text-lg">October 25th, 2025</span>
                </div>
                
                <div className="border-l-4 border-battles-gold pl-4 py-2">
                  <p className="font-semibold text-battles-gold mb-2">Experiences Include:</p>
                  <ul className="space-y-1 text-base">
                    <li>• Glass Expo</li>
                    <li>• Dab Education</li>
                    <li>• Rolling Education</li>
                    <li>• Unlimited Cannabis Education</li>
                  </ul>
                </div>
                
                <div className="text-xl font-semibold text-white mt-4">
                  Membership Fee: <span className="text-battles-gold">$48</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://events.r420.me/events/silent-disco-party"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-battles-gold text-battles-black hover:bg-yellow-400 font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300 hover:scale-105 shadow-lg"
                  data-testid="button-buy-tickets"
                >
                  <Ticket className="h-5 w-5" />
                  Buy Tickets
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <p className="text-sm text-gray-400 mt-6">
                Buffalo, NY • Western New York
              </p>
            </div>
          </div>
        </div>

        {/* Event Types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {eventTypes.map((event) => {
            const IconComponent = event.icon;
            return (
              <div
                key={event.id}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
              >
                <div className="bg-battles-gold rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <IconComponent className="text-battles-black h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-battles-black mb-4">
                  {event.name}
                </h3>
                <p className="text-battles-gray mb-4">{event.description}</p>
                <div className="space-y-2 text-sm text-battles-gray">
                  <p><strong>Duration:</strong> {event.duration}</p>
                  <p><strong>Capacity:</strong> {event.capacity}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto">
          <div className="flex items-center mb-8">
            <Calendar className="text-battles-gold h-8 w-8 mr-3" />
            <h3 className="text-3xl font-bold text-battles-black">
              Book Your <span className="text-battles-gold">Experience</span>
            </h3>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="eventType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select event type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="private-tasting">Private Tasting</SelectItem>
                          <SelectItem value="educational-workshop">Educational Workshop</SelectItem>
                          <SelectItem value="group-tour">Group Tour</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="preferredDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="guestCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Guests</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select guest count" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1-2">1-2 guests</SelectItem>
                          <SelectItem value="3-5">3-5 guests</SelectItem>
                          <SelectItem value="6-10">6-10 guests</SelectItem>
                          <SelectItem value="11-15">11-15 guests</SelectItem>
                          <SelectItem value="16-20">16-20 guests</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Requests (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any special requests, dietary restrictions, or additional information..."
                        className="resize-none"
                        rows={4}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-center">
                <Button
                  type="submit"
                  disabled={eventBookingMutation.isPending}
                  className="bg-battles-gold text-battles-black hover:bg-yellow-400 font-semibold px-8 py-3 text-lg"
                >
                  {eventBookingMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting Request...
                    </>
                  ) : (
                    "Submit Booking Request"
                  )}
                </Button>
                <p className="text-sm text-battles-gray mt-4">
                  Must be 21+ to book lounge experiences. We'll confirm availability and pricing within 24 hours.
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
