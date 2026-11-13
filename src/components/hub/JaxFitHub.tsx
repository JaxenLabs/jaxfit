"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TAB_PAGES, type TabId } from "@/content/tools";
import type { ProtocolId } from "@/lib/fit/fasting";
import { profileStore, useNow } from "@/lib/stores";
import { BodyTab } from "./BodyTab";
import { FastingTab } from "./FastingTab";
import { WaterTab } from "./WaterTab";

const TABS = [
  { id: "body", short: "BMI & Calories", label: "BMI, TDEE & Goal Date" },
  { id: "fasting", short: "Fasting", label: "Intermittent Fasting" },
  { id: "water", short: "Water", label: "Water Intake Tracker" },
] as const;

/**
 * The calculator: three tabs sharing one set of details (saved on this
 * device), with `defaultProtocol` as the fasting plan until the visitor picks
 * their own.
 *
 * Each page opens on its own tab (`defaultTab`). Picking another tab opens
 * that tab's page (TAB_PAGES), so the headline above and the guide and FAQ
 * below always match; the tab switches at once and the page follows without
 * a reload or a jump in scroll position. Details, the fasting timer and the
 * garden carry over, since they are saved on the device.
 */
export function JaxFitHub({ defaultTab, defaultProtocol }: { defaultTab: TabId; defaultProtocol: ProtocolId }) {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>(defaultTab);
  const profile = profileStore.use();
  const now = useNow();

  const pick = (id: TabId) => {
    setTab(id);
    if (id !== defaultTab) router.push(`/${TAB_PAGES[id]}/`, { scroll: false });
  };

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
            onClick={() => pick(t.id)}
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
