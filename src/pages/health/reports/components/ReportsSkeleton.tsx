import { Skeleton } from "@/components/ui/skeleton"

export const ReportsSkeleton = () => {
    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            <section>
                <div className="flex items-center justify-between mb-6">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-10 w-[180px] rounded-md" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
                            <div className="flex items-center space-x-3">
                                <Skeleton className="h-9 w-9 rounded-lg" />
                                <Skeleton className="h-5 w-40" />
                            </div>
                            <Skeleton className="h-4 w-52" />
                            <Skeleton className="h-9 w-full rounded-md" />
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-6">
                <Skeleton className="h-8 w-64" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-3">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-8 w-20" />
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
                            <Skeleton className="h-5 w-44" />
                            <Skeleton className="h-4 w-64" />
                            <Skeleton className="h-[300px] w-full rounded-md" />
                        </div>
                    ))}
                </div>

                <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-64" />
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-14 w-full rounded-lg" />
                    ))}
                </div>
            </section>
        </div>
    )
}
