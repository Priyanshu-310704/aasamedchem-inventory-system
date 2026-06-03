"use client"

export default function AdminError({ error }: { error: Error }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-800">
      {error.message || "Something went wrong."}
    </div>
  )
}
