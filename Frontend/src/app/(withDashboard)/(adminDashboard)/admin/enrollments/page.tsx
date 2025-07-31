"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useEnrollments, useUpdateEnrollment } from "@/hooks/courses.hook";

export default function EnrollmentManagementPage() {
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [selectedEnrollment, setSelectedEnrollment] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const { data: enrollments = [], isLoading } = useEnrollments(selectedStatus);

  const updateEnrollmentMutation = useUpdateEnrollment()

  const handleApprove = (enrollmentId: string) => {
    updateEnrollmentMutation.mutate({
      enrollmentId,
      status: "approved",
    });
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) return;

    updateEnrollmentMutation.mutate({
      enrollmentId: selectedEnrollment._id,
      status: "rejected",
      rejectionReason,
    });
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6 py-6">
        <div>
          <h1 className="text-3xl font-bold">Enrollment Management</h1>
          <p className="text-muted-foreground">
            Manage course enrollment requests
          </p>
        </div>

        <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedStatus} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedStatus.charAt(0).toUpperCase() +
                    selectedStatus.slice(1)}{" "}
                  Enrollments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div>Loading...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrollments.map((enrollment: any) => (
                        <TableRow key={enrollment._id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {enrollment.studentName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {enrollment.studentEmail}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {enrollment.courseId.title}
                              </p>
                              <Badge variant="outline">
                                {enrollment.courseId.courseCategory}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p>৳{enrollment.amount}</p>
                              {enrollment.paymentMethod && (
                                <p className="text-sm text-muted-foreground">
                                  {enrollment.paymentMethod} -{" "}
                                  {enrollment.transactionId}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(
                              enrollment.enrollmentDate
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {selectedStatus === "pending" && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(enrollment._id)}
                                  disabled={updateEnrollmentMutation.isPending}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    setSelectedEnrollment(enrollment)
                                  }
                                  disabled={updateEnrollmentMutation.isPending}
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Rejection Modal */}
        <Dialog
          open={!!selectedEnrollment}
          onOpenChange={() => setSelectedEnrollment(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Enrollment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>Please provide a reason for rejecting this enrollment:</p>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason..."
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedEnrollment(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={
                    !rejectionReason.trim() ||
                    updateEnrollmentMutation.isPending
                  }
                >
                  Reject Enrollment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}