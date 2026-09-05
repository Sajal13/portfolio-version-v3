import { GrPowerReset } from '@repo/icons/gr';
import { LuMinus, LuPlus } from '@repo/icons/lu';
import { Button } from '@repo/ui/components';

export const GraphControls = ({
  onZoomIn,
  onZoomOut,
  onReset
}: {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}) => {
  return (
    <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-1">
      <Button onClick={onZoomIn} className="w-7 h-7 text-sm">
        <LuPlus className="size-4" />
      </Button>
      <Button onClick={onZoomOut} className="w-7 h-7 text-sm ">
        <LuMinus className="size-4" />
      </Button>
      <Button onClick={onReset} className="w-7 h-7 ">
        <GrPowerReset className="size-4" />
      </Button>
    </div>
  );
};
