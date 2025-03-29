"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
// import { useToast } from "@/components/ui/use-toast"
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIAgentSelector } from "@/components/ai-agent-selector";

export default function CreateDebatePage() {
  //   const { toast } = useToast()
  const router = useNavigate();
  const [debateType, setDebateType] = useState<"user" | "ai">("user");
  const [isPublic, setIsPublic] = useState(true);
  const [duration, setDuration] = useState(5); // Default 5 minutes
  //   const [debateDetails, setDebateDetails] = useState({})
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // toast({
    //   title: "Debate created",
    //   description: "Your debate room has been created successfully.",
    // })

    // Redirect to a dummy lobby
    console.log(debateType);
    router("/lobby/new-debate");
  };

  return (
    <div className="container py-6 px-4 mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create a Debate</h1>

      <Tabs
        defaultValue="user"
        onValueChange={(value) => setDebateType(value as "user" | "ai")}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="user">User vs User</TabsTrigger>
          <TabsTrigger value="ai">User vs AI</TabsTrigger>
        </TabsList>

        <TabsContent value="user">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>User vs User Debate</CardTitle>
                <CardDescription>
                  Create a debate room where you can debate with another user.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Debate Topic</Label>
                  <Input
                    id="topic"
                    placeholder="Enter a topic for debate"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide additional context for the debate"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Debate Format</Label>
                  <RadioGroup defaultValue="standard">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard">Standard (4 rounds)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="quick" id="quick" />
                      <Label htmlFor="quick">Quick (1 round)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="extended" id="extended" />
                      <Label htmlFor="extended">Extended (6 rounds)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Communication Medium</Label>
                  <Select defaultValue="text">
                    <SelectTrigger>
                      <SelectValue placeholder="Select medium" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="public"
                    checked={isPublic}
                    onCheckedChange={setIsPublic}
                  />
                  <Label htmlFor="public">Make debate public</Label>
                </div>
              </CardContent>
              <CardFooter className="mt-4">
                <Button type="submit">Create Debate Room</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>User vs AI Debate</CardTitle>
                <CardDescription>
                  Practice your debating skills against an AI opponent.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ai-topic">Debate Topic</Label>
                  <Input
                    id="ai-topic"
                    placeholder="Enter a topic for debate"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Select AI Opponent</Label>
                  <AIAgentSelector />
                </div>

                <div className="space-y-2">
                  <Label>Debate Format</Label>
                  <RadioGroup defaultValue="standard">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard">Standard (4 rounds)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="quick" id="quick" />
                      <Label htmlFor="quick">Quick (1 round)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="extended" id="extended" />
                      <Label htmlFor="extended">Extended (6 rounds)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Communication Medium</Label>
                  <Select defaultValue="text">
                    <SelectTrigger>
                      <SelectValue placeholder="Select medium" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Your Position</Label>
                  <RadioGroup defaultValue="for">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="for" id="for" />
                      <Label htmlFor="for">For</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="against" id="against" />
                      <Label htmlFor="against">Against</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>Round Duration (minutes)</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setDuration(Math.max(1, duration - 1))}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      className="w-20 text-center"
                      min="1"
                      value={duration}
                      onChange={(e) =>
                        setDuration(parseInt(e.target.value) || 1)
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setDuration(duration + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="mt-4">
                <Button type="submit">Start Practice Debate</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
