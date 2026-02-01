import { ImagePlus } from "lucide-react";

type Props = {
  selectedFile: File | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function ImageUploader({ selectedFile, handleChange }: Props) {
  return (
    <label className="group relative flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/60 bg-muted/30 p-8 text-center transition-colors hover:border-border hover:bg-muted/50">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/70 text-muted-foreground transition-colors group-hover:text-foreground">
        <ImagePlus className="h-5 w-5" />
      </div>
      <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
        Click to upload cover image
      </p>
      {selectedFile ? (
        <p className="mt-1 text-xs text-foreground/80">{selectedFile.name}</p>
      ) : null}
      <p className="mt-1 text-xs text-muted-foreground/70">
        SVG, PNG, JPG or GIF (max. 2MB)
      </p>
      <input
        className="absolute inset-0 cursor-pointer opacity-0"
        type="file"
        accept="image/*"
        onChange={handleChange}
      />
    </label>
  );
}
