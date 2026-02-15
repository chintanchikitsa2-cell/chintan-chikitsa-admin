"use client";

import { BreadcrumbNav } from "@/components/web-app/breadcrumb-nav";
import { RegistrationsTable } from "@/components/web-app/registration/registration-table";

export default function RegistrationsView() {
  return (
    <main className="flex-1 p-8 space-y-6">
      <BreadcrumbNav />

      <div>
        <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight mb-2">
          Event Registrations
        </h1>

        <p className="text-muted-foreground text-base">
          Flat list view of all user registrations for wellness retreats
          and workshops.
        </p>
      </div>

      <RegistrationsTable />
    </main>
  );
}
