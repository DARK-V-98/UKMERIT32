
"use client"

import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from '@/lib/firebase';
import type { Review } from '@/lib/types';
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';

export function ReviewsSection() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const reviewsData: Review[] = [];
            querySnapshot.forEach((doc) => {
                reviewsData.push({ id: doc.id, ...doc.data() } as Review);
            });
            setReviews(reviewsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    );

    const getImageUrl = (imageFilename?: string) => {
        if (!imageFilename) return "";
        return `/${imageFilename}.png`;
    }

    if (loading) {
        return (
            <section className="container mx-auto px-4 py-16 sm:py-24">
                <div className="text-center mb-12">
                    <Skeleton className="h-10 w-64 mx-auto" />
                    <Skeleton className="h-6 w-96 mx-auto mt-4" />
                </div>
                <div className="flex justify-center">
                    <Skeleton className="h-64 w-full max-w-2xl" />
                </div>
            </section>
        )
    }

    if (reviews.length === 0) {
        return null; // Don't render the section if there are no reviews
    }

    return (
        <section className="bg-muted py-16 sm:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                        What Our Students Say
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                        Hear from learners who have transformed their skills with us.
                    </p>
                </div>
                <Carousel
                    plugins={[plugin.current]}
                    className="w-full max-w-4xl mx-auto"
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                >
                    <CarouselContent>
                        {reviews.map((review) => (
                            <CarouselItem key={review.id}>
                                <div className="p-1">
                                    <Card>
                                        <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-6">
                                            <Avatar className="h-20 w-20">
                                                <AvatarImage src={getImageUrl(review.imageFilename)} alt={review.name} />
                                                <AvatarFallback>{review.name?.[0] || 'R'}</AvatarFallback>
                                            </Avatar>
                                            <blockquote className="text-lg font-medium leading-relaxed text-foreground">
                                                "{review.review}"
                                            </blockquote>
                                            <cite className="text-base font-semibold text-muted-foreground not-italic">
                                                - {review.name}
                                            </cite>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </section>
    )
}
