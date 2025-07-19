
"use client"

import { useState, useEffect } from "react";
import { collection, onSnapshot, query, doc, deleteDoc, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ReviewForm } from "@/components/admin/review-form";
import type { Review } from "@/lib/types";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ManageReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const { toast } = useToast();

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

  const handleAddNew = () => {
    setEditingReview(null);
    setIsFormOpen(true);
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setIsFormOpen(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!reviewId) return;

    try {
      await deleteDoc(doc(db, "reviews", reviewId));
      toast({
        title: "Success",
        description: "Review has been deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Error Deleting Review",
        description: `An error occurred: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const getImageUrl = (imageFilename?: string) => {
    if (!imageFilename) return "";
    return `/${imageFilename}.png`;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Reviews</h1>
          <p className="text-muted-foreground">
            Add, edit, and manage user reviews for the homepage.
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Review
        </Button>
      </div>

      <ReviewForm
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        review={editingReview || undefined}
        onClose={() => setEditingReview(null)}
      />

      <Card>
        <CardHeader>
          <CardTitle>Existing Reviews</CardTitle>
          <CardDescription>A list of all reviews for the homepage.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reviewer</TableHead>
                  <TableHead className="hidden md:table-cell">Review</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={getImageUrl(review.imageFilename)} alt={review.name} />
                          <AvatarFallback>{review.name?.[0] || 'R'}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{review.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-sm truncate">{review.review}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(review)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the review from
                              <span className="font-bold"> {review.name}</span>.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteReview(review.id)}>
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
           {reviews.length === 0 && !loading && (
              <div className="text-center text-muted-foreground py-8">
                  No reviews have been added yet.
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
