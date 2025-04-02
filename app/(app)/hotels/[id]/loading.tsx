"use client"

import React from 'react'

export default function Loading() {
    return (
        <>
            <div className="border-b">
                <div className="container flex h-16 items-center px-4">
                    <div className="flex items-center gap-2">
                        <div className="h-5 w-5 bg-muted rounded-full animate-pulse" />
                        <div className="h-4 w-20 bg-muted rounded-md animate-pulse" />
                    </div>
                </div>
            </div>

            <div className="container mx-auto py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Image Skeleton */}
                    <div className="h-[400px] w-full bg-muted rounded-lg animate-pulse" />

                    {/* Content Skeleton */}
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="h-8 w-3/4 bg-muted rounded-md animate-pulse" />
                            <div className="h-4 w-1/2 bg-muted rounded-md animate-pulse" />
                            <div className="h-4 w-1/3 bg-muted rounded-md animate-pulse" />
                        </div>

                        <div className="space-y-3">
                            <div className="h-6 w-1/4 bg-muted rounded-md animate-pulse" />
                            <div className="h-4 w-full bg-muted rounded-md animate-pulse" />
                            <div className="h-4 w-4/5 bg-muted rounded-md animate-pulse" />
                            <div className="h-4 w-3/4 bg-muted rounded-md animate-pulse" />
                        </div>

                        <div className="space-y-3">
                            <div className="h-6 w-1/4 bg-muted rounded-md animate-pulse" />
                            <div className="flex flex-wrap gap-2">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="h-6 w-16 bg-muted rounded-full animate-pulse" />
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t space-y-4">
                            <div className="h-8 w-1/4 bg-muted rounded-md animate-pulse" />
                            <div className="h-10 w-32 bg-muted rounded-md animate-pulse ml-auto" />
                        </div>
                    </div>

                    {/* Map Skeleton */}
                    <div className="col-span-full">
                        <div className="h-8 w-1/4 bg-muted rounded-md animate-pulse mb-4" />
                        <div className="h-[400px] w-full bg-muted rounded-lg animate-pulse" />
                    </div>
                </div>
            </div>
        </>
    )
}