import { StatCard } from "@/app/dashboard/components/cards/StatCard"

export function SectionCards() {
  const configs = [
    {
      title: "Total Revenue",
      value: "$1,250.00",
      change: 12.5,
      trend: "up",
      footerTitle: "Trending up this month",
      footerSubtitle: "Visitors for the last 6 months",
    },
    {
      title: "New Customers",
      value: 225,
      change: 8,
      trend: "down",
      footerTitle: "Down this period",
      footerSubtitle: "Acquisition needs attention",
    },
    {
      title: "Active Accounts",
      value: 1_045,
      change: 5,
      trend: "up",
      footerTitle: "Strong user retention",
      footerSubtitle: "Engagement exceed targets",
    },
    {
      title: "Growth Rate",
      value: "15%",
      change: 15,
      trend: "up",
      footerTitle: "Steady performance increase",
      footerSubtitle: "Meets growth projections",
    },
  ]

  return (
    <section>
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-6">
        {configs.map((c, idx) => (
          <StatCard
            key={idx}
            title={c.title}
            value={c.value}
            change={c.change}
            trend={c.trend}
            footerTitle={c.footerTitle}
            footerSubtitle={c.footerSubtitle}
          />
        ))}
      </div>
    </section>
  )
}
