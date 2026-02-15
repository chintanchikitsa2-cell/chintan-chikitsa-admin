"use client";

import Image from "next/image";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { createEvent, uploadFile } from "@/actions/event";

/* ---------------- SCHEMA ---------------- */

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string().min(1, "Date is required"),
  image: z.instanceof(File).optional(),
});

type FormValues = z.infer<typeof formSchema>;

/* ---------------- PAGE ---------------- */

export default function CreateEventPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      date: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);

      let imageUrl = "";

      // Upload image if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("fileName", `event-${Date.now()}-${selectedFile.name}`);

        const uploadResponse = await uploadFile(formData, "event");

        if (uploadResponse.error) {
          alert("Image upload failed: " + uploadResponse.error);
          setIsLoading(false);
          return;
        }

        imageUrl = uploadResponse.path || "";
      }

      // Create event
      const result = await createEvent({
        title: values.title,
        date: new Date(values.date),
        image: imageUrl,
      });

      if (result.success) {
        alert("Event created successfully!");
        router.push("/web-app/event");
      } else {
        alert("Failed to create event: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating the event");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    setSelectedFile(file);
  };

  return (
    <div className="max-w-4xl p-8">

      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
        Create New Event
      </h1>

      <p className="text-muted-foreground text-xl text-center">
        Fill in the details below to schedule a new wellness session.
      </p>

      <Card className="mt-10">
        <CardHeader>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Event Details
          </h3>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Morning Yoga"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date & Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* IMAGE UPLOAD */}

              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel>Event Cover Image</FormLabel>

                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isLoading}
                      />
                    </FormControl>

                    {preview && (
                      <div className="mt-4">
                        <AspectRatio ratio={16 / 9}>
                          <Image
                            src={preview}
                            alt="Preview"
                            fill
                            className="rounded-md object-cover"
                          />
                        </AspectRatio>
                      </div>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ACTIONS */}

              <div className="flex justify-end gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  onClick={() => router.push("/web-app/event")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Publish Now"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
