import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Check } from "lucide-react";

// Sample placement options
const placementOptions = [
  {
    id: 1,
    name: "Square",
    image: "/images/placements/square.png"
  },
  {
    id: 2,
    name: "Arm",
    image: "/images/placements/arm.png"
  },
  {
    id: 3,
    name: "Back",
    image: "/images/placements/back.png"
  },
  {
    id: 4,
    name: "Forearm",
    image: "/images/placements/forearm.png"
  },
  {
    id: 5,
    name: "Leg",
    image: "/images/placements/leg.png"
  },
  {
    id: 6,
    name: "Shoulder",
    image: "/images/placements/shoulder.png"
  }
];

type PlacementSelectorProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlacement: (placement: string) => void;
};

export function PlacementSelector({ isOpen, onClose, onSelectPlacement }: PlacementSelectorProps) {
  const [selectedPlacement, setSelectedPlacement] = useState<number | null>(null);

  const handlePlacementSelect = (placementId: number) => {
    setSelectedPlacement(placementId);
    const placement = placementOptions.find((p) => p.id === placementId);
    if (placement) {
      onSelectPlacement(placement.name);
      onClose();
    }
  };

  // Helper to display placement option
  const getPlacementImage = (placementOption: typeof placementOptions[0]) => {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="h-12 w-12 border border-gray-400 flex items-center justify-center">
          <span className="text-sm font-medium">{placementOption.name}</span>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
        <DialogHeader className="px-4 py-2 border-b">
          <DialogTitle className="text-base">BODY PART / PLACEMENT</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-0 max-h-[500px] overflow-y-auto p-1">
          {placementOptions.map((placement) => (
            <div
              key={placement.id}
              className="p-1 cursor-pointer"
              onClick={() => handlePlacementSelect(placement.id)}
            >
              <div className="relative border rounded-md overflow-hidden hover:border-purple-400 transition-all h-full">
                <div className="aspect-square relative overflow-hidden">
                  {getPlacementImage(placement)}
                  {selectedPlacement === placement.id && (
                    <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                      <div className="bg-purple-600 rounded-full p-1">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-2 text-center">
                  <p className="text-sm font-medium">{placement.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
} 