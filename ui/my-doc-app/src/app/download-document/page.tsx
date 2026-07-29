import DocumentDownloader from "../components/DocumentDownloader";
import AuthGuard from "../components/AuthGuard";

export default function ManageDocumentPage() {
  return (
    <AuthGuard>
      <DocumentDownloader />
    </AuthGuard>
  );
}
