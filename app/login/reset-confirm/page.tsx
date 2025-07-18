export default function ResetConfirmationPage() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow text-center space-y-4">
        <h2 className="text-2xl font-bold">Please, check your email!</h2>
        <p className="text-gray-600">
          We've sent a password reset link to your email. Please check your
          inbox.
        </p>
      </div>
    </section>
  );
}
