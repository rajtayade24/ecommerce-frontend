import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Trash2, Filter } from "lucide-react";
import { toast } from "Sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";

import { formatDate } from "@/utils/formatDate";
import {
  deleteFeedback,
  getAllFeedback,
  updateFeedbackStatus,
} from "@/service/adminService";

export default function ManageFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);

  // pagination
  const [page, setPage] = useState(0);
  const [size] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("createdAt,desc");

  // filters
  const [rating, setRating] = useState("ALL");

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const data = await getAllFeedback({
        page,
        size,
        sort,
        rating: rating === "ALL" ? null : rating,
      });

      setFeedbacks(data.content);
      setTotalPages(data.totalPages);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [page, sort]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateFeedbackStatus(id, status);
      toast.success(`Feedback ${status.toLowerCase()}`);
      fetchFeedbacks();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFeedback(id);
      toast.success("Feedback deleted");
      fetchFeedbacks();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">Feedback Management</h1>
        <p className="text-sm text-muted-foreground">
          Review, approve or remove customer feedback
        </p>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end">
        <Select value={rating} onValueChange={setRating}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All ratings</SelectItem>
            {[5, 4, 3, 2, 1].map((r) => (
              <SelectItem key={r} value={String(r)}>
                {r} stars
              </SelectItem>
            ))}
          </SelectContent>
        </Select>


        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt,desc">Newest</SelectItem>
            <SelectItem value="createdAt,asc">Oldest</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={() => { setPage(0); fetchFeedbacks(); }}>
          <Filter className="mr-2 h-4 w-4" />
          Apply
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="text-center">Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <AnimatePresence>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    Loading feedbacks…
                  </TableCell>
                </TableRow>
              ) : feedbacks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    No feedback found
                  </TableCell>
                </TableRow>
              ) : (
                feedbacks.map((f) => (
                  <motion.tr
                    key={f.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <TableCell>{f.id}</TableCell>
                    <TableCell>{f.userId}</TableCell>
                    <TableCell className="max-w-[240px] truncate">
                      {f.title}
                    </TableCell>
                    <TableCell className="text-center">{f.rating}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{f.status}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(f.createdAt)}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleStatusUpdate(f.id, "APPROVED")}
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleStatusUpdate(f.id, "REJECTED")}
                      >
                        <X className="h-4 w-4 text-yellow-600" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(f.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Page {page + 1} of {totalPages}
        </span>
        <div className="space-x-2">
          <Button
            variant="outline"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>
          <Button
            variant="outline"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );


  
}



















