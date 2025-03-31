"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Brain, Mic, MicOff, Send, User } from "lucide-react";
// import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation } from "react-router-dom";

export default function DebateRoomPage() {
  const location = useLocation();

  const debateDetails = location.state?.debateData;
  const formData = location.state?.formData;

  console.log("Debate Details:", debateDetails);
  console.log("Form Data:", formData);
  const [message, setMessage] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(72); // 1:12 in seconds
  const [userMicEnabled, setUserMicEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Countdown timer
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeRemaining]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[56rem] bg-gray-50">
      <div className="flex flex-1 h-full w-full">
        <div className="w-1/4 border-r bg-white p-4 flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-1">Topic</h2>
            <p className="text-sm text-muted-foreground">
              Should animal testing be banned?
            </p>
            <p className="text-sm font-medium mt-2">
              Time Remaining:{" "}
              <span className="text-primary">
                {formatTime(timeRemaining)}min
              </span>
            </p>
          </div>

          <div className="space-y-6">
            <Card className="p-4 pb-16">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="font-medium">Participant 1</h3>
                  <p className="text-xs text-muted-foreground">Falcon - 7b</p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => setUserMicEnabled(!userMicEnabled)}
                >
                  {userMicEnabled ? (
                    <Mic className="h-4 w-4 text-primary" />
                  ) : (
                    <MicOff className="h-4 w-4 text-destructive" />
                  )}
                </Button>
              </div>
              <div className="flex justify-center">
                <div className="rounded-full bg-gray-100 h-16 w-16 flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
              </div>
            </Card>

            <Card className="p-4 pb-16">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="font-medium">AI</h3>
                  <p className="text-xs text-muted-foreground">
                    Debate Assistant
                  </p>
                </div>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  {userMicEnabled ? (
                    <MicOff className="h-4 w-4 text-destructive" />
                  ) : (
                    <Mic className="h-4 w-4 text-primary" />
                  )}
                </Button>
              </div>
              <div className="flex justify-center">
                <div className="rounded-full bg-gray-100 h-16 w-16 flex items-center justify-center">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-gray-50">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              <div className="flex flex-col items-end">
                <span className="text-xs font-medium text-muted-foreground mb-1">
                  User argument
                </span>
                <Card className="bg-primary text-primary-foreground p-4 max-w-3/4">
                  <p>
                    Animal testing causes unnecessary suffering to animals and
                    there are now many alternatives available that don't require
                    animal subjects. We should prioritize these humane
                    alternatives.
                  </p>
                </Card>
              </div>

              <div className="flex flex-col items-start">
                <span className="text-xs font-medium text-muted-foreground mb-1">
                  AI argument
                </span>
                <Card className="bg-white p-4 max-w-3/4">
                  <p>
                    While animal welfare is important, many medical and
                    scientific advances that save human lives have relied on
                    animal testing. Complete elimination could slow critical
                    research in areas like cancer and infectious diseases.
                  </p>
                </Card>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-xs font-medium text-muted-foreground mb-1">
                  User argument
                </span>
                <Card className="bg-primary text-primary-foreground p-4 max-w-3/4">
                  <p>
                    Big para argument from user. The use of animals in testing
                    is not only cruel but often ineffective. Many drugs that
                    pass animal tests fail in human trials, showing that animal
                    models don't accurately predict human responses. Modern
                    alternatives like organ-on-a-chip technology and computer
                    modeling provide more accurate, humane, and cost-effective
                    solutions.
                  </p>
                </Card>
              </div>

              <div className="flex flex-col items-start">
                <span className="text-xs font-medium text-muted-foreground mb-1">
                  AI argument
                </span>
                <Card className="bg-white p-4 max-w-3/4">
                  <p>
                    Big para argument from AI. While alternatives are promising,
                    they haven't yet replaced all animal testing needs. Complex
                    biological systems like immune responses and neurological
                    functions still require whole-animal models. A phased
                    approach that gradually replaces animal testing as
                    alternatives become validated would be more practical than
                    an immediate ban, ensuring both scientific progress and
                    animal welfare.
                  </p>
                </Card>
              </div>

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="border-t bg-white p-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Enter your Argument here"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button size="icon" onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
