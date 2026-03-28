import ClientLayout from "@/src/components/ClientLayout";

export default function ProtectLayout({children}: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
}