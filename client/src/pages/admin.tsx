import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";
import { 
  Users, 
  Mail, 
  Calendar, 
  FileText, 
  Download,
  RefreshCw,
  Briefcase
} from "lucide-react";

export default function AdminDashboard() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("subscribers");

  console.log('Admin Dashboard - Auth State:', { user, isAuthenticated, isAdmin });

  const { data: subscribers, isLoading: subscribersLoading, refetch: refetchSubscribers, error: subscribersError } = useQuery({
    queryKey: ["/api/newsletter/subscribers"],
    enabled: isAuthenticated && isAdmin,
    retry: 1,
  });

  const { data: contacts, isLoading: contactsLoading, refetch: refetchContacts, error: contactsError } = useQuery({
    queryKey: ["/api/contact/submissions"],
    enabled: isAuthenticated && isAdmin,
    retry: 1,
  });

  const { data: events, isLoading: eventsLoading, refetch: refetchEvents, error: eventsError } = useQuery({
    queryKey: ["/api/event/bookings"],
    enabled: isAuthenticated && isAdmin,
    retry: 1,
  });

  const { data: applications, isLoading: applicationsLoading, refetch: refetchApplications, error: applicationsError } = useQuery({
    queryKey: ["/api/job/applications"],
    enabled: isAuthenticated && isAdmin,
    retry: 1,
  });

  console.log('Admin Dashboard - Data State:', { 
    subscribers, subscribersError, subscribersLoading,
    applications, applicationsError, applicationsLoading
  });

  const downloadCSV = (filename: string) => {
    try {
      console.log('Downloading CSV:', filename);
      // Use server endpoint for reliable downloads
      const link = document.createElement('a');
      link.href = `/api/admin/download/${filename}`;
      link.download = `${filename}.csv`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log('CSV download initiated');
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };

  const downloadResume = (applicationId: number, filename: string) => {
    try {
      console.log('Downloading resume:', filename);
      // Use server endpoint for reliable downloads
      const link = document.createElement('a');
      link.href = `/api/admin/resume/${applicationId}`;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log('Resume download initiated');
    } catch (error) {
      console.error('Error downloading resume:', error);
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-16 p-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl font-playfair font-bold text-battles-black mb-4">
              Access Denied
            </h1>
            <p className="text-battles-gray">
              You need admin privileges to access this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "subscribers":
        return (
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <CardTitle>Newsletter Subscribers</CardTitle>
                <div className="flex flex-wrap gap-2">
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
                    onClick={() => downloadCSV('subscribers')}
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
                      {subscribers && subscribers.length > 0 ? (
                        subscribers.map((subscriber: any) => (
                          <tr key={subscriber.id} className="border-b hover:bg-gray-50">
                            <td className="p-4">{subscriber.email}</td>
                            <td className="p-4">
                              {new Date(subscriber.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={2} className="p-8 text-center text-gray-500">
                            No newsletter subscribers yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case "contacts":
        return (
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <CardTitle>Contact Submissions</CardTitle>
                <div className="flex flex-wrap gap-2">
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
                    onClick={() => downloadCSV('contacts')}
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
                        <th className="text-left p-4 font-semibold">Submitted Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts && contacts.length > 0 ? (
                        contacts.map((contact: any) => (
                          <tr key={contact.id} className="border-b hover:bg-gray-50">
                            <td className="p-4">{contact.name}</td>
                            <td className="p-4">{contact.email}</td>
                            <td className="p-4 max-w-xs truncate">{contact.message}</td>
                            <td className="p-4">
                              {new Date(contact.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-gray-500">
                            No contact submissions yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case "events":
        return (
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <CardTitle>Event Bookings</CardTitle>
                <div className="flex flex-wrap gap-2">
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
                    onClick={() => downloadCSV('events')}
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
                        <th className="text-left p-4 font-semibold">Phone</th>
                        <th className="text-left p-4 font-semibold">Event Type</th>
                        <th className="text-left p-4 font-semibold">Preferred Date</th>
                        <th className="text-left p-4 font-semibold">Guest Count</th>
                        <th className="text-left p-4 font-semibold">Submitted Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events && events.length > 0 ? (
                        events.map((event: any) => (
                          <tr key={event.id} className="border-b hover:bg-gray-50">
                            <td className="p-4">{event.name}</td>
                            <td className="p-4">{event.email}</td>
                            <td className="p-4">{event.phone}</td>
                            <td className="p-4">
                              <Badge variant="outline">{event.eventType}</Badge>
                            </td>
                            <td className="p-4">{event.preferredDate}</td>
                            <td className="p-4">{event.guestCount}</td>
                            <td className="p-4">
                              {new Date(event.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-gray-500">
                            No event bookings yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case "applications":
        return (
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <CardTitle>Job Applications</CardTitle>
                <div className="flex flex-wrap gap-2">
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
                    onClick={() => downloadCSV('applications')}
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
                        <th className="text-left p-4 font-semibold">Phone</th>
                        <th className="text-left p-4 font-semibold">Position</th>
                        <th className="text-left p-4 font-semibold">Experience</th>
                        <th className="text-left p-4 font-semibold">Resume</th>
                        <th className="text-left p-4 font-semibold">Applied Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications && applications.length > 0 ? (
                        applications.map((application: any) => (
                          <tr key={application.id} className="border-b hover:bg-gray-50">
                            <td className="p-4">
                              {application.firstName} {application.lastName}
                            </td>
                            <td className="p-4">{application.email}</td>
                            <td className="p-4">{application.phone}</td>
                            <td className="p-4">
                              <Badge variant="outline">{application.position}</Badge>
                            </td>
                            <td className="p-4">{application.experience}</td>
                            <td className="p-4">
                              {application.resumeFileName && application.resumeFileData ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => downloadResume(application.id, application.resumeFileName)}
                                  className="text-battles-gold hover:bg-battles-gold hover:text-black"
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  {application.resumeFileName}
                                </Button>
                              ) : application.resumeFileName ? (
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
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-gray-500">
                            No job applications yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-16 p-6">
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
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <div className="flex flex-wrap gap-2 border-b pb-4">
                <Button
                  variant={activeTab === "subscribers" ? "default" : "ghost"}
                  onClick={() => setActiveTab("subscribers")}
                  className={`${activeTab === "subscribers" ? "bg-battles-gold text-black hover:bg-battles-gold/90" : ""} text-xs sm:text-sm flex-shrink-0`}
                >
                  Newsletter Subscribers
                </Button>
                <Button
                  variant={activeTab === "contacts" ? "default" : "ghost"}
                  onClick={() => setActiveTab("contacts")}
                  className={`${activeTab === "contacts" ? "bg-battles-gold text-black hover:bg-battles-gold/90" : ""} text-xs sm:text-sm flex-shrink-0`}
                >
                  Contact Submissions
                </Button>
                <Button
                  variant={activeTab === "events" ? "default" : "ghost"}
                  onClick={() => setActiveTab("events")}
                  className={`${activeTab === "events" ? "bg-battles-gold text-black hover:bg-battles-gold/90" : ""} text-xs sm:text-sm flex-shrink-0`}
                >
                  Event Bookings
                </Button>
                <Button
                  variant={activeTab === "applications" ? "default" : "ghost"}
                  onClick={() => setActiveTab("applications")}
                  className={`${activeTab === "applications" ? "bg-battles-gold text-black hover:bg-battles-gold/90" : ""} text-xs sm:text-sm flex-shrink-0`}
                >
                  Job Applications
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {renderTabContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}