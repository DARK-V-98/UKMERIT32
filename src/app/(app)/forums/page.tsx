import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { forums } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"

export default function ForumsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Forums</h1>
        <p className="text-muted-foreground">
          Ask questions, share your knowledge, and connect with other learners.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Browse through different topics of discussion.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Topic</TableHead>
                <TableHead className="hidden md:table-cell">Threads</TableHead>
                <TableHead className="hidden md:table-cell">Posts</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forums.map((forum) => (
                <TableRow key={forum.id}>
                  <TableCell>
                    <div className="font-medium">{forum.title}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {forum.description}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{forum.threads}</TableCell>
                  <TableCell className="hidden md:table-cell">{forum.posts}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/forums/${forum.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
