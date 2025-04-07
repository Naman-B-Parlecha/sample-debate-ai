"use client"

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
        model: "Mistral-7b",
        parameters: "7B",
        description: "A beginner-level AI debater suitable for practice and learning the basics.",
        difficulty: "easy",
      },
      {
        id: "ai2",
        name: "Conversational Assistant",
        model: "Llama-3.2",
        parameters: "3B",
        description: "Focuses on natural dialogue flow with basic argumentation skills.",
        difficulty: "easy",
      },
      // {
      //   id: "ai3",
      //   name: "Falcon Debater",
      //   model: "Falcon-7B",
      //   parameters: "7B",
      //   description: "A balanced debater with good general knowledge and reasoning abilities.",
      //   difficulty: "easy",
      // },
      {
        id: "ai4",
        name: "Mistral Reasoner",
        model: "Mistral-Small-3.1",
        parameters: "24B",
        description: "Specializes in logical reasoning and structured arguments.",
        difficulty: "medium",
      },
      {
        id: "ai5",
        name: "Mistral Arguer",
        model: "Mistral Nemo",
        parameters: "12B",
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
      // {
      //   id: "ai7",
      //   name: "Mixtral Master",
      //   model: "Mixtral 8x7B",
      //   parameters: "56B",
      //   description: "Uses a mixture of experts approach for sophisticated argumentation.",
      //   difficulty: "hard",
      // },
      {
        id: "ai8",
        name: "Llama Champion",
        model: "Llama-3.1-405B",
        parameters: "405B",
        description: "Elite debater with exceptional knowledge and rhetorical skills.",
        difficulty: "expert",
      },
      {
        id: "ai9",
        name: "DeepSeek Grandmaster",
        model: "DeepSeek R1",
        parameters: "631B",
        description: "The ultimate debate opponent with unparalleled reasoning and persuasion abilities.",
        difficulty: "expert",
      },
    ]
  }
  

export function AIAgentSelector({selectAiAgent,difficulty, selectedDifficultyLevel}: {selectAiAgent: (agent: AIAgent) => void,difficulty: string, selectedDifficultyLevel: (difficulty: string) => void}) {
  const aiAgents = getAIAgents()

  const filteredAgents = aiAgents.filter((agent) => agent.difficulty === difficulty)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={difficulty === "easy" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => selectedDifficultyLevel("easy")}
        >
          Easy
        </Badge>
        <Badge
          variant={difficulty === "medium" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => selectedDifficultyLevel("medium")}
        >
          Medium
        </Badge>
        <Badge
          variant={difficulty === "hard" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => selectedDifficultyLevel("hard")}
        >
          Hard
        </Badge>
        <Badge
          variant={difficulty === "expert" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => selectedDifficultyLevel("expert")}
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
                  <RadioGroupItem value={agent.id} id={agent.id} onClick={()=>selectAiAgent(agent)} />
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

