import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Mail, 
  Calendar, 
  FileText, 
  Download,
  RefreshCw
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("subscribers");

  const { data: subscribers, isLoading: subscribersLoading, refetch: refetchSubscribers } = useQuery({
    queryKey: ["/api/newsletter/subscribers"],
  });

  const { data: contacts, isLoading: contactsLoading, refetch: refetchContacts } = useQuery({
    queryKey: ["/api/contact/submissions"],
  });

  const { data: events, isLoading: eventsLoading, refetch: refetchEvents } = useQuery({
    queryKey: ["/api/event/bookings"],
  });

  const { data: applications, isLoading: applicationsLoading, refetch: refetchApplications } = useQuery({
    queryKey: ["/api/job/applications"],
  });

  const downloadCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-playfair font-bold text-battles-black mb-2">
            Battles Budz <span className="text-battles-gold">Admin Portal</span>
          </h1>
          <p className="text-battles-gray">
            Manage newsletter subscribers, contacts, events, and applications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Newsletter Subscribers</CardTitle>
              <Users className="h-4 w-4 text-battles-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-battles-black">
                {subscribers?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contact Submissions</CardTitle>
              <Mail className="h-4 w-4 text-battles-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-battles-black">
                {contacts?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Event Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-battles-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-battles-black">
                {events?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Job Applications</CardTitle>
              <FileText className="h-4 w-4 text-battles-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-battles-black">
                {applications?.length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Tables */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="subscribers">Newsletter Subscribers</TabsTrigger>
            <TabsTrigger value="contacts">Contact Submissions</TabsTrigger>
            <TabsTrigger value="events">Event Bookings</TabsTrigger>
            <TabsTrigger value="applications">Job Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="subscribers" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Newsletter Subscribers</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => refetchSubscribers()}
                      variant="outline"
                      size="sm"
                      disabled={subscribersLoading}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                    <Button
                      onClick={() => downloadCSV(subscribers, 'newsletter-subscribers')}
                      variant="outline"
                      size="sm"
                      disabled={!subscribers || subscribers.length === 0}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {subscribersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-battles-gold"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4 font-semibold">Email</th>
                          <th className="text-left p-4 font-semibold">Subscribed Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscribers?.map((subscriber: any) => (
                          <tr key={subscriber.id} className="border-b hover:bg-gray-50">
                            <td className="p-4">{subscriber.email}</td>
                            <td className="p-4">
                              {new Date(subscriber.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Contact Submissions</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => refetchContacts()}
                      variant="outline"
                      size="sm"
                      disabled={contactsLoading}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                    <Button
                      onClick={() => downloadCSV(contacts, 'contact-submissions')}
                      variant="outline"
                      size="sm"
                      disabled={!contacts || contacts.length === 0}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {contactsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-battles-gold"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4 font-semibold">Name</th>
                          <th className="text-left p-4 font-semibold">Email</th>
                          <th className="text-left p-4 font-semibold">Message</th>
                          <th className="text-left p-4 font-semibold">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contacts?.map((contact: any) => (
                          <tr key={contact.id} className="border-b hover:bg-gray-50">
                            <td className="p-4">{contact.name}</td>
                            <td className="p-4">{contact.email}</td>
                            <td className="p-4 max-w-md">
                              <div className="truncate">{contact.message}</div>
                            </td>
                            <td className="p-4">
                              {new Date(contact.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Event Bookings</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => refetchEvents()}
                      variant="outline"
                      size="sm"
                      disabled={eventsLoading}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                    <Button
                      onClick={() => downloadCSV(events, 'event-bookings')}
                      variant="outline"
                      size="sm"
                      disabled={!events || events.length === 0}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {eventsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-battles-gold"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4 font-semibold">Name</th>
                          <th className="text-left p-4 font-semibold">Email</th>
                          <th className="text-left p-4 font-semibold">Event Type</th>
                          <th className="text-left p-4 font-semibold">Preferred Date</th>
                          <th className="text-left p-4 font-semibold">Guests</th>
                          <th className="text-left p-4 font-semibold">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {events?.map((event: any) => (
                          <tr key={event.id} className="border-b hover:bg-gray-50">
                            <td className="p-4">{event.name}</td>
                            <td className="p-4">{event.email}</td>
                            <td className="p-4">
                              <Badge variant="outline">{event.eventType}</Badge>
                            </td>
                            <td className="p-4">{event.preferredDate}</td>
                            <td className="p-4">{event.guestCount}</td>
                            <td className="p-4">
                              {new Date(event.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Job Applications</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => refetchApplications()}
                      variant="outline"
                      size="sm"
                      disabled={applicationsLoading}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                    <Button
                      onClick={() => downloadCSV(applications, 'job-applications')}
                      variant="outline"
                      size="sm"
                      disabled={!applications || applications.length === 0}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {applicationsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-battles-gold"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4 font-semibold">Name</th>
                          <th className="text-left p-4 font-semibold">Email</th>
                          <th className="text-left p-4 font-semibold">Position</th>
                          <th className="text-left p-4 font-semibold">Experience</th>
                          <th className="text-left p-4 font-semibold">Resume</th>
                          <th className="text-left p-4 font-semibold">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications?.map((application: any) => (
                          <tr key={application.id} className="border-b hover:bg-gray-50">
                            <td className="p-4">
                              {application.firstName} {application.lastName}
                            </td>
                            <td className="p-4">{application.email}</td>
                            <td className="p-4">
                              <Badge variant="outline">{application.position}</Badge>
                            </td>
                            <td className="p-4">{application.experience}</td>
                            <td className="p-4">
                              {application.resumeFileName ? (
                                <Badge variant="secondary">
                                  {application.resumeFileName}
                                </Badge>
                              ) : (
                                <span className="text-gray-400">No resume</span>
                              )}
                            </td>
                            <td className="p-4">
                              {new Date(application.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}