"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ODForm from "@/components/form/ODForm";
import ODInput from "@/components/form/ODInput";
import ODSelect from "@/components/form/ODSelect";
import { Copy, Check, CreditCard, Smartphone, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEnrollCourse } from "@/hooks/courses.hook";

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: any;
  user: any;
}

const paymentMethods = [
  {
    id: "bkash",
    name: "bKash",
    icon: <Smartphone className="h-5 w-5" />,
    number: "01789683640",
    type: "Personal",
    color: "bg-pink-500",
  },
  {
    id: "nagad",
    name: "Nagad",
    icon: <CreditCard className="h-5 w-5" />,
    number: "01789683640",
    type: "Personal",
    color: "bg-orange-500",
  },
  {
    id: "rocket",
    name: "Rocket",
    icon: <Wallet className="h-5 w-5" />,
    number: "01789683640",
    type: "Personal",
    color: "bg-purple-500",
  },
];

export default function EnrollmentModal({
  isOpen,
  onClose,
  course,
  user,
}: EnrollmentModalProps) {
  const [selectedPayment, setSelectedPayment] = useState("bkash");
  const [copiedNumber, setCopiedNumber] = useState("");
  const [defaultValues, setDefaultValues] = useState({});
  const { toast } = useToast();
  const { mutate: enrollCourse, isPending } = useEnrollCourse();

  // Set default values when modal opens or user changes
  useEffect(() => {
    if (user && isOpen) {
      const defaults = {
        studentName: user.name || "",
        studentEmail: user.email || "",
        studentPhone: (user as any).mobileNumber || (user as any).phone || "",
        paymentMethod: selectedPayment,
      };
      setDefaultValues(defaults);
    }
  }, [user, isOpen, selectedPayment]);

  const copyToClipboard = async (number: string, method: string) => {
    try {
      await navigator.clipboard.writeText(number);
      setCopiedNumber(number);
      toast({
        title: "Copied!",
        description: `${method} number copied to clipboard`,
      });
      setTimeout(() => setCopiedNumber(""), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy number",
        variant: "destructive",
      });
    }
  };

  const paymentMethodOptions = [
    { value: "bkash", label: "bKash" },
    { value: "nagad", label: "Nagad" },
    { value: "rocket", label: "Rocket" },
  ];

  const onSubmit = (data: any) => {
    const enrollmentData = {
      courseId: course._id,
      paymentMethod: data.paymentMethod,
      transactionId: data.transactionId,
      paymentNumber: data.paymentNumber,
      studentName: data.studentName,
      studentEmail: data.studentEmail,
      studentPhone: data.studentPhone,
      amount:
        course.courseType === "free" ? 0 : course.salePrice || course.price,
    };

    enrollCourse(enrollmentData, {
      onSuccess: () => {
        toast({
          title: "Enrollment Submitted!",
          description:
            "Your enrollment request has been submitted. Please wait for admin approval.",
        });
        onClose();
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "Failed to submit enrollment",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Enroll in Course</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Welcome */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {user.name?.charAt(0) || "U"}
                  </span>
                </div>
                <div>
                  <p className="font-medium">Welcome, {user.name}!</p>
                  <p className="text-sm text-blue-600">
                    We&apos;ve pre-filled your information below
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Badge variant="outline">{course.courseCategory}</Badge>
                <div className="text-2xl font-bold">
                  {course.courseType === "free"
                    ? "Free"
                    : `৳${course.salePrice || course.price}`}
                </div>
              </div>
            </CardContent>
          </Card>

          {course.courseType !== "free" && (
            <Tabs value={selectedPayment} onValueChange={setSelectedPayment}>
              <TabsList className="grid grid-cols-3 w-full">
                {paymentMethods.map((method) => (
                  <TabsTrigger
                    key={method.id}
                    value={method.id}
                    className="flex items-center gap-2"
                  >
                    {method.icon}
                    {method.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {paymentMethods.map((method) => (
                <TabsContent key={method.id} value={method.id}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div
                          className={`p-2 rounded-lg ${method.color} text-white`}
                        >
                          {method.icon}
                        </div>
                        Pay with {method.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">
                          Send money to this number:
                        </p>
                        <div className="flex items-center justify-between bg-white p-3 rounded border">
                          <span className="font-mono text-lg font-semibold">
                            {method.number}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(method.number, method.name)
                            }
                            className="ml-2"
                          >
                            {copiedNumber === method.number ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Account Type: {method.type}
                        </p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">
                          Payment Instructions:
                        </h4>
                        <ol className="text-sm text-blue-700 space-y-1">
                          <li>
                            1. Send exact amount: ৳
                            {course.salePrice || course.price}
                          </li>
                          <li>2. Copy the transaction ID after payment</li>
                          <li>3. Fill the form below with your details</li>
                          <li>
                            4. Wait for admin approval (usually within 24 hours)
                          </li>
                        </ol>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          )}

          {/* Enrollment Form */}
          <Card>
            <CardHeader>
              <CardTitle>Enrollment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ODForm onSubmit={onSubmit} defaultValues={defaultValues}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ODInput
                    name="studentName"
                    label="Full Name"
                    placeholder="Enter your full name"
                    required
                  />

                  <ODInput
                    name="studentEmail"
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    required
                  />

                  <ODInput
                    name="studentPhone"
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    required
                  />

                  {course.courseType !== "free" && (
                    <>
                      <ODSelect
                        name="paymentMethod"
                        label="Payment Method"
                        options={paymentMethodOptions}
                        required
                      />

                      <ODInput
                        name="transactionId"
                        label="Transaction ID"
                        placeholder="Enter transaction ID from SMS"
                        required
                      />

                      <ODInput
                        name="paymentNumber"
                        label="Your Payment Number"
                        placeholder="Number you paid from"
                        required
                      />
                    </>
                  )}
                </div>

                <div className="flex gap-4 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending} className="flex-1">
                    {isPending ? "Submitting..." : "Submit Enrollment"}
                  </Button>
                </div>
              </ODForm>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}