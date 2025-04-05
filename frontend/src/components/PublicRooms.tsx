"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, Video, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface DebateRoom {
  id: string;
  topic: string;
  participants: number;
  maxParticipants: number;
  status: "waiting" | "ongoing" | "completed";
  format: string;
  medium: "text" | "audio" | "video";
  createdAt: Date;
}

function getPublicRooms(): DebateRoom[] {
  return [
    // {
    //   id: "1",
    //   topic: "Should artificial intelligence be regulated?",
    //   participants: 1,
    //   maxParticipants: 2,
    //   status: "waiting",
    //   format: "Standard (4 rounds)",
    //   medium: "video",
    //   createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    // },
    // {
    //   id: "2",
    //   topic: "Is social media beneficial for society?",
    //   participants: 2,
    //   maxParticipants: 2,
    //   status: "ongoing",
    //   format: "Quick (2 rounds)",
    //   medium: "text",
    //   createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    // },
    // {
    //   id: "3",
    //   topic: "Should college education be free?",
    //   participants: 0,
    //   maxParticipants: 2,
    //   status: "waiting",
    //   format: "Standard (4 rounds)",
    //   medium: "audio",
    //   createdAt: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    // },
    // {
    //   id: "4",
    //   topic: "Is remote work the future of employment?",
    //   participants: 1,
    //   maxParticipants: 2,
    //   status: "waiting",
    //   format: "Extended (6 rounds)",
    //   medium: "video",
    //   createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    // },
    // {
    //   id: "5",
    //   topic: "Should cryptocurrencies be more regulated?",
    //   participants: 2,
    //   maxParticipants: 2,
    //   status: "completed",
    //   format: "Standard (4 rounds)",
    //   medium: "text",
    //   createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    // },
  ];
}

// Dummy data for user's rooms
function getUserRooms(): DebateRoom[] {
  return [
    // {
    //   id: "6",
    //   topic: "Is universal basic income a viable economic policy?",
    //   participants: 1,
    //   maxParticipants: 2,
    //   status: "waiting",
    //   format: "Standard (4 rounds)",
    //   medium: "text",
    //   createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    // },
    // {
    //   id: "7",
    //   topic: "Should voting be mandatory?",
    //   participants: 2,
    //   maxParticipants: 2,
    //   status: "completed",
    //   format: "Quick (2 rounds)",
    //   medium: "audio",
    //   createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    // },
  ];
}
interface PublicRoomsListProps {
  userOnly?: boolean;
}

export function PublicRoomsList({ userOnly = false }: PublicRoomsListProps) {
  const rooms = userOnly ? getUserRooms() : getPublicRooms();
  const navigate = useNavigate();
  if (rooms.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No debates found.</p>
        <Button
          asChild
          className="mt-4"
          onClick={() => navigate("/create-debate")}
        >
          Create a Debate
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rooms.map((room) => (
        <Card key={room.id} className="p-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium">{room.topic}</h3>
                <Badge
                  variant={
                    room.status === "waiting"
                      ? "outline"
                      : room.status === "ongoing"
                      ? "default"
                      : "secondary"
                  }
                  className="text-xs"
                >
                  {room.status === "waiting"
                    ? "Waiting"
                    : room.status === "ongoing"
                    ? "In Progress"
                    : "Completed"}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>
                    {room.participants}/{room.maxParticipants}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{room.format}</span>
                </div>
                <div className="flex items-center">
                  {room.medium === "text" ? (
                    <MessageSquare className="h-4 w-4 mr-1" />
                  ) : (
                    <Video className="h-4 w-4 mr-1" />
                  )}
                  <span>{room.medium}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <Button
                asChild
                variant={room.status === "waiting" ? "default" : "outline"}
                disabled={room.status === "completed"}
                className={cn(
                  "w-full md:w-auto",
                  room.status === "completed" && "opacity-50"
                )}
                onClick={() => {
                  navigate(`/lobby/${room.id}`);
                }}
              >
                {room.status === "waiting"
                  ? "Join"
                  : room.status === "ongoing"
                  ? "Spectate"
                  : "View Results"}
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
