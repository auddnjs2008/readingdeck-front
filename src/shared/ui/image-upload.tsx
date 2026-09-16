import { ImagePlus } from "lucide-react";

type Props = {
  selectedFile: File | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function ImageUploader({ selectedFile, handleChange }: Props) {
  return (
    <label className="group relative mt-4 flex w-full cursor-pointer items-center gap-4 border border-border px-4 py-4 transition-colors hover:bg-muted/30">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-border text-muted-foreground transition-colors group-hover:text-foreground">
        <ImagePlus className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-sm font-medium text-foreground">
          표지 이미지 선택
        </span>
        <span className="mt-1 block truncate text-xs text-muted-foreground">
          {selectedFile?.name ?? "PNG, JPG, GIF 또는 SVG 파일"}
        </span>
      </span>
      <input
        className="absolute inset-0 cursor-pointer opacity-0"
        type="file"
        accept="image/*"
        onChange={handleChange}
      />
    </label>
  );
}
