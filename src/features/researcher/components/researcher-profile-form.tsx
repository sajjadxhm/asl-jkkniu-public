"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Image from "next/image";

import { type ResearcherProfileInput } from "../validations";

import {
  removeResearcherProfileImage,
  updateResearcherProfile,
  uploadResearcherProfileImage,
} from "../actions";

type ResearcherProfileFormProps = {
  initialData: ResearcherProfileInput & {
    name: string;
    email: string;
    profileImage: string;
  };
};

const positions = [
  {
    value: "RESEARCHER",
    label: "Researcher",
  },
  {
    value: "LEAD_RESEARCHER",
    label: "Lead Researcher",
  },
  {
    value: "ASSOCIATE_RESEARCH_LEAD",
    label: "Associate Research Lead",
  },
  {
    value: "PRINCIPAL_INVESTIGATOR",
    label: "Principal Investigator",
  },
] as const;

export function ResearcherProfileForm({
  initialData,
}: ResearcherProfileFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(
    initialData.profileImage || null,
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResearcherProfileInput>({
    defaultValues: initialData,
  });

  async function handleProfilePhotoChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error("Profile photo must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    setIsUploadingPhoto(true);

    try {
      /*
       * The file is sent to the server-side action.
       *
       * The server verifies the authenticated researcher,
       * determines the correct Person ID, uploads the file
       * to Supabase Storage, and updates Person.profileImage.
       */
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadResearcherProfileImage(formData);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      setProfileImage(result.profileImage ?? null);

      toast.success("Profile photo updated successfully.");
    } catch (error) {
      console.error("Profile photo upload error:", error);

      toast.error(
        "Something went wrong while uploading the photo.",
      );
    } finally {
      setIsUploadingPhoto(false);
      event.target.value = "";
    }
  }

  async function handleRemoveProfilePhoto() {
    setIsUploadingPhoto(true);

    try {
      const result = await removeResearcherProfileImage();

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      setProfileImage(null);

      toast.success("Profile photo removed successfully.");
    } catch (error) {
      console.error("Profile photo removal error:", error);

      toast.error(
        "Something went wrong while removing the photo.",
      );
    } finally {
      setIsUploadingPhoto(false);
    }
  }

  async function onSubmit(data: ResearcherProfileInput) {
    setIsSaving(true);

    try {
      const result = await updateResearcherProfile(data);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update error:", error);

      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {/* Personal */}
      <section className="rounded-2xl border bg-background p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">
            Personal Information
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Basic information displayed on your public researcher
            profile.
          </p>
        </div>

        {/* Profile Photo */}
        <div className="mb-8 flex flex-col gap-5 rounded-xl border bg-muted/30 p-5 sm:flex-row sm:items-center">
          <div className="shrink-0">
            {profileImage ? (
             <Image
              src={profileImage}
              alt={`${initialData.name}'s profile`}
              width={112}
              height={112}
              className="h-28 w-28 rounded-full border object-cover shadow-sm"
            />
                        ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full border bg-muted text-3xl font-semibold text-muted-foreground">
                {initialData.name
                  .split(" ")
                  .map((name) => name[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-medium">Profile Photo</h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Upload a professional photo for your public researcher
              profile.
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              JPG, PNG, or WebP · Maximum 5 MB
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleProfilePhotoChange}
                disabled={isUploadingPhoto}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhoto}
                className="rounded-md border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUploadingPhoto
                  ? "Uploading..."
                  : profileImage
                    ? "Change Photo"
                    : "Upload Photo"}
              </button>

              {profileImage && !isUploadingPhoto && (
                <button
                  type="button"
                  onClick={handleRemoveProfilePhoto}
                  className="rounded-md border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Name</label>

            <input
              value={initialData.name}
              disabled
              className="mt-2 flex h-10 w-full rounded-md border bg-muted px-3 text-sm text-muted-foreground"
            />

            <p className="mt-1 text-xs text-muted-foreground">
              Name is managed by the administrator.
            </p>
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>

            <input
              value={initialData.email}
              disabled
              className="mt-2 flex h-10 w-full rounded-md border bg-muted px-3 text-sm text-muted-foreground"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Academic Designation
            </label>

            <input
              {...register("designation")}
              placeholder="e.g. Assistant Professor"
              className="mt-2 flex h-10 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Department
            </label>

            <input
              {...register("department")}
              placeholder="e.g. Department of EEE"
              className="mt-2 flex h-10 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">
              Biography
            </label>

            <textarea
              {...register("bio")}
              rows={5}
              placeholder="Write a short professional biography..."
              className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Academic */}
      <section className="rounded-2xl border bg-background p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">
            Academic Information
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Your institutional and academic information.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">
              ASL Position
            </label>

            <select
              {...register("position")}
              className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm"
            >
              {positions.map((position) => (
                <option
                  key={position.value}
                  value={position.value}
                >
                  {position.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">
              Academic Session
            </label>

            <input
              {...register("academicSession")}
              placeholder="e.g. 2019–2020"
              className="mt-2 flex h-10 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">
              University
            </label>

            <input
              {...register("university")}
              placeholder="Jatiya Kabi Kazi Nazrul Islam University"
              className="mt-2 flex h-10 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">
              Education
            </label>

            <textarea
              {...register("education")}
              rows={6}
              placeholder="List your academic degrees and institutions..."
              className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Research */}
      <section className="rounded-2xl border bg-background p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Research</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Tell visitors about your research and expertise.
          </p>
        </div>
{/* 
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium">
              Research Statement
            </label>

            <textarea
              {...register("researchStatement")}
              rows={6}
              placeholder="Describe your research focus and goals..."
              className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div> */}

          <div>
            <label className="text-sm font-medium">
              Research Interests
            </label>

            <textarea
              {...register("researchInterests")}
              rows={4}
              placeholder="e.g. Robotics, Computer Vision, SLAM, AI..."
              className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Research Experience
            </label>

            <textarea
              {...register("experience")}
              rows={6}
              placeholder="Describe your research experience..."
              className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Skills & Expertise
            </label>

            <textarea
              {...register("skills")}
              rows={4}
              placeholder="e.g. ROS, Python, MATLAB, OpenCV..."
              className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
      </section>

      {/* Projects & Awards */}
      <section className="rounded-2xl border bg-background p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">
            Projects & Awards
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Add your major research projects and awards. These
            will appear automatically on your public researcher
            profile.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium">
              Research Projects
            </label>

            <p className="mt-1 text-xs text-muted-foreground">
              List your important research or technical projects.
              You can use one project per paragraph.
            </p>

            <textarea
              {...register("projects")}
              rows={8}
              placeholder={`Example:

            Low-Cost GNSS RTK Network Development
            Research Lead — 2025
            Developed and field-validated a low-cost dual-frequency GNSS RTK network.

            Smartphone-Based Human Activity Recognition
            Researcher — 2024
            Developed a smartphone-based visual-inertial human activity recognition system.`}
              className="mt-3 w-full rounded-md border bg-background px-3 py-2 text-sm leading-6"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Awards & Achievements
            </label>

            <p className="mt-1 text-xs text-muted-foreground">
              List your important academic, research, or
              professional awards.
            </p>

            <textarea
              {...register("awards")}
              rows={7}
              placeholder={`Example:

              Session Best Paper Award — APMEE 2025
              Awarded for the research paper presented at the 6th APMEE conference.

              Research Excellence Award
              Advanced System Lab — 2025`}
              className="mt-3 w-full rounded-md border bg-background px-3 py-2 text-sm leading-6"
            />
          </div>
        </div>
      </section>

      {/* Links */}
      <section className="rounded-2xl border bg-background p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">
            Academic Links & Contact
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Connect your external academic profiles.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Phone</label>

            <input
              {...register("phone")}
              placeholder="+880..."
              className="mt-2 flex h-10 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Personal Website
            </label>

            <input
              {...register("website")}
              placeholder="https://example.com"
              className="mt-2 flex h-10 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Google Scholar
            </label>

            <input
              {...register("googleScholarUrl")}
              placeholder="https://scholar.google.com/..."
              className="mt-2 flex h-10 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium">ORCID</label>

            <input
              {...register("orcidUrl")}
              placeholder="https://orcid.org/..."
              className="mt-2 flex h-10 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              LinkedIn
            </label>

            <input
              {...register("linkedinUrl")}
              placeholder="https://linkedin.com/in/..."
              className="mt-2 flex h-10 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium">GitHub</label>

            <input
              {...register("githubUrl")}
              placeholder="https://github.com/..."
              className="mt-2 flex h-10 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Visibility */}
      <section className="rounded-2xl border bg-background p-6">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            {...register("isPublic")}
            className="mt-1 h-4 w-4"
          />

          <div>
            <label className="text-sm font-medium">
              Make my profile public
            </label>

            <p className="mt-1 text-sm text-muted-foreground">
              Your profile can appear on the ASL-JKKNIU People
              directory and public researcher pages.
            </p>
          </div>
        </div>
      </section>

      {Object.keys(errors).length > 0 && (
        <p className="text-sm text-destructive">
          Please check the highlighted fields.
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving || isUploadingPhoto}
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  );
}