export default function AuthError() {
  return (
    <div className="container mx-auto flex h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600">Authentication Error</h2>
        <p className="mt-2 text-muted-foreground">
          There was a problem signing you in. Please try again.
        </p>
      </div>
    </div>
  )
}