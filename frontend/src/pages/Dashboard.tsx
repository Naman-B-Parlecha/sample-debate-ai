import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PublicRoomsList } from "@/components/PublicRooms";
import { TopPlayers } from "@/components/TopPlayers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild onClick={() => navigate("/create-room")}>
          <div>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Debate
          </div>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="public" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="public">Public Rooms</TabsTrigger>
              <TabsTrigger value="my-debates">My Debates</TabsTrigger>
            </TabsList>
            <TabsContent value="public">
              <Card>
                <CardHeader>
                  <CardTitle>Public Debate Rooms</CardTitle>
                  <CardDescription>
                    Join ongoing public debates or create your own.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PublicRoomsList />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="my-debates">
              <Card>
                <CardHeader>
                  <CardTitle>My Debates</CardTitle>
                  <CardDescription>
                    Debates you've participated in or created.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PublicRoomsList userOnly={true} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Top Debaters</CardTitle>
              <CardDescription>
                The highest-rated debaters on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TopPlayers />
              <div className="mt-4">
                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/leaderboard")}
                >
                  <div>View Full Leaderboard</div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
