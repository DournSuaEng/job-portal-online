"use client"

import { Category } from "@prisma/client"
import CategoryListItem from "./categories-list-item"

interface CategoriesListProps {
  categories: Category[]
}

const CategoriesList = ({ categories }: CategoriesListProps) => {
  return (
    <div
      className="w-full overflow-x-auto"
      style={{
        msOverflowStyle: "none", /* IE and Edge */
        scrollbarWidth: "none", /* Firefox */
      }}
    >
      <div className="flex flex-row gap-4 p-4 min-w-max">
        {categories.map((category) => (
          <CategoryListItem
            key={category.id}
            label={category.name}
            value={category.id}
          />
        ))}
      </div>
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Edge */
        }
      `}</style>
    </div>
  )
}

export default CategoriesList