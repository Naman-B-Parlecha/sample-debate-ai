"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export interface AIAgent {
    id: string
    name: string
    model: string
    parameters: string
    description: string
    difficulty: "easy" | "medium" | "hard" | "expert"
  }

function getAIAgents(): AIAgent[] {
    return [
      {
        id: "ai1",
        name: "Novice Debater",
        model: "DialoGPT-small",
        parameters: "345M",
        description: "A beginner-level AI debater suitable for practice and learning the basics.",
        difficulty: "easy",
      },
      {
        id: "ai2",
        name: "Conversational Assistant",
        model: "BlenderBot-90M",
        parameters: "90M",
        description: "Focuses on natural dialogue flow with basic argumentation skills.",
        difficulty: "easy",
      },
      {
        id: "ai3",
        name: "Falcon Debater",
        model: "Falcon-7B",
        parameters: "7B",
        description: "A balanced debater with good general knowledge and reasoning abilities.",
        difficulty: "easy",
      },
      {
        id: "ai4",
        name: "Llama Reasoner",
        model: "Llama-2 13B",
        parameters: "13B",
        description: "Specializes in logical reasoning and structured arguments.",
        difficulty: "medium",
      },
      {
        id: "ai5",
        name: "Mistral Arguer",
        model: "Mistral 7B",
        parameters: "7B",
        description: "Excellent at counterarguments and identifying logical fallacies.",
        difficulty: "medium",
      },
      {
        id: "ai6",
        name: "Advanced Llama",
        model: "Llama 3.3",
        parameters: "70B",
        description: "High-level debater with strong persuasive skills and evidence citation.",
        difficulty: "hard",
      },
      {
        id: "ai7",
        name: "Falcon Expert",
        model: "Falcon-40B",
        parameters: "40B",
        description: "Specializes in complex topics with nuanced understanding of multiple perspectives.",
        difficulty: "hard",
      },
      {
        id: "ai8",
        name: "Mixtral Master",
        model: "Mixtral 8x7B",
        parameters: "56B",
        description: "Uses a mixture of experts approach for sophisticated argumentation.",
        difficulty: "hard",
      },
      {
        id: "ai9",
        name: "BLOOM Champion",
        model: "BigScience-BLOOM",
        parameters: "176B",
        description: "Elite debater with exceptional knowledge and rhetorical skills.",
        difficulty: "expert",
      },
      {
        id: "ai10",
        name: "DeepSeek Grandmaster",
        model: "DeepSeek R1",
        parameters: "631B",
        description: "The ultimate debate opponent with unparalleled reasoning and persuasion abilities.",
        difficulty: "expert",
      },
    ]
  }
  

export function AIAgentSelector() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("medium")
  const aiAgents = getAIAgents()

  const filteredAgents = aiAgents.filter((agent) => agent.difficulty === selectedDifficulty)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={selectedDifficulty === "easy" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setSelectedDifficulty("easy")}
        >
          Easy
        </Badge>
        <Badge
          variant={selectedDifficulty === "medium" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setSelectedDifficulty("medium")}
        >
          Medium
        </Badge>
        <Badge
          variant={selectedDifficulty === "hard" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setSelectedDifficulty("hard")}
        >
          Hard
        </Badge>
        <Badge
          variant={selectedDifficulty === "expert" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setSelectedDifficulty("expert")}
        >
          Expert
        </Badge>
      </div>

      <RadioGroup defaultValue={filteredAgents[0]?.id}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAgents.map((agent) => (
            <Card key={agent.id} className="overflow-hidden">
              <div className="flex">
                <div className="p-4 flex items-center">
                  <RadioGroupItem value={agent.id} id={agent.id} />
                </div>
                <CardContent className="p-4 pl-0">
                  <Label htmlFor={agent.id} className="font-medium cursor-pointer">
                    {agent.name}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">{agent.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {agent.model}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {agent.parameters} parameters
                    </Badge>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
}

