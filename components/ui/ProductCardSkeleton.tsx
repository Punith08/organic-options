export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden animate-pulse">
      <div className="aspect-square bg-stone-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-20 bg-stone-200 rounded-full" />
        <div className="h-4 bg-stone-200 rounded-full" />
        <div className="h-4 w-3/4 bg-stone-200 rounded-full" />
        <div className="flex items-center justify-between pt-1">
          <div className="h-5 w-16 bg-stone-200 rounded-full" />
          <div className="h-9 w-9 bg-stone-200 rounded-full" />
        </div>
        <div className="h-10 bg-stone-200 rounded-full mt-2" />
      </div>
    </div>
  )
}

export function MiniProductCardSkeleton() {
  return (
    <div className="flex items-center gap-3 p-2 animate-pulse">
      <div className="w-12 h-12 rounded-lg bg-stone-200 shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 bg-stone-200 rounded-full" />
        <div className="h-3 w-12 bg-stone-200 rounded-full" />
      </div>
    </div>
  )
}
