"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  Command,
  CommandInput,
} from "@/components/ui/command";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Pencil, Trash2, Plus } from "lucide-react";
import { getEvents, deleteEvent } from "@/actions/event";
import { getSupabaseImage } from "@/lib/utils";

type EventStatus = "live" | "draft";

type Event = {
  _id: string;
  title: string;
  date: string;
  image: string;
  published?: boolean;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const PER_PAGE = 6;

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const data = await getEvents();
      setEvents(
        data.map((e) => ({
          ...e,
          published: true, // Default to published for real events
        }))
      );
      setLoading(false);
    };

    fetchEvents();
  }, []);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const matchesSearch = e.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "published" && e.published) ||
        (filter === "drafts" && !e.published);

      return matchesSearch && matchesFilter;
    });
  }, [events, filter, search]);

  const paginated = filtered.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE
  );

  const togglePublish = (id: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e._id === id ? { ...e, published: !e.published } : e
      )
    );
  };

  const handleDeleteEvent = async (id: string) => {
    const result = await deleteEvent(id);
    if (result.success) {
      setEvents((prev) => prev.filter((e) => e._id !== id));
    }
  };

  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="p-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
            Manage Events
          </h1>
          <p className="text-muted-foreground text-xl">
            Create, edit, and manage your wellness sessions.
          </p>
        </div>

        <Button asChild>
          <Link href="/web-app/event/create-event">
            <Plus className="mr-2 h-4 w-4" />
            Create New Event
          </Link>
        </Button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="mt-8 flex items-center justify-between gap-6">
        <Command className="w-[360px] rounded-lg border">
          <CommandInput
            placeholder="Search events..."
            value={search}
            onValueChange={setSearch}
          />
        </Command>

        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* GRID */}
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {paginated.length > 0 ? (
          paginated.map((event) => (
            <Card key={event._id}>
              <CardHeader className="relative p-0">
                <AspectRatio ratio={16 / 9}>
                  <Image
                    src={getSupabaseImage("event", event.image)}
                    alt={event.title}
                    fill
                    className="rounded-t-lg object-cover my-[-24]"
                  />
                </AspectRatio>

                <Badge
                  className="absolute right-3 top-3"
                  variant={event.published ? "default" : "secondary"}
                >
                  {event.published ? "Live" : "Draft"}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-2 pt-4">
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                  {event.title}
                </h4>

                <p className="text-muted-foreground text-sm">
                  {new Date(event.date).toLocaleDateString()}
                </p>
              </CardContent>

              <CardFooter className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={event.published ?? true}
                    onCheckedChange={() => togglePublish(event._id)}
                  />
                  <span className="text-sm">
                    {event.published ? "Published" : "Hidden"}
                  </span>
                </div>

                <div className="flex gap-1">
                  <Button size="icon" variant="ghost">
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete event?
                        </AlertDialogTitle>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteEvent(event._id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <p className="text-muted-foreground">No events found</p>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-end">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={page === i + 1}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setPage((p) => Math.min(totalPages, p + 1))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
