"use server";

import { connectDB } from "@/lib/mongoose";
import { Event } from "@/models/Event";
import { EventRegistration } from "@/models/EventRegistration";
import { storageClient } from '@/lib/supabase'

export const getEvents = async function () {
  try {
    await connectDB();
    const events = await Event.find({}).sort({ createdAt: -1 }).lean();
    return events.map(event => ({
      _id: event._id.toString(),
      title: event.title,
      date: event.date,
      image: event.image,
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export const createEvent = async function (data: {
  title: string;
  description?: string;
  date: Date;
  image?: string;
  location?: string;
}) {
  try {
    await connectDB();
    const event = await Event.create({
      title: data.title,
      description: data.description || "",
      date: data.date,
      image: data.image || "",
      location: data.location || "",
    });

    return {
      success: true,
      message: "Event created successfully",
      event: {
        _id: event._id.toString(),
        title: event.title,
        date: event.date,
        image: event.image,
      },
    };
  } catch (error) {
    console.error("Error creating event:", error);
    return {
      success: false,
      message: "Failed to create event",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export const deleteEvent = async function (eventId: string) {
  try {
    await connectDB();

    // Delete all registrations for this event
    await EventRegistration.deleteMany({ event: eventId });

    // Delete the event
    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return {
        success: false,
        message: "Event not found",
      };
    }

    return {
      success: true,
      message: "Event and associated registrations deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting event:", error);
    return {
      success: false,
      message: "Failed to delete event",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export const getEventRegistrations = async function () {
  try {
    await connectDB();
    const registrations = await EventRegistration.find({})
      .populate('event', 'title')
      .sort({ createdAt: -1 })
      .lean();

    return registrations.map(reg => ({
      _id: reg._id.toString(),
      name: reg.name,
      phone: reg.phone,
      location: reg.location || "N/A",
      event: reg.event?.title || "Unknown Event",
      eventId: reg.event?._id?.toString() || "",
      date: new Date(reg.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      rawDate: new Date(reg.createdAt),
    }));
  } catch (error) {
    console.error("Error fetching event registrations:", error);
    return [];
  }
};

// event files:


interface UploadResponse {
  path?: string
  fullPath?: string
  error?: string
}

export async function uploadFile(
  formData: FormData,
  bucketName: string = 'event'
): Promise<UploadResponse> {
  try {
    const file = formData.get('file') as File
    const fileName = formData.get('fileName') as string

    if (!file) {
      return { error: 'No file provided' }
    }

    const buffer = await file.arrayBuffer()

    const { data, error } = await storageClient
      .from(bucketName)
      .upload(`${fileName}`, buffer, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.log(error.message);
      return { error: error.message }
    }

    return {
      path: data?.path,
      fullPath: data?.fullPath,
    }
  } catch (err) {
    return { error: `Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}` }
  }
}