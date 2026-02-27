import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../providers/supabase/supabase";

/**
 * Tables the agent (or other external sources) may write to.
 * When a change is detected, we invalidate the React Query cache
 * for that resource so the UI auto-refreshes.
 */
const WATCHED_TABLES = [
  "contacts",
  "orders",
  "tasks",
  "contact_notes",
  "members",
] as const;

/**
 * Subscribes to Supabase Realtime postgres_changes on all key tables.
 * When any INSERT/UPDATE/DELETE happens (from agent or any external source),
 * invalidates the corresponding React Query cache → UI auto-refreshes.
 *
 * Place this hook in the Layout component alongside useUserStateTracker.
 */
export function useRealtimeRefresh() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase.channel("agent-changes");

    for (const table of WATCHED_TABLES) {
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => {
          // Invalidate all queries for this resource (getList, getOne, etc.)
          queryClient.invalidateQueries({ queryKey: [table] });

          // Also invalidate summary views (contacts_summary, orders_summary)
          queryClient.invalidateQueries({
            queryKey: [`${table}_summary`],
          });
        },
      );
    }

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
