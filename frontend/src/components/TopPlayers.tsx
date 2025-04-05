import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy } from "lucide-react";

interface TopPlayer {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  position: number;
}

function getTopPlayers(): TopPlayer[] {
  return [
    {
      id: "user1",
      name: "Alex Johnson",
      avatar: "",
      rating: 2850,
      position: 1,
    },
    {
      id: "user2",
      name: "Sam Wilson",
      avatar: "",
      rating: 2720,
      position: 2,
    },
    {
      id: "user3",
      name: "Taylor Smith",
      avatar: "",
      rating: 2695,
      position: 3,
    },
  ];
}

export function TopPlayers() {
  const players = getTopPlayers();

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
        return "text-yellow-500";
      case 2:
        return "text-gray-400";
      case 3:
        return "text-amber-700";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-4">
      {players.map((player) => (
        <div key={player.id} className="flex items-center gap-3">
          <div className={`font-bold ${getPositionColor(player.position)}`}>
            {player.position === 1 ? (
              <Trophy className="h-5 w-5" />
            ) : (
              <span>{player.position}</span>
            )}
          </div>
          <Avatar>
            <AvatarImage src={player.avatar} alt={player.name} />
            <AvatarFallback>
              {player.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{player.name}</p>
            <p className="text-sm text-muted-foreground">
              Rating: {player.rating}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
