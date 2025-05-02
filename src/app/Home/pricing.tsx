import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'

export default function Pricing() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-6xl px-6">
                <div className="mx-auto max-w-2xl space-y-6 text-center">
                    <h1 className="text-center text-4xl font-semibold lg:text-5xl">Precios accesibles contigo</h1>
                    <p>Una herramienta más que un producto. Cobertura con APIs de facturación ayudando a las empresas.</p>
                </div>

                <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-medium">Básico</CardTitle>

                            <span className="my-3 block text-2xl font-semibold">$60 / mes</span>

                            <CardDescription className="text-sm"></CardDescription>
                            <Button asChild variant="outline" className="mt-4 w-full">
                                <Link href="">Comprar ahora</Link>
                            </Button>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <hr className="border-dashed" />

                            <ul className="list-outside space-y-3 text-sm">
                                {['Dashboard básico y Analitics', '1,000 facturas', 'Correo electrónico de soporte'].map((item, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <Check className="size-3" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="relative">
                        <span className="bg-linear-to-br/increasing absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full from-purple-400 to-amber-300 px-3 py-1 text-xs font-medium text-amber-950 ring-1 ring-inset ring-white/20 ring-offset-1 ring-offset-gray-950/5">Popular</span>

                        <CardHeader>
                            <CardTitle className="font-medium">Profesional</CardTitle>

                            <span className="my-3 block text-2xl font-semibold">$150 / mes</span>

                            <CardDescription className="text-sm"></CardDescription>

                            <Button asChild className="mt-4 w-full">
                                <Link href="">Comprar ahora</Link>
                            </Button>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <hr className="border-dashed" />

                            <ul className="list-outside space-y-3 text-sm">
                                {['Todo lo incluido en el Plan Básico', '+ 2,500 facturas', 'Soporte por correo electrónico', 'Acceso para 2 usuarios', 'Acceso a plantillas básicas de facturas y notas', '1 reporte personalizado al mes', 'Actualizaciones mensuales del sistema'].map((item, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <Check className="size-3" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="font-medium">Para empresas</CardTitle>

                            <span className="my-3 block text-2xl font-semibold">$220 / mes</span>

                            <CardDescription className="text-sm"></CardDescription>

                            <Button asChild variant="outline" className="mt-4 w-full">
                                <Link href="">Comprar ahora</Link>
                            </Button>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <hr className="border-dashed" />

                            <ul className="list-outside space-y-3 text-sm">
                                {['Todas las funciones del Plan Profesional', '+ 3,000 facturas', '5GB Almacenamiento en la nube', 'Soporte por correo electrónico', 'Agente AI personalizado'].map((item, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <Check className="size-3" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
