import CardDetailModalShell from "@/entities/card/ui/card-detail-modal-shell";
import CardDetailScene from "@/entities/card/ui/card-detail-scene";

export default function CardDetailModalPage() {
  return (
    <CardDetailModalShell>
      <CardDetailScene asModal />
    </CardDetailModalShell>
  );
}
