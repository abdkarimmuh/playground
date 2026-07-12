export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl items-center px-4 py-6 text-center text-sm text-muted-foreground md:px-6">
        © {new Date().getFullYear()} created by{" "}
        <a
          href="https://abdkarim.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold underline-offset-4 hover:text-foreground hover:underline"
        >
          Muhammad Abdul Karim
        </a>
      </div>
    </footer>
  );
}
