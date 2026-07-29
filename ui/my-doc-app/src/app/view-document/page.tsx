import DocumentViewer from "../components/DocumentViewer";
import AuthGuard from "../components/AuthGuard";

export default function ManageDocumentPage() {
  return (
    <AuthGuard>
      <DocumentViewer />
    </AuthGuard>
  );
}
