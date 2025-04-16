import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { tattooStyles } from "../data/tattoo-styles";
import Image from "next/image";
import { useState } from "react";
import { Check } from "lucide-react";

// Define TattooStyle interface
interface TattooStyle {
  id: number;
  name: string;
  image: string;
  description: string;
}

type StyleSelectorProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectStyle: (style: TattooStyle) => void;
};

export function StyleSelector({ isOpen, onClose, onSelectStyle }: StyleSelectorProps) {
  const [selectedStyle, setSelectedStyle] = useState<number | null>(null);

  const handleStyleSelect = (styleId: number) => {
    setSelectedStyle(styleId);
    const style = tattooStyles.find((style) => style.id === styleId);
    if (style) {
      onSelectStyle(style);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
        <DialogHeader className="px-4 py-2 border-b">
          <DialogTitle className="text-base">COMMON STYLES</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-0 max-h-[500px] overflow-y-auto p-1">
          {tattooStyles.map((style) => (
            <div
              key={style.id}
              className="p-1 cursor-pointer"
              onClick={() => handleStyleSelect(style.id)}
            >
              <div className="relative border rounded-md overflow-hidden hover:border-gray-400 transition-all h-full">
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={style.image}
                    alt={style.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  {selectedStyle === style.id && (
                    <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                      <div className="bg-purple-600 rounded-full p-1">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-2 text-center">
                  <p className="text-sm font-medium">{style.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
} 