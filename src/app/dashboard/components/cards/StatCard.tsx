import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardAction,
  CardFooter,
} from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string | number
  change: number
  trend?: "up" | "down"
  footerTitle?: string
  footerSubtitle?: string
  // endpoint?: string // para futuro fetch
}

export function StatCard({ title, value, change, trend = "up", footerTitle, footerSubtitle }: StatCardProps) {
  // Para integrar API en el futuro:
  // const [data, setData] = useState<any>(null)
  // useEffect(() => {
  //   fetch(endpoint!) // descomentar y pasar prop endpoint
  //     .then(res => res.json())
  //     .then(json => setData(json))
  // }, [endpoint])
  // if (!data) return <Card className="...">Cargando…</Card>

  const Icon = trend === "up" ? IconTrendingUp : IconTrendingDown
  const sign = trend === "up" ? "+" : "-"

  return (
    <Card>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle>{value}</CardTitle>
        <CardAction>
          <Badge variant="outline">
            <Icon /> {sign}{change}%
          </Badge>
        </CardAction>
      </CardHeader>
      {(footerTitle || footerSubtitle) && (
        <CardFooter>
          {footerTitle && (
            <div>
              {footerTitle} <Icon />
            </div>
          )}
          {footerSubtitle && <div>{footerSubtitle}</div>}
        </CardFooter>
      )}
    </Card>
  )
}