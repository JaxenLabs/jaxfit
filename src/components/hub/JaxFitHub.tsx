"use client";

import { useState } from "react";
import type { TabId } from "@/content/tools";
import type { ProtocolId } from "@/lib/fit/fasting";
import { profileStore, useNow } from "@/lib/stores";
import { BodyTab } from "./BodyTab";
import { FastingTab } from "./FastingTab";
import { WaterTab } from "./WaterTab";

const TABS = [
  { id: "fasting", short: "Fasting", label: "Intermittent Fasting" },
  { id: "body", short: "BMI & Calories", label: "BMI, TDEE & Goal Date" },
  { id: "water", short: "Water", label: "Water & Habit Garden" },
] as const;

/**
 * The calculator: three tabs sharing one set of details (saved on this
 * device), opened on `defaultTab` with `defaultProtocol` as the fasting plan
 * until the visitor picks their own.
 */
export function JaxFitHub({ defaultTab, defaultProtocol }: { defaultTab: TabId; defaultProtocol: ProtocolId }) {
  const [tab, setTab] = useState<TabId>(defaultTab);
  const profile = profileStore.use();
  const now = useNow();

  return (
    <div className="card p-3 sm:p-5 lg:p-6">
      <div role="tablist" aria-label="Calculators" className="segment mb-5">
        {TABS.map((t) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => setTab(t.id)}
            className="!min-h-12"
          >
            <span className="md:hidden">{t.short}</span>
            <span className="hidden md:inline">{t.label}</span>
          </button>
        ))}
      </div>
      <div className="px-1 sm:px-0">
        <div id="panel-fasting" role="tabpanel" aria-labelledby="tab-fasting" hidden={tab !== "fasting"}>
          <FastingTab defaultProtocol={defaultProtocol} now={now} minor={profile.age < 18} />
        </div>
        <div id="panel-body" role="tabpanel" aria-labelledby="tab-body" hidden={tab !== "body"}>
          <BodyTab profile={profile} now={now} />
        </div>
        <div id="panel-water" role="tabpanel" aria-labelledby="tab-water" hidden={tab !== "water"}>
          <WaterTab profile={profile} now={now} />
        </div>
      </div>
    </div>
  );
}
