import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  className = "" 
}) => {
const allCategory = { Id: "all", Name: "All", color_c: "#6B7280", icon_c: "Grid3X3" }
  const filterCategories = [allCategory, ...categories]

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {filterCategories.map((category) => {
const isActive = selectedCategory === category.Name || 
                         (selectedCategory === "" && category.Id === "all")
        return (
          <motion.button
            key={category.Id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryChange(category.Id === "all" ? "" : category.name)}
            className={cn(
              "inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
            )}
          >
            <ApperIcon 
name={category.icon_c} 
              size={14}
              className="shrink-0" 
              style={!isActive ? { color: category.color_c } : {}}
            />
            <span>{category.Name}</span>
          </motion.button>
        )
      })}
    </div>
  )
}

export default CategoryFilter