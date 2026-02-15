"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Command, CommandInput } from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useState } from "react";

interface RegistrationsFiltersProps {
  onSearchChange: (search: string) => void;
  onEventTypeChange: (eventType: string) => void;
  onDateRangeChange: (dateRange: DateRange | undefined) => void;
  onResetFilters: () => void;
  events: Array<{ _id: string; title: string }>;
}

export function RegistrationsFilters({
  onSearchChange,
  onEventTypeChange,
  onDateRangeChange,
  onResetFilters,
  events,
}: RegistrationsFiltersProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    onDateRangeChange(range);
  };

  const handleReset = () => {
    setDateRange(undefined);
    onResetFilters();
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
          <div>
            <label className="text-sm font-medium mb-2 block">Search</label>
            <Command className="border rounded-lg">
              <CommandInput
                placeholder="Name or Phone..."
                onValueChange={onSearchChange}
              />
            </Command>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Event</label>
            <Select onValueChange={onEventTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Events" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                {events.map((event) => (
                  <SelectItem key={event._id} value={event._id}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Date Range</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left">
                  {dateRange?.from
                    ? `${dateRange.from.toLocaleDateString()} ${dateRange.to ? `- ${dateRange.to.toLocaleDateString()}` : ""}`
                    : "Select Date Range"}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Action</label>
            <Button
              onClick={handleReset}
              variant="outline"
              className="w-full"
              title="Reset all filters"
            >
              <X className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
