import Image from 'next/image';

export default function ContentSection() {
    return (
        <section className="py-16 md:py-5 text-white">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
                <h1 className="relative z-10 max-w-xl text-5xl font-medium lg:text-6xl text-left">
                    The Lyra ecosystem brings together our models.
                </h1>
                <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
                    <div className="relative mb-6 sm:mb-0">
                        <div className="bg-linear-to-b aspect-76/59 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
                            <Image
                                src="/payments.png"
                                className="hidden rounded-[15px] dark:block"
                                alt="payments illustration dark"
                                width={1207}
                                height={929}
                            />
                            <Image
                                src="/payments-light.png"
                                className="rounded-[15px] shadow dark:hidden"
                                alt="payments illustration light"
                                width={1207}
                                height={929}
                            />
                        </div>
                    </div>

                    <div className="relative space-y-4 text-left text-lg">
                        <p className="text-white-foreground">
                            Gemini is evolving to be more than just the models.{' '}
                            <span className="text-accent-white-foreground font-bold">
                                It supports an entire ecosystem
                            </span>{' '}
                            — from products innovate.
                        </p>
                        <p className="text-white-foreground">
                            It supports an entire ecosystem — from products to the APIs and platforms helping developers and businesses innovate.
                        </p>

                        <div className="pt-6">
                            <blockquote className="border-l-4 pl-4 text-left">
                                <p>
                                    Using TailsUI has been like unlocking a secret design superpower. Its the perfect fusion of simplicity and versatility, enabling us to create UIs that are as stunning as they are user-friendly.
                                </p>

                                <div className="mt-6 space-y-3">
                                    <cite className="block font-medium">John Doe, CEO</cite>
                                    <Image
                                        className="h-5 w-fit bg-white"
                                        src="https://html.tailus.io/blocks/customers/nvidia.svg"
                                        alt="Nvidia Logo"
                                        width={20}
                                        height={20}
                                    />
                                </div>
                            </blockquote>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
