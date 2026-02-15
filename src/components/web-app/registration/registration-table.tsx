"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Download } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useEffect, useState } from "react";
import { getEventRegistrations } from "@/actions/event";
import { RegistrationsFilters } from "./registration-filters";
import { DateRange } from "react-day-picker";

type Row = {
  _id: string;
  name: string;
  phone: string;
  location: string;
  event: string;
  eventId: string;
  date: string;
  rawDate: Date;
};

const columns: ColumnDef<Row>[] = [
  {
    accessorKey: "name",
    header: "Registrant Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>
            {row.original.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        {row.original.name}
      </div>
    ),
  },
  { accessorKey: "phone", header: "Phone Number" },
  { accessorKey: "location", header: "Location" },
  { accessorKey: "event", header: "Event Name" },
  { accessorKey: "date", header: "Registration Date" },
  {
    id: "actions",
    cell: () => <ActionsCell />,
  },
];

function ActionsCell() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete this registration?
            </AlertDialogTitle>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function RegistrationsTable() {
  const [data, setData] = useState<Row[]>([]);
  const [filteredData, setFilteredData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [events, setEvents] = useState<Array<{ _id: string; title: string }>>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const registrations = await getEventRegistrations();
      setData(registrations);
      setFilteredData(registrations);

      // Extract unique events
      const uniqueEvents = Array.from(
        new Map(
          registrations.map((reg) => [reg.eventId, { _id: reg.eventId, title: reg.event }])
        ).values()
      );
      setEvents(uniqueEvents);

      setLoading(false);
    }
    fetchData();
  }, []);

  // Apply filters whenever filter values change
  useEffect(() => {
    let filtered = [...data];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (reg) =>
          reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.phone.includes(searchTerm)
      );
    }

    // Event type filter
    if (selectedEventId && selectedEventId !== "all") {
      filtered = filtered.filter((reg) => reg.eventId === selectedEventId);
    }

    // Date range filter
    if (dateRange?.from) {
      filtered = filtered.filter((reg) => {
        const regDate = new Date(reg.rawDate);
        regDate.setHours(0, 0, 0, 0);
        const fromDate = new Date(dateRange.from!);
        fromDate.setHours(0, 0, 0, 0);
        const isAfterFrom = regDate >= fromDate;
        const isBeforeTo = dateRange.to
          ? (() => {
            const toDate = new Date(dateRange.to);
            toDate.setHours(0, 0, 0, 0);
            return regDate <= toDate;
          })()
          : true;
        return isAfterFrom && isBeforeTo;
      });
    }

    setFilteredData(filtered);
  }, [searchTerm, selectedEventId, dateRange, data]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedEventId("all");
    setDateRange(undefined);
  };

  const exportToCSV = () => {
    if (filteredData.length === 0) {
      alert("No data to export");
      return;
    }

    // Prepare CSV headers
    const headers = ["Name", "Phone", "Location", "Event", "Registration Date"];
    const csvContent = [
      headers.join(","),
      ...filteredData.map((row) =>
        [
          `"${row.name}"`,
          `"${row.phone}"`,
          `"${row.location}"`,
          `"${row.event}"`,
          `"${row.date}"`,
        ].join(",")
      ),
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `registrations-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return (
      <div className="rounded-lg border bg-background p-8 text-center">
        Loading registrations...
      </div>
    );
  }

  return (
    <>
      <RegistrationsFilters
        onSearchChange={setSearchTerm}
        onEventTypeChange={setSelectedEventId}
        onDateRangeChange={setDateRange}
        onResetFilters={handleResetFilters}
        events={events}
      />

      <div className="flex justify-end mb-4">
        <Button
          onClick={exportToCSV}
          className="bg-green-600 hover:bg-green-700"
        >
          <Download className="mr-2 h-4 w-4" />
          Export to CSV
        </Button>
      </div>

      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8">
                  No registrations found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between p-4 border-t">
          <p className="text-muted-foreground text-sm">
            Showing {filteredData.length} registration{filteredData.length !== 1 ? 's' : ''}
          </p>

          <div className="flex gap-2">
            <Button size="icon" variant="outline">
              ←
            </Button>
            <Button size="icon" variant="outline">
              →
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
