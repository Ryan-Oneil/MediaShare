import { AuthProvider } from "@/features/Auth/components/AuthProvider";
import Chakra from "@/features/base/Chakra";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head></head>
      <AuthProvider>
        <Chakra>
          <body>{children}</body>
        </Chakra>
      </AuthProvider>
    </html>
  );
}
