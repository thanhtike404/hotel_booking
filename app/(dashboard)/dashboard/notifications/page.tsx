"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {useNotifications} from "@/hooks/dashboard/useNotifications";
import { BellRing, Check } from "lucide-react";



export default function Page() {
    const { data: notifications = [], isLoading } = useNotifications();
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>

      <div className="grid gap-4">
        {notifications.map((notification, index) => (
          <Card key={index} className="flex items-start p-4">
            <BellRing className="mt-1 mr-4 h-6 w-6 text-blue-500" />
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold">{notification.message}</CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                {/* {notification.description} */}
              </CardDescription>
              <p className="text-sm text-gray-500 mt-2">  {new Date(notification.createdAt).toLocaleDateString()}</p>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto">
                {notification.isRead ? (
                    <Check className="h-5 w-5 text-green-500" />
                ) : (
                    <Check className="h-5 w-5 text-gray-500" />
                )}
            </Button>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button variant="outline">Load More</Button>
      </div>
    </div>
  );
}
