"use client";

import { useEffect, useRef } from "react";
import { setMessageReadAction } from "@/lib/admin/workflow-actions";

export function MarkAsReadOnView({ id, alreadyRead }: { id: string; alreadyRead: boolean }) {
  const fired = useRef(false);

  useEffect(() => {
    if (alreadyRead || fired.current) return;
    fired.current = true;
    void setMessageReadAction(id, true);
  }, [id, alreadyRead]);

  return null;
}
