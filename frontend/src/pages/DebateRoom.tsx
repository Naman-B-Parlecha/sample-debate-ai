"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Brain, Mic, MicOff, Send, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation, useNavigate } from "react-router-dom";
import { DebateScoreModal } from "@/components/ScoreModal";
import axios from "axios";

interface Message {
  id: string;
  user: "user" | "ai";
  argument: string;
  timestamp: Date;
}

export default function DebateRoomPage() {
  const location = useLocation();
  const debateDetails = location.state?.debateData;
  const formData = location.state?.formData;
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    console.log("Debate Details:", debateDetails);
    console.log("Form Data:", formData);
  }, []);

  const [messages, setMessages] = useState<Message[]>([
    // {
    //   id: "1",
    //   sender: "user",
    //   content:
    //     "Animal testing causes unnecessary suffering to animals and there are now many alternatives available that don't require animal subjects. We should prioritize these humane alternatives.",
    //   timestamp: new Date(Date.now() - 60000),
    // },
    // {
    //   id: "2",
    //   sender: "ai",
    //   content:
    //     "While animal welfare is important, many medical and scientific advances that save human lives have relied on animal testing. Complete elimination could slow critical research in areas like cancer and infectious diseases.",
    //   timestamp: new Date(Date.now() - 30000),
    // },
  ]);
  const [message, setMessage] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(
    formData?.duration * 60 || 10
  );
  const [userMicEnabled, setUserMicEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      setTimeRemaining(0);
      setIsOpen(true);
    }
  }, [timeRemaining]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        user: "user",
        argument: message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setMessage("");

      const res = await axios.post(
        "http://localhost:1313/arguments/",
        {
          topic: debateDetails?.topic,
          ai_model: formData?.ai_model,
          arguments: [...messages],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(res.data);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        user: "ai",
        argument: res.data["data"].arguments,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
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
      <DebateScoreModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);

          navigate("/");
        }}
      />
      <div className="flex flex-1 h-full w-full">
        <div className="w-1/4 border-r bg-white p-4 flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-1">Topic</h2>
            <p className="text-sm text-muted-foreground">
              {debateDetails?.topic || "Should animal testing be banned?"}
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
                  <p className="text-xs text-muted-foreground">
                    {formData?.username || "You"}
                  </p>
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
                  <h3 className="font-medium">{formData.ai_model}</h3>
                  <p className="text-xs text-muted-foreground">
                    {"Debate Assistant"}
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
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.user === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <span className="text-xs font-medium text-muted-foreground mb-1">
                    {msg.user === "user"
                      ? formData?.username || "You"
                      : formData?.ai_model}
                  </span>
                  <Card
                    className={`p-4 max-w-3/4 ${
                      msg.user === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-white"
                    }`}
                  >
                    <p>{msg.argument}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </Card>
                </div>
              ))}
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
