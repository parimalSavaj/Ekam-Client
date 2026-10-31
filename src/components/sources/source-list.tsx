"use client";

import { useState } from "react";
import { ExternalLink, Trash } from "lucide-react";
import { ActionMenu } from "@/components/platform/action-menu";
import {
  formatFileSize,
  SOURCE_STATUS_LABEL,
  SOURCE_STATUS_VARIANT,
  SOURCE_TYPE_PLURAL,
  sourceKind,
  sourceTitle,
} from "@/components/sources/source-format";
import { DotList } from "@/components/platform/dot-list";
import { formatDate } from "@/components/workspaces/format-date";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Source, SourceType } from "@/lib/sources-api";

type Filter = "all" | SourceType;

const TYPE_ORDER: SourceType[] = ["pdf", "web_page", "text_file"];

function SourceRow({ source, onDelete }: { source: Source; onDelete: (source: Source) => void }) {
  const kind = sourceKind(source);
  const title = sourceTitle(source);

  return (
    <li className="flex items-start gap-3 border-b px-(--card-padding) py-4 last:border-b-0 sm:gap-4">
      {/* Decorative (the details line names the type), so phones give its width to the name. */}
      <span className="grid size-10 shrink-0 place-items-center rounded-md border bg-secondary max-sm:hidden" aria-hidden="true">
        <kind.icon className="size-5 text-muted-foreground" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium wrap-anywhere">{title}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
          <Badge variant={SOURCE_STATUS_VARIANT[source.status]}>{SOURCE_STATUS_LABEL[source.status]}</Badge>
          <DotList
            className="text-xs text-muted-foreground"
            items={[
              kind.label,
              source.sizeBytes !== null && formatFileSize(source.sizeBytes),
              `Added ${formatDate(source.createdAt)}`,
            ]}
          />
        </div>
      </div>
      <ActionMenu
        label={`Actions for ${title}`}
        variant="ghost"
        size="icon-sm"
        className="-mr-2 shrink-0"
        entries={[
          ...(source.type === "web_page" && source.url
            ? [
              { kind: "link", label: "Open web page", icon: ExternalLink, href: source.url } as const,
              { kind: "separator" } as const,
            ]
            : []),
          { kind: "action", label: "Delete source", icon: Trash, destructive: true, onSelect: () => onDelete(source) },
        ]}
      />
    </li>
  );
}

function Rows({ sources, onDelete }: { sources: readonly Source[]; onDelete: (source: Source) => void }) {
  return (
    <Card className="gap-0 py-0">
      <ul>{sources.map(source => <SourceRow key={source.id} source={source} onDelete={onDelete} />)}</ul>
    </Card>
  );
}

/**
 * The knowledge base's sources, newest first. A type filter appears once the list holds more
 * than one kind of source.
 */
export function SourceList({ sources, onDelete }: { sources: readonly Source[]; onDelete: (source: Source) => void }) {
  const [filter, setFilter] = useState<Filter>("all");
  const types = TYPE_ORDER.filter(type => sources.some(source => source.type === type));

  if (types.length < 2) return <Rows sources={sources} onDelete={onDelete} />;

  // A filter whose last source was deleted falls back to everything.
  const active: Filter = filter !== "all" && !types.includes(filter) ? "all" : filter;
  const options: { value: Filter; label: string; count: number }[] = [
    { value: "all", label: "All", count: sources.length },
    ...types.map(type => ({
      value: type,
      label: SOURCE_TYPE_PLURAL[type],
      count: sources.filter(source => source.type === type).length,
    })),
  ];

  return (
    <Tabs value={active} onValueChange={value => setFilter(value as Filter)} className="gap-4">
      {/* No overflow clipping: it would cut off the focus ring. The pills wrap on narrow screens. */}
      <TabsList variant="pill" aria-label="Show sources by type" className="flex-wrap justify-start">
        {options.map(option => <TabsTrigger key={option.value} value={option.value} className="flex-none">
          {option.label}<span className="tabular-nums">{option.count}</span>
        </TabsTrigger>)}
      </TabsList>
      {options.map(option => <TabsContent
        key={option.value}
        value={option.value}
        tabIndex={-1}
        className="focus-visible:outline-none"
      >
        <Rows
          sources={option.value === "all" ? sources : sources.filter(source => source.type === option.value)}
          onDelete={onDelete}
        />
      </TabsContent>)}
    </Tabs>
  );
}
