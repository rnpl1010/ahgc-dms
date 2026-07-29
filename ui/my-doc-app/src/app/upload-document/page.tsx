import DocumentUploader from "../components/DocumentUploader";
import AuthGuard from "../components/AuthGuard";

export default function ManageDocumentPage() {
  return (
    <AuthGuard>
      <DocumentUploader />
    </AuthGuard>
  );
}
