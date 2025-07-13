import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertJobApplicationSchema } from "@shared/schema";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X } from "lucide-react";

const jobApplicationFormSchema = insertJobApplicationSchema.extend({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  position: z.string().min(1, "Position is required"),
  experience: z.string().min(1, "Experience level is required"),
  availability: z.string().min(1, "Availability is required"),
  coverLetter: z.string().optional(),
  resumeFileName: z.string().optional(),
  resumeFileData: z.string().optional(),
});

type JobApplicationFormData = z.infer<typeof jobApplicationFormSchema>;

export default function JobApplicationForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<JobApplicationFormData>({
    resolver: zodResolver(jobApplicationFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      position: "",
      experience: "",
      availability: "",
      coverLetter: "",
      resumeFileName: "",
      resumeFileData: "",
    },
  });

  const position = watch("position");
  const experience = watch("experience");
  const availability = watch("availability");

  const mutation = useMutation({
    mutationFn: async (data: JobApplicationFormData) => {
      const response = await apiRequest("POST", "/api/job-applications", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted!",
        description: "Thank you for your interest in joining Battles Budz. We'll review your application and get back to you soon.",
      });
      reset();
      setResumeFile(null);
      setIsFormOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/job-applications"] });
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload a resume file smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      // Check file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF or Word document.",
          variant: "destructive",
        });
        return;
      }

      setResumeFile(file);
      setValue("resumeFileName", file.name);

      // Convert file to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        setValue("resumeFileData", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setResumeFile(null);
    setValue("resumeFileName", "");
    setValue("resumeFileData", "");
  };

  const onSubmit = (data: JobApplicationFormData) => {
    mutation.mutate(data);
  };

  if (!isFormOpen) {
    return (
      <div className="text-center">
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-battles-gold text-battles-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
        >
          Apply Now
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl p-8 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-battles-gold">Join Our Team</h3>
        <Button
          onClick={() => setIsFormOpen(false)}
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="firstName" className="text-white">
              First Name *
            </Label>
            <Input
              id="firstName"
              {...register("firstName")}
              className="bg-gray-800 border-gray-700 text-white mt-1"
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <p className="text-red-400 text-sm mt-1">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="lastName" className="text-white">
              Last Name *
            </Label>
            <Input
              id="lastName"
              {...register("lastName")}
              className="bg-gray-800 border-gray-700 text-white mt-1"
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <p className="text-red-400 text-sm mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="email" className="text-white">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className="bg-gray-800 border-gray-700 text-white mt-1"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone" className="text-white">
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              {...register("phone")}
              className="bg-gray-800 border-gray-700 text-white mt-1"
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="position" className="text-white">
            Position of Interest *
          </Label>
          <Select value={position} onValueChange={(value) => setValue("position", value)}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
              <SelectValue placeholder="Select a position" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="budtender">Budtender</SelectItem>
              <SelectItem value="cultivation">Cultivation Specialist</SelectItem>
              <SelectItem value="processing">Processing Technician</SelectItem>
              <SelectItem value="delivery">Delivery Driver</SelectItem>
              <SelectItem value="management">Management</SelectItem>
              <SelectItem value="marketing">Marketing & Social Media</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.position && (
            <p className="text-red-400 text-sm mt-1">{errors.position.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="experience" className="text-white">
              Cannabis Industry Experience *
            </Label>
            <Select value={experience} onValueChange={(value) => setValue("experience", value)}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="none">No experience</SelectItem>
                <SelectItem value="less-than-1">Less than 1 year</SelectItem>
                <SelectItem value="1-2">1-2 years</SelectItem>
                <SelectItem value="3-5">3-5 years</SelectItem>
                <SelectItem value="5-plus">5+ years</SelectItem>
              </SelectContent>
            </Select>
            {errors.experience && (
              <p className="text-red-400 text-sm mt-1">{errors.experience.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="availability" className="text-white">
              Availability *
            </Label>
            <Select value={availability} onValueChange={(value) => setValue("availability", value)}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="weekends">Weekends only</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
            {errors.availability && (
              <p className="text-red-400 text-sm mt-1">{errors.availability.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="coverLetter" className="text-white">
            Cover Letter / Why do you want to work at Battles Budz?
          </Label>
          <Textarea
            id="coverLetter"
            {...register("coverLetter")}
            className="bg-gray-800 border-gray-700 text-white mt-1 min-h-[100px]"
            placeholder="Tell us about yourself and why you'd be a great fit for our team..."
          />
          {errors.coverLetter && (
            <p className="text-red-400 text-sm mt-1">{errors.coverLetter.message}</p>
          )}
        </div>

        <div>
          <Label className="text-white">Resume Upload</Label>
          <div className="mt-2">
            {resumeFile ? (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Upload className="h-5 w-5 text-battles-gold mr-2" />
                    <span className="text-white text-sm">{resumeFile.name}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-battles-gold mx-auto mb-4" />
                <p className="text-white mb-2">Upload your resume</p>
                <p className="text-gray-400 text-sm mb-4">PDF or Word documents, max 5MB</p>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                />
                <Label
                  htmlFor="resume-upload"
                  className="bg-battles-gold text-battles-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors cursor-pointer"
                >
                  Choose File
                </Label>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            onClick={() => setIsFormOpen(false)}
            className="bg-gray-700 text-white border border-gray-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="bg-battles-gold text-battles-black px-8 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50"
          >
            {mutation.isPending ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </form>
    </div>
  );
}