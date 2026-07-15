"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, Download, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { ResponseDetailModal } from "@/components/response-detail-modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Question, ResponseStatus, ResponseWithAnswers } from "@/lib/supabase/types";

type SortKey = "name" | "date" | "videos" | "texts" | "status";

const statusVariant: Record<ResponseStatus, "secondary" | "default" | "destructive"> = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
};

function toCsvValue(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function CustomersTable({
  initialResponses,
  questions,
}: {
  initialResponses: ResponseWithAnswers[];
  questions: Question[];
}) {
  const [responses, setResponses] = useState(initialResponses);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedResponseId, setSelectedResponseId] = useState<string | null>(null);

  const rows = useMemo(() => {
    return responses.map((response) => ({
      response,
      videoCount: response.answers.filter((a) => a.video_url).length,
      textCount: response.answers.filter((a) => a.text_answer).length,
    }));
  }, [responses]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q
      ? rows.filter((row) =>
          [row.response.customer_name, row.response.customer_email, row.response.customer_phone]
            .filter(Boolean)
            .some((field) => field!.toLowerCase().includes(q))
        )
      : rows;

    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      switch (sortKey) {
        case "name":
          comparison = (a.response.customer_name ?? "").localeCompare(b.response.customer_name ?? "");
          break;
        case "date":
          comparison = new Date(a.response.created_at).getTime() - new Date(b.response.created_at).getTime();
          break;
        case "videos":
          comparison = a.videoCount - b.videoCount;
          break;
        case "texts":
          comparison = a.textCount - b.textCount;
          break;
        case "status":
          comparison = a.response.status.localeCompare(b.response.status);
          break;
      }
      return sortAsc ? comparison : -comparison;
    });

    return sorted;
  }, [rows, search, sortKey, sortAsc]);

  const selectedResponse = responses.find((r) => r.id === selectedResponseId) ?? null;

  function handleStatusChange(responseId: string, status: ResponseStatus) {
    setResponses((prev) => prev.map((r) => (r.id === responseId ? { ...r, status } : r)));
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  function exportCsv() {
    const header = ["Name", "Email", "Phone", "Date", "# Videos", "# Text", "Status"];
    const lines = [header.join(",")];

    for (const row of filteredRows) {
      lines.push(
        [
          toCsvValue(row.response.customer_name ?? ""),
          toCsvValue(row.response.customer_email ?? ""),
          toCsvValue(row.response.customer_phone ?? ""),
          toCsvValue(new Date(row.response.created_at).toLocaleDateString()),
          String(row.videoCount),
          String(row.textCount),
          toCsvValue(row.response.status),
        ].join(",")
      );
    }

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "vouch-customers.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (responses.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No customers yet"
        description="Everyone who submits a testimonial will show up here."
        actionLabel="Get your QR code"
        actionHref="/dashboard/qr"
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="outline" onClick={exportCsv}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="mt-4 rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHead label="Name" sortKey="name" activeKey={sortKey} onSort={toggleSort} />
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <SortableHead label="Date" sortKey="date" activeKey={sortKey} onSort={toggleSort} />
              <SortableHead label="# Videos" sortKey="videos" activeKey={sortKey} onSort={toggleSort} />
              <SortableHead label="# Text" sortKey="texts" activeKey={sortKey} onSort={toggleSort} />
              <SortableHead label="Status" sortKey="status" activeKey={sortKey} onSort={toggleSort} />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRows.map(({ response, videoCount, textCount }) => (
              <TableRow
                key={response.id}
                className="cursor-pointer"
                onClick={() => setSelectedResponseId(response.id)}
              >
                <TableCell className="font-medium">{response.customer_name || "Anonymous"}</TableCell>
                <TableCell className="text-muted-foreground">{response.customer_email || "—"}</TableCell>
                <TableCell className="text-muted-foreground">{response.customer_phone || "—"}</TableCell>
                <TableCell>{new Date(response.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{videoCount}</TableCell>
                <TableCell>{textCount}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[response.status]} className="capitalize">
                    {response.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ResponseDetailModal
        response={selectedResponse}
        questions={questions}
        onClose={() => setSelectedResponseId(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

function SortableHead({
  label,
  sortKey,
  activeKey,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey;
  onSort: (key: SortKey) => void;
}) {
  return (
    <TableHead>
      <button
        className="flex items-center gap-1 font-medium"
        onClick={() => onSort(sortKey)}
      >
        {label}
        <ArrowUpDown className={`h-3 w-3 ${activeKey === sortKey ? "text-foreground" : "text-muted-foreground/50"}`} />
      </button>
    </TableHead>
  );
}
