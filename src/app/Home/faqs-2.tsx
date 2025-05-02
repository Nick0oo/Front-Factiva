'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'

export default function FAQsTwo() {
    const faqItems = [
        {
            id: 'item-1',
            question: '¿Qué tipos de documentos puedo generar con Factiva?',
            answer: 'Factiva permite la generación y envío de facturas electrónicas completamente validadas por la DIAN en tiempo real, Además de otros documentos de soporte',
        },
        {
            id: 'item-2',
            question: '¿Qué métodos de pago acepta Factiva para las suscripciones?',
            answer: 'Aceptamos tarjetas de crédito, débito PSE, transferencias bancarias y pagos a través de plataformas como Nequi o Daviplata. También ofrecemos la opción de facturación para empresas aliadas.',
        },
        {
            id: 'item-3',
            question: '¿Puedo cambiar o cancelar mi plan?',
            answer: 'Sí. Puedes cambiar tu plan en cualquier momento desde la configuración de tu cuenta. Si decides cancelar, el servicio seguirá activo hasta finalizar el periodo ya pagado. No realizamos reembolsos por tiempo no utilizado.',
        },
        {
            id: 'item-4',
            question: '¿Factiva funciona fuera de Colombia?',
            answer: "Sí, puedes acceder a Factiva desde cualquier país. Sin embargo, nuestras funcionalidades están optimizadas para cumplir con la normativa fiscal colombiana, especialmente en lo referente a facturación electrónica y reportes para la DIAN.",
        },
        {
            id: 'item-5',
            question: '¿Cuál es la política de devolución o reembolso de la suscripción?',
            answer: 'Ofrecemos una garantía de satisfacción de 7 días, salvo no superes las 10 facturas dentro de esos días. Si dentro de ese periodo decides que Factiva no se ajusta a tus necesidades, puedes solicitar un reembolso total. Después de ese tiempo, no se realizan devoluciones.',
        },
    ]

    return (
        <section className="py-16 md:py-24">
            <div className="mx-auto max-w-5xl px-4 md:px-6">
                <div className="mx-auto max-w-xl text-center">
                    <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">Preguntas frecuentes</h2>
                    <p className="text-muted-foreground mt-4 text-balance">Descubre respuestas claras y completas a las preguntas más comunes sobre nuestra plataforma de facturación electrónica, servicios y funcionalidades.</p>
                </div>

                <div className="mx-auto mt-12 max-w-xl">
                    <Accordion
                        type="single"
                        collapsible
                        className="bg-card ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0">
                        {faqItems.map((item) => (
                            <AccordionItem
                                key={item.id}
                                value={item.id}
                                className="border-dashed">
                                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">{item.question}</AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-base">{item.answer}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    <p className="text-muted-foreground mt-6 px-8">
                        ¿Qué? ¿No encuentras los respuesta adecuada? Contacta nuestro{' '}
                        <Link
                            href="#"
                            className="text-primary font-medium hover:underline">
                            equipo de soporte
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}
