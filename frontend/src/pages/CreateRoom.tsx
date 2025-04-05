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
import axios from "axios";

export default function CreateDebatePage() {
  //   const { toast } = useToast()
  const router = useNavigate();
  const [debateType, setDebateType] = useState<"user" | "ai">("user");
  const [isPublic, setIsPublic] = useState(true);
  const [aiDebateForm, setAiDebateForm] = useState({
    topic: "",
    visibility: "public",
    format_type: "quick",
    format_names: [""],
    duration: 2,
    participant_type: "ai",
    difficulty: "easy",
    ai_model: "Mistral-7b",
    position: "for",
    medium: "text",
  });

  const handleAIDebateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setAiDebateForm((prev) => ({
      ...prev,
      [id]: value,
      ...(id === "roundName" ? { format_names: [value] } : {}),
    }));
  };

  const handleAISelectChange = (name: string, value: string) => {
    setAiDebateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (debateType === "ai") {
      const formData = {
        ...aiDebateForm,
        visibility: isPublic ? "public" : "private",
      };
      console.log("AI Debate Form Data:", formData);

      const res = await axios.post("https://sample-debate-ai-production.up.railway.app/debate/", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      });
      console.log(res.data);
      if (res.status === 200) {
        router("/debate/" + res.data.data.round.id, { 
          state: { 
            debateData: res.data.data,
            formData: formData
          } 
        });
        return;
      }
    }
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
                    {/* <div className="flex items-center space-x-2">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard">Standard (4 rounds)</Label>
                    </div> */}
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="quick" id="quick" />
                      <Label htmlFor="quick">Quick (1 round)</Label>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="topic">Round Name</Label>
                      <Input
                        id="round_name"
                        placeholder="Enter a round name"
                        required
                      />
                    </div>
                    {/* <div className="flex items-center space-x-2">
                      <RadioGroupItem value="extended" id="extended" />
                      <Label htmlFor="extended">Extended (6 rounds)</Label>
                    </div> */}
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
                  <Label htmlFor="topic">Debate Topic</Label>
                  <Input
                    id="topic"
                    placeholder="Enter a topic for debate"
                    required
                    value={aiDebateForm.topic}
                    onChange={handleAIDebateChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Select AI Opponent</Label>
                  <AIAgentSelector
                    difficulty={aiDebateForm.difficulty}
                    selectAiAgent={(agent) =>
                      setAiDebateForm((prev) => ({
                        ...prev,
                        ai_model: agent.model,
                      }))
                    }
                    selectedDifficultyLevel={(difficulty) =>
                      setAiDebateForm((prev) => ({
                        ...prev,
                        difficulty,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Debate Format</Label>
                  <RadioGroup
                    value={aiDebateForm.format_type}
                    onValueChange={(value) =>
                      handleAISelectChange("format_type", value)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="quick" id="quick" />
                      <Label htmlFor="quick">Quick (1 round)</Label>
                    </div>
                  </RadioGroup>
                  <div className="space-y-2">
                    <Label htmlFor="roundName">Round Name</Label>
                    <Input
                      id="roundName"
                      placeholder="Enter a round name (e.g., opening_statements)"
                      required
                      value={aiDebateForm.format_names[0] || ""}
                      onChange={handleAIDebateChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Communication Medium</Label>
                  <Select
                    value={aiDebateForm.medium}
                    onValueChange={(value) =>
                      handleAISelectChange("medium", value)
                    }
                  >
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
                  <RadioGroup
                    value={aiDebateForm.position}
                    onValueChange={(value) =>
                      handleAISelectChange("position", value)
                    }
                  >
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
                  <Label>Debate Visibility</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="public"
                      checked={isPublic}
                      onCheckedChange={setIsPublic}
                    />
                    <Label htmlFor="public">
                      {isPublic ? "Public" : "Private"}
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Round Duration (minutes)</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setAiDebateForm((prev) => ({
                          ...prev,
                          duration: Math.max(1, prev.duration - 1),
                        }))
                      }
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      className="w-20 text-center"
                      min="1"
                      value={aiDebateForm.duration}
                      onChange={(e) =>
                        setAiDebateForm((prev) => ({
                          ...prev,
                          duration: parseInt(e.target.value) || 1,
                        }))
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setAiDebateForm((prev) => ({
                          ...prev,
                          duration: prev.duration + 1,
                        }))
                      }
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
